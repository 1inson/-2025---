<template>
  <div class="reports-container">
    <h2>我的举报记录</h2>
    <p class="subtitle">在这里查看你提交的举报以及管理员的审核结果。</p>

    <div v-if="isLoading" class="loading-state">正在加载举报记录...</div>
    <div v-else-if="loadingError" class="error-state">
      加载失败: {{ loadingError }}
    </div>
    <div v-else-if="reportList.length === 0" class="empty-state">
      你还没有任何举报记录。
    </div>

    <div v-else class="reports-list">
      <div v-for="report in reportList" :key="report.report_id" class="report-item">
        <div class="report-header">
          <span class="report-status" :class="statusClass(report.status)">
            {{ formatStatus(report.status) }}
          </span>
         
        </div>
        <div class="report-body">
          <p><strong>举报帖子内容 :</strong> <span class="preview-text">"{{ truncateText(report.content, 50)  }}"</span></p>
          <p><strong>我的举报原因:</strong> {{ report.reason }}</p>
        </div>
        <div v-if="report.admin_reply" class="report-footer">
          <strong>管理员回复:</strong> {{ report.admin_reply }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getReportList } from '@/api/student.js';
import { useUserStore } from '@/store/user.js';

const reportList = ref([]);
const isLoading = ref(true);
const loadingError = ref(null);
const userStore = useUserStore();

const fetchReports = async () => {
  try {
    isLoading.value = true;
    const response = await getReportList({ user_id: userStore.userId });
    if (response.data.code == 200) {
      reportList.value = response.data.data.report_list;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    loadingError.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

//文本截断
const truncateText = (text, maxLength) => {
  if (!text) return ''; 
  if (text.length <= maxLength) {
    return text; 
  }
  return text.substring(0, maxLength) + '...';
};

const formatStatus = (status) => {
  const statusMap = {
    0: '待审核',
    1: '已处理',
    2: '已驳回'
  };
  return statusMap[status] || '未知状态';
};

const statusClass = (status) => {
  return {
    'status-pending': status == 0,
    'status-rejected': status == 2,
    'status-approved': status == 1,
  };
};

onMounted(fetchReports);
</script>


<style scoped>
.reports-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
}
h2 {
  font-size: 2rem;
  color: #333;
}
.subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2.5rem;
}
.report-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-left: 5px solid #ffc107; /* 默认是待审核的颜色 */
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}
.report-item:hover {
  transform: translateY(-3px); /* 轻微上移 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #eee;
}
.report-status {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: bold;
  font-size: 0.9rem;
}
.status-pending { 
  background-color: #ffc107; 
  color: #333; }
.report-item.status-rejected { 
  border-left-color: #6c757d; }
.status-rejected { 
  background-color: #6c757d; 
  color: white; }
.report-item.status-approved { 
  border-left-color: #28a745; }
.status-approved { 
  background-color: #28a745; 
  color: white; }
.report-time { 
  font-size: 0.9rem; 
  color: #888; }
.report-body p { 
  margin: 0.8rem 0; 
  line-height: 1.6; }
.preview-text { 
  color: #555; 
  font-style: italic; }
.report-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #007bff;
  font-style: italic;
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  color: #888;
  padding: 3rem;
  font-size: 1.2rem;
}
</style>