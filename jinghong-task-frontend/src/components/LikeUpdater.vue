<template>
  <span ref="likeSpan">{{ currentLikes }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { getLikes } from '@/api/student.js';
import { useUserStore } from '@/store/user.js';

const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  initialLikes: {
    type: Number,
    required: true
  }
});

const currentLikes = ref(props.initialLikes);
const likeSpan = ref(null); // 用于获取DOM元素
const userStore = useUserStore();
let observer = null;
let pollingTimer = null;

//轮询函数
const updateLikes = async () => {
  try {
    const response = await getLikes({
      post_id: props.postId,
      user_id: userStore.userId
    });
    if (response.data.code == 200) {
      currentLikes.value = response.data.data;
    }
  } catch (error) {
    console.error(`Failed to update likes for post ${props.postId}:`, error);
    stopPolling(); // 出错时停止
  }
};

const startPolling = () => {
  if (pollingTimer) clearInterval(pollingTimer);
  // 每5秒更新一次
  pollingTimer = setInterval(updateLikes, 5000);
};

const stopPolling = () => {
  clearInterval(pollingTimer);
  pollingTimer = null;
};

watch(() => props.initialLikes, (newValue) => {
  // 这个函数会在父组件传递过来的 initialLikes prop 发生变化时被调用
  console.log(`LikeUpdater for post ${props.postId} received new likes from parent: ${newValue}`);
  // 把最新的值同步到子组件的内部状态
  currentLikes.value = newValue;
});

// 监听DOM元素是否进入视野
onMounted(() => {
  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 当元素进入视野时
        console.log(`Post ${props.postId} is visible, starting polling.`);
        startPolling();
      } else {
        // 当元素离开视野时
        console.log(`Post ${props.postId} is not visible, stopping polling.`);
        stopPolling();
      }
    });
  };

  observer = new IntersectionObserver(callback);
  observer.observe(likeSpan.value); // 开始观察 span 元素
});


onUnmounted(() => {
  stopPolling(); // 停止轮询
  if (observer) {
    observer.disconnect(); // 停止观察
  }
});
</script>