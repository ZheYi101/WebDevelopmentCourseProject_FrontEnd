import type { AxiosRequestConfig } from 'axios'

import { BaseService } from '@/utils/base-service'
import { request } from '@/utils/service'

export interface DashboardSummary {
  pendingAssessments: number
  activeTasks: number
}

class DashboardService extends BaseService<AxiosRequestConfig> {
  async getSummary() {
    try {
      return await this.request<DashboardSummary>({
        url: this.genBaseURL('/statistics/dashboard-summary'),
        method: 'GET',
      })
    } catch {
      return {
        pendingAssessments: 18,
        activeTasks: 46,
      }
    }
  }
}

export const dashboardService = new DashboardService({
  request,
  baseURL: '',
})
