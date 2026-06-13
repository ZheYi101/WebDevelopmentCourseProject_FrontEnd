import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { appTitle, defaultRoutePath } from '@/configs/app'
import type { RoleCode } from '@/constants/roles'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const allRoles: RoleCode[] = [
  'system_admin',
  'department_manager',
  'technical_director',
  'general_manager',
  'audit_admin',
]

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: {
      title: '登录',
      guestOnly: true,
    },
  },
  {
    path: '/',
    component: MainLayout,
    redirect: defaultRoutePath,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: {
          title: '首页仪表盘',
          roles: allRoles,
        },
      },
      {
        path: 'system/users',
        name: 'users',
        component: () => import('@/views/system/UserManagementView.vue'),
        meta: {
          title: '用户与角色',
          roles: ['system_admin'],
        },
      },
      {
        path: 'organization/teams',
        name: 'teams',
        component: () => import('@/views/organization/TeamManagementView.vue'),
        meta: {
          title: '团队与成员',
          roles: ['system_admin', 'department_manager'],
        },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/views/projects/ProjectManagementView.vue'),
        meta: {
          title: '项目管理',
          roles: ['department_manager', 'technical_director'],
        },
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/views/tasks/TaskManagementView.vue'),
        meta: {
          title: '周任务管理',
          roles: ['department_manager', 'technical_director', 'general_manager'],
        },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/reports/WeeklyReportView.vue'),
        meta: {
          title: '周报管理',
          roles: ['department_manager', 'technical_director', 'general_manager'],
        },
      },
      {
        path: 'assessments',
        name: 'assessments',
        component: () => import('@/views/assessments/AssessmentView.vue'),
        meta: {
          title: '月度考核',
          roles: ['department_manager', 'technical_director', 'general_manager'],
        },
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('@/views/statistics/StatisticsView.vue'),
        meta: {
          title: '统计分析',
          roles: ['department_manager', 'technical_director', 'general_manager', 'audit_admin'],
        },
      },
      {
        path: 'audit-logs',
        name: 'audit-logs',
        component: () => import('@/views/audit/AuditLogView.vue'),
        meta: {
          title: '审计日志',
          roles: ['audit_admin', 'system_admin'],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/status/NotFoundView.vue'),
    meta: {
      title: '页面不存在',
    },
  },
]

export const routerConfig = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

routerConfig.beforeEach((to) => {
  const authStore = useAuthStore()
  const requiresGuest = Boolean(to.meta.guestOnly)

  document.title = `${String(to.meta.title ?? appTitle)} | ${appTitle}`

  if (requiresGuest && authStore.isLoggedIn) {
    return authStore.getDefaultRoute()
  }

  if (!requiresGuest && !authStore.isLoggedIn) {
    return '/login'
  }

  const allowedRoles = to.meta.roles as RoleCode[] | undefined
  if (allowedRoles && !allowedRoles.includes(authStore.auth.roleCode)) {
    return authStore.getDefaultRoute()
  }

  return true
})
