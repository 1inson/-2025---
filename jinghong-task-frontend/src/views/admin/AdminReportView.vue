<template>
  <div class="report-approval-container">
    <h2>待审批举报列表</h2>
    <p class="subtitle">请审核以下由学生提交的举报信息。</p>

    <div v-if="isLoading" class="loading-state">正在加载列表...</div>
    <div v-else-if="loadingError" class="error-state">
      加载失败: {{ loadingError }}
    </div>
    <div v-else-if="reportList.length === 0" class="empty-state">
      太棒了！当前没有待处理的举报。
    </div>

    <div v-else class="report-list">
      <div v-for="report in reportList" :key="report.report_id" class="report-card">
        <div class="card-header">
          <span>被举报 ID: {{ report.report_id }}</span>
          <span>被举报者: {{ report.username }}</span>
        </div>
        <div class="card-body">
          <p><strong>被举报帖子 (ID: {{ report.post_id }}) 内容:</strong></p>
          <div class="reported-content">{{ report.content }}</div>
          <p><strong>举报原因:</strong></p>
          <div class="report-reason">{{ report.reason }}</div>
        </div>
        <div class="card-footer">

          <button @click="handleApprove(report.report_id)" class="button-approve">
            通过 (确认违规)
          </button>
          <button @click="handleReject(report.report_id)" class="button-reject">
            驳回 (无问题)
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUnapprovedReports, approveReport } from '@/api/admin.js';
import { useUserStore } from '@/store/user.js';

const reportList = ref([]);
const isLoading = ref(true);
const loadingError = ref(null);
const userStore = useUserStore();

const fetchReports = async () => {
  try {
    isLoading.value = true;
    const response = await getUnapprovedReports({ user_id: userStore.userId });
    
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

const handleApproval = async (reportId, approvalStatus) => {
  // approvalStatus: 1 代表驳回(不删帖), 2 代表通过(删除帖子)驳回(不删帖)
  const actionText = approvalStatus == 1 ? '驳回' : '通过并删除帖子';
  
  if (!confirm(`确定要【${actionText}】这个举报吗？(ID: ${reportId})`)) {
    return;
  }
  
  try {
    const response = await approveReport({
      user_id: userStore.userId, // 管理员自己的 ID
      report_id: reportId,
      approval: approvalStatus
    });

    const result = response.data;
    if (result.code == 200 ) {
      alert(`操作成功：已【${actionText}】`);
      reportList.value = reportList.value.filter(report => report.report_id !== reportId);

    } else {
      alert(`操作失败: ${result.msg}`);
    }
  } catch (error) {
    console.error('审批请求失败:', error);
    alert('操作失败，请检查网络或联系管理员。');
  }
};

const handleApprove = (reportId) => {
  // approval: 2 代表删除帖子
  handleApproval(reportId, 2);
};

const handleReject = (reportId) => {
  // approval: 1 代表不删帖
  handleApproval(reportId, 1);
};

onMounted(fetchReports);
</script>

<style scoped>
.report-approval-container {
  max-width: 900px;
  margin: 0 auto;
  font-family: sans-serif;
}
h2 {
  font-size: 2rem;
  color: #333;
}
.subtitle {
  color: #666;
  margin-bottom: 2.5rem;
}
.report-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.report-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;  /* 左中右 */
  background-color: #f7f7f7;
  padding: 0.8rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
  font-size: 0.9rem;
}
.card-body {
  padding: 1.5rem;
}
.card-body p {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
}
.reported-content, .report-reason {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  word-break: break-all;
}
.card-footer {
  padding: 1rem 1.5rem;
  text-align: right;
  border-top: 1px solid #e0e0e0;
}
.card-footer button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
.button-approve {
  background-color: #28a745;
}
.button-reject {
  background-color: #6c757d;
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  color: #888;
  padding: 3rem;
  font-size: 1.2rem;
}
</style>