<template>
  <div class="posts-list-container">
    <h2>全部动态</h2>
    <div v-if="isLoading" class="loading-state">加载中...</div>
    <div v-else-if="loadingError" class="error-state">
      加载失败: {{ loadingError }}
    </div>
    <div v-else-if="postList.length === 0" class="empty-state">
      还没有任何帖子，快去发布第一条吧！
    </div>
    <ul v-else class="posts-list">
      <li v-for="post in postList" :key="post.id" class="post-item">
        <div class="post-content">{{ post.content }}</div>
        <div class="post-meta">
          <span>发布者ID: {{ post.user_id }}</span>
          <span>时间: {{ formatTime(post.time) }}</span>
          <div 
            class="like-section" 
            :class="{ 'liked': post.is_liked }" 
            @click="handleLike(post)"
          >
            <IconThumbUp class="like-icon" />
            <LikeUpdater :post-id="post.id" :initial-likes="post.likes" />
        </div>
        </div>
        <div class="post-actions">
          <!-- 修改按钮 -->
          <button 
            v-if="post.user_id == userStore.userId"
            @click="openEditModal(post)" 
            class="edit-button"
          >
            修改
          </button>

          <!-- 举报按钮 -->
          <button @click="openReportModal(post.id)" class="report-button">
            举报
          </button>

          <!-- 删除按钮 -->
          <button 
            v-if="post.user_id == userStore.userId" 
            @click="handleDeletePost(post.id)" 
            class="delete-button"
          >
            删除
          </button>
        </div>
      </li>
    </ul>

    <div v-if="isReportModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>举报帖子 (ID: {{ reportingPostId }})</h3>
        <textarea 
          v-model="reportReason"
          placeholder="请输入举报原因..."
          rows="5"
        ></textarea>
        <div class="modal-actions">
          <button @click="closeReportModal" class="button-cancel">取消</button>
          <button @click="handleReportSubmit" class="button-confirm">提交举报</button>
        </div>
      </div>
    </div>

    <div v-if="isEditModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>修改帖子 (ID: {{ editingPost.id }})</h3>
        <textarea 
          v-model="editingPost.content"
          rows="8"
        ></textarea>
        <div class="modal-actions">
          <button @click="closeEditModal" class="button-cancel">取消</button>
          <button @click="handleEditSubmit" class="button-confirm">确认修改</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import LikeUpdater from '@/components/LikeUpdater.vue';
import { getAllPosts, deletePost, reportPost, updatePost, likePost } from '@/api/student.js';
import { useUserStore } from '@/store/user.js';
import IconThumbUp from '@/components/IconThumbUp.vue';


const postList = ref([]); 
const isLoading = ref(true); 
const loadingError = ref(null); 
const userStore = useUserStore();

const isReportModalVisible = ref(false);
const reportingPostId = ref(null);
const reportReason = ref('');

const isEditModalVisible = ref(false);
//reactive 来存储一个对象
const editingPost = reactive({
  id: null,
  content: ''
});


const fetchPosts = async () => {
  try {
    isLoading.value = true; 
    loadingError.value = null;
    const response = await getAllPosts();
    const result = response.data;

    if (result.code == 200) {
       postList.value = result.data.post_list.sort((a, b) => new Date(b.time) - new Date(a.time));
      }
    else {
      throw new Error(result.msg);
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    loadingError.value = error.message; 
    stopPolling(); // 如果接口出错，停止轮询，防止不断发送错误请求
  } finally {
    isLoading.value = false; 
  }
};


const handleLike = async (post) => {
  // 状态锁
  if (post.isLiking) return; 
  post.isLiking = true;

  if (post.is_liked) {
    // 如果已点赞，则取消点赞
    post.likes--;
    post.is_liked = false;
  } else {
    // 如果未点赞，则点赞
    post.likes++;
    post.is_liked = true;
  }

  try {
    await likePost({
      post_id: post.id,
      user_id: userStore.userId
    });
  } catch (error) {
    console.error("点赞/取消点赞失败:", error);
    if (post.is_liked) { 
      post.likes--;
      post.is_liked = false;
    } else { 
      post.likes++;
      post.is_liked = true;
    }
    alert("操作失败，请重试");
  } finally {
    post.isLiking = false; 
  }
};


const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleString(); 
};

