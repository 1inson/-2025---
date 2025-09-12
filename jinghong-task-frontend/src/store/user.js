//全局状态储存
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    userType: null, 
    token: null,    // token 是用来存 JWT 的
  }),
  
  actions: {
    loginSuccess(data) {
      const { user_id, user_type } = data;

      this.userId = user_id;
      this.userType = user_type; 
      // this.token = data.token;
    },
    logout() {
      // 把所有 state 重置为初始值，并且会自动同步持久化插件
      this.$reset();
    }
  },

  //持久化
  persist: true,
})