<template>
  <div class="login-container">
    <h2>精弘论坛 - 登录</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">学号</label>
        
        <input type="text" id="username" v-model="username" placeholder="请输入你的学号">
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" placeholder="请输入你的密码">
      </div>
      
      <button type="submit" class="login-button">登 录</button>
    </form>
  </div>
</template>

<script setup>
//用来创建响应式变量
import { ref } from 'vue'
// 用来跳转页面
import { useRouter } from 'vue-router'

import { login } from '@/api/user.js'
import { useUserStore } from '@/store/user.js'

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()


const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('学号和密码不能为空！') // 这就是用户友好的提示
    return
  }

  try {

    const response = await login({
      username: username.value,
      password: password.value
    })

    const result = response.data

    if (result.code == 200) {
      alert('登录成功！')

      userStore.loginSuccess(result.data)

      if (result.data.user_type == 1) {
        // 跳转到学生页面
        router.push('/student/dashboard')
      } else if (result.data.user_type == 2) {
        // 跳转到管理员页面
        router.push('/admin/dashboard')
      }
    }
    else if (result.code == 200506) {
      alert(`用户不存在`)
    }
    else if (result.code == 200507) {
      alert(`密码错误`)
    }

  } catch (error) {
    console.error('登录请求出错:', error)
    alert('登录失败，请检查网络或联系管理员。') 
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.login-button:hover {
  background-color: #0056b3;
}
</style>