const handleDeletePost = async (postId) => {
  if (!confirm('确定要删除这条帖子吗？')) {
    return;
  }
  
  try {
    const response = await deletePost({
      user_id: userStore.userId,
      post_id: postId
    });

    const result = response.data;
    if (result.code == 200) {
      alert('删除成功！');
      postList.value = postList.value.filter(post => post.id !== postId);
    } else {
      alert(`删除失败: ${result.msg}`);
    }
  } catch (error) {
    console.error('删除帖子请求失败:', error);
    alert('删除失败，请检查网络或联系管理员。');
  }
};



const openReportModal = (postId) => {
  reportingPostId.value = postId;
  isReportModalVisible.value = true;
};

const closeReportModal = () => {
  isReportModalVisible.value = false;
  reportingPostId.value = null;
  reportReason.value = '';
};

const handleReportSubmit = async () => {
  const reason = reportReason.value.trim();
  if (!reason) {
    alert('举报原因不能为空！');
    return;
  }

  try {
    const response = await reportPost({
      user_id: userStore.userId,
      post_id: reportingPostId.value,
      reason: reason
    });
    
    const result = response.data;
    if (result.code === 200) {
      alert('举报成功，感谢您的反馈！');
      closeReportModal();
    } else {
      alert(`举报失败: ${result.msg}`);
    }
  } catch (error) {
    console.error('举报请求失败:', error);
    alert('举报失败，请检查网络或联系管理员。');
  }
};


const openEditModal = (post) => {
  editingPost.id = post.id;
  editingPost.content = post.content;
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  // 清空数据
  editingPost.id = null;
  editingPost.content = '';
};

const handleEditSubmit = async () => {
  const newContent = editingPost.content.trim();
  if (!newContent) {
    alert('帖子内容不能为空！');
    return;
  }

  try {
    const response = await updatePost({
      user_id: userStore.userId,
      post_id: editingPost.id,
      content: newContent
    });

    const result = response.data;
    if (result.code === 200) {
      alert('修改成功！');

      const postInList = postList.value.find(p => p.id === editingPost.id);
      if (postInList) {
        postInList.content = newContent;
      }
      
      closeEditModal(); // 关闭弹窗
    } else {
      alert(`修改失败: ${result.msg}`);
    }
  } catch (error) {
    console.error('修改帖子请求失败:', error);
    alert('修改失败，请检查网络或联系管理员。');
  }
};




onMounted(() => {
  fetchPosts();
});


</script>



<style scoped>
.posts-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.posts-list-container h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.posts-list {
  list-style-type: none;
  padding: 0;
}

.post-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 3.5rem; 
  transition: box-shadow 0.2s;
}

.post-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.post-content {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  /* 保留用户输入时的换行和空格 */
  white-space: pre-wrap; 
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #888;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  color: #888;
  padding: 2rem;
  font-size: 1.1rem;
}

.post-actions {
  position: absolute;
  right: 1.5rem;
  bottom: 1rem;
  display: flex;
  gap: 0.5rem; 
}

.delete-button, .report-button, .edit-button {
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s;
  color: white;
}

.delete-button:hover, .report-button:hover, .edit-button:hover {
  opacity: 1;
}

.delete-button {
  background-color: #dc3545; 
}
.delete-button:hover {
  background-color: #c82333;
}

.report-button {
  background-color: #ffc107; 
  color: #212529;
}
.report-button:hover {
  background-color: #e0a800;
}

.edit-button {
  background-color: #17a2b8; 
}
.edit-button:hover {
  background-color: #138496;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.modal-actions {
  margin-top: 1.5rem;
  text-align: right;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
  font-weight: bold;
}

.button-cancel {
  background-color: #6c757d;
  color: white;
}

.button-confirm {
  background-color: #007bff;
  color: white;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}
.like-section:hover {
  color: #007bff;
}
.like-icon {
  width: 18px; 
  height: 18px;
  transition: all 0.2s;
}

.like-section.liked {
  color: #007bff; 
  font-weight: bold;
}
.like-section.liked .like-icon {
  fill: #007bff; 
  transform: scale(1.1); /* 图标放大一点点，增加动感 */
}
</style>