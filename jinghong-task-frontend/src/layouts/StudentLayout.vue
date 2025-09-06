<template>
      <div class="student-layout">
        <aside class="sidebar">
          <div class="logo">精弘导航</div>
          <nav class="navigation">
            <RouterLink to="/student/dashboard" class="nav-link">首页看板</RouterLink>
            <RouterLink to="/student/create-post" class="nav-link">发布帖子</RouterLink>
            <RouterLink to="/student/posts-list" class="nav-link">动态列表</RouterLink>
            <RouterLink to="/student/my-reports" class="nav-link">我的消息</RouterLink>
          </nav>
        </aside>
        <main class="main-content">
          <RouterView />
        </main>
      </div>
    </template>

    <script setup>
    import { RouterLink, RouterView } from 'vue-router';
    </script>

    <style scoped>
    .student-layout {
      display: flex;
      height: 100vh;
    }

    .sidebar {
      width: 220px;
      background-color: #2c3e50;
      color: white;
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2rem;
    }

    .navigation {
      display: flex;
      flex-direction: column;
    }

    .nav-link {
      color: #bdc3c7;
      text-decoration: none;
      padding: 1rem 1.5rem;
      transition: background-color 0.2s, color 0.2s;
    }

    .nav-link:hover {
      background-color: #34495e;
      color: white;
    }

    .router-link-exact-active {
      background-color: #1abc9c;
      color: white;
      font-weight: bold;
    }

    .main-content {
      flex-grow: 1;
      padding: 2rem;
      overflow-y: auto;
      background-color: #f4f7f6;
    }
    </style>