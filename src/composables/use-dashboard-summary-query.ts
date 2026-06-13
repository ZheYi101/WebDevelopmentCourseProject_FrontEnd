import { useQuery } from '@tanstack/vue-query'

import { QUERY_KEY } from '@/constants/query-key'
import { dashboardService } from '@/services/dashboard-service'

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: QUERY_KEY.dashboardSummary,
    queryFn: () => dashboardService.getSummary(),
  })
}
