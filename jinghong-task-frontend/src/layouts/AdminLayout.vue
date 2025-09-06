<template>
      <div class="admin-layout">
        <aside class="sidebar">
          <div class="logo">管理员后台</div>
          <nav class="navigation">
            <RouterLink to="/admin/dashboard" class="nav-link">后台首页</RouterLink>
            <RouterLink to="/admin/reports" class="nav-link">举报审批</RouterLink>
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
    .admin-layout { 
        display: flex; 
        height: 100vh; }
    .sidebar { 
        width: 220px; 
        background-color: #343a40;
        color: white; padding: 1.5rem 0;
        flex-shrink: 0; }
    .logo {
        font-size: 1.5rem; 
        text-align: center; 
        margin-bottom: 2rem; 
        font-weight: bold; }
    .navigation { 
        display: flex; 
        flex-direction: column; }
    .nav-link { 
        color: #ced4da; 
        text-decoration: none; 
        padding: 1rem 1.5rem; 
        transition: background-color 0.2s, color 0.2s; }
    .nav-link:hover { 
        background-color: #495057; 
        color: white; }
    .router-link-exact-active { 
        background-color: #007bff; 
        color: white; }
    .main-content { 
        flex-grow: 1; 
        padding: 2rem; 
        overflow-y: auto; 
        background-color: #f8f9fa; }
    </style>