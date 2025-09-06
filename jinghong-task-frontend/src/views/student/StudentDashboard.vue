<template>
  <div class="dashboard-welcome">
    <h1>欢迎回来，同学 (ID: {{ userStore.userId }})！</h1>
    <p>你可以从左侧导航栏开始你的操作。</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user.js';
const userStore = useUserStore();
</script>

<style scoped>
.dashboard-welcome {
  text-align: center;
  margin-top: 4rem;
}
.dashboard-welcome h1 {
  font-size: 2.5rem;
  color: #333;
}
.dashboard-welcome p {
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}
</style>