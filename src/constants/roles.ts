export const roleOptions = [
  { label: '系统管理员', value: 'system_admin' },
  { label: '部门经理', value: 'department_manager' },
  { label: '技术总监', value: 'technical_director' },
  { label: '总经理', value: 'general_manager' },
  { label: '审计管理员', value: 'audit_admin' },
] as const

export type RoleCode = (typeof roleOptions)[number]['value']
