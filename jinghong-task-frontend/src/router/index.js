import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import StudentLayout from '../layouts/StudentLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/student',
    name: 'Student',
    component: StudentLayout,
    children: [
      {

        path: 'dashboard', 
        name: 'StudentDashboard',
        component: () => import('../views/student/StudentDashboard.vue')
      },
      {
        path: 'create-post',
        name: 'CreatePost',
        component: () => import('../views/student/CreatePostView.vue')
      },
      {
        path: 'posts-list',
        name: 'PostsList',
        component: () => import('../views/student/PostsListView.vue')
      },
      {
        path: 'my-reports',
        name: 'MyReports',
        component: () => import('../views/student/MyReportsView.vue')
      }
    ]
  },



  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboardView.vue') 
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('../views/admin/AdminReportView.vue')
      }
    ]
  }
]



const router = createRouter(
    {
      history: createWebHistory(),
      routes
    }
)

export default router

