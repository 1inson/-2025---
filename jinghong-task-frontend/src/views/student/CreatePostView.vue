<template>
      <div class="create-post-container">
        <h2>发布新帖子</h2>
        <p>在这里分享你的新鲜事吧。</p>
        <form @submit.prevent="handlePostSubmit" class="post-form">
          <textarea 
            v-model="postContent" 
            placeholder="有什么想分享的？..."
            rows="8"
          ></textarea>
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? '发布中...' : '发 布' }}
          </button>
        </form>
      </div>
    </template>

    <script setup>
    import { ref } from 'vue';
    import { useUserStore } from '@/store/user.js';
    import { createPost } from '@/api/student.js';
    import { useRouter } from 'vue-router';

    const postContent = ref('');
    const isSubmitting = ref(false);
    const userStore = useUserStore();
    const router = useRouter();

    const handlePostSubmit = async () => {
      if (!userStore.userId) {
        alert('用户登录状态异常，请重新登录！');
        return;
      }
      const content = postContent.value.trim();
      if (!content) {
        alert('帖子内容不能为空！'); 
        return;
      }
      if (isSubmitting.value) return;

      try {
        isSubmitting.value = true; 
        const response = await createPost({
          content: content,
          user_id: userStore.userId //全局状态读取
        });
        const result = response.data;

        if (result.code === 200) {
          alert('发布成功！');
          postContent.value = ''; 
          router.push('/student/posts-list');
        } else {
          alert(`发布失败: ${result.msg}`);
        }
      } catch (error) {
        console.error('发布帖子请求出错:', error);
        alert('发布失败，请检查网络或联系管理员。');
      } finally {
        isSubmitting.value = false; //按钮复用
      }
    };
    </script>

    <style scoped>
    .create-post-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .create-post-container h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .create-post-container p {
      color: #666;
      margin-bottom: 2rem;
    }
    .post-form {
      display: flex;
      flex-direction: column; /* 垂直排列 */
      flex-grow: 1; /* 填充剩余空间 */
    }
    .post-form textarea {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      resize: vertical; /* 可垂直伸缩 */
      margin-bottom: 1rem;
    }
    .submit-button {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    .submit-button:disabled {
      background-color: #a0cffc;
      cursor: not-allowed;
    }
    </style>