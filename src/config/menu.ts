import type { AppMenuItem } from '@/types/menu'

export const appMenus: AppMenuItem[] = [
  {
    key: 'dashboard',
    label: '首页仪表盘',
    icon: 'Odometer',
    to: '/dashboard',
    roles: ['system_admin', 'department_manager', 'technical_director', 'general_manager', 'audit_admin'],
  },
  {
    key: 'users',
    label: '用户与角色',
    icon: 'User',
    to: '/system/users',
    roles: ['system_admin'],
  },
  {
    key: 'teams',
    label: '团队与成员',
    icon: 'UserFilled',
    to: '/organization/teams',
    roles: ['system_admin', 'department_manager'],
  },
  {
    key: 'projects',
    label: '项目管理',
    icon: 'Management',
    to: '/projects',
    roles: ['department_manager', 'technical_director'],
  },
  {
    key: 'tasks',
    label: '周任务管理',
    icon: 'List',
    to: '/tasks',
    roles: ['department_manager', 'technical_director', 'general_manager'],
  },
  {
    key: 'reports',
    label: '周报管理',
    icon: 'Document',
    to: '/reports',
    roles: ['department_manager', 'technical_director', 'general_manager'],
  },
  {
    key: 'assessments',
    label: '月度考核',
    icon: 'DataAnalysis',
    to: '/assessments',
    roles: ['department_manager', 'technical_director', 'general_manager'],
  },
  {
    key: 'statistics',
    label: '统计分析',
    icon: 'TrendCharts',
    to: '/statistics',
    roles: ['department_manager', 'technical_director', 'general_manager', 'audit_admin'],
  },
  {
    key: 'audit-logs',
    label: '审计日志',
    icon: 'Tickets',
    to: '/audit-logs',
    roles: ['audit_admin', 'system_admin'],
  },
]
