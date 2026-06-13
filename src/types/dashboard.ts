export interface DashboardMetric {
  label: string
  value: string
  trend: string
  tone: 'primary' | 'success' | 'warning' | 'danger'
}

export interface PendingTask {
  title: string
  owner: string
  deadline: string
  status: string
}
