<script setup lang="ts">
import { computed } from 'vue'

import LineTrendChart from '@/components/charts/LineTrendChart.vue'
import RadarScoreChart from '@/components/charts/RadarScoreChart.vue'
import PageSection from '@/components/common/PageSection.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import { useDashboardSummaryQuery } from '@/composables/use-dashboard-summary-query'
import { useMonthlyStatisticsQuery, useYearlyStatisticsQuery } from '@/composables/use-statistics'
import type { DashboardMetric } from '@/types/dashboard'
import { formatScore } from '@/utils/format'

const currentDate = new Date()
const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
const currentYear = String(currentDate.getFullYear())

const summaryQuery = useDashboardSummaryQuery()
const monthlyQuery = useMonthlyStatisticsQuery(
  computed(() => ({
    month: currentMonth,
  })),
)
const yearlyQuery = useYearlyStatisticsQuery(
  computed(() => ({
    year: currentYear,
  })),
)

const metrics = computed<DashboardMetric[]>(() => {
  const summary = summaryQuery.data.value
  const monthly = monthlyQuery.data.value

  return [
    {
      label: '本月平均得分',
      value: formatScore(summary?.currentMonthAverageScore ?? monthly?.averageScore),
      trend: `最高分 ${formatScore(monthly?.highestScore)}`,
      tone: 'success',
      description: `最低分 ${formatScore(monthly?.lowestScore)}，已考核 ${monthly?.assessedCount ?? 0} 人`,
    },
    {
      label: '待处理考核',
      value: String(summary?.pendingAssessments ?? 0),
      trend: '月度评分待推进',
      tone: 'warning',
      description: '涉及待评分、待归档的月度考核单',
    },
    {
      label: '逾期任务数',
      value: String(summary?.overdueTasks ?? 0),
      trend: '任务闭环重点跟踪',
      tone: 'danger',
      description: '建议优先检查阻塞任务和进度滞后项',
    },
    {
      label: '周报待评审',
      value: String(summary?.weeklyReportsPendingReview ?? 0),
      trend: `活跃项目 ${summary?.activeProjects ?? 0} 个`,
      tone: 'primary',
      description: '用于经理和总监快速定位本周审批压力',
    },
  ]
})

const trendLabels = computed(() => yearlyQuery.data.value?.monthlyTrend.map((item) => item.month) ?? [])
const trendValues = computed(() => yearlyQuery.data.value?.monthlyTrend.map((item) => item.averageScore) ?? [])
const teamComparison = computed(() => monthlyQuery.data.value?.teamComparison ?? [])

const radarIndicators = computed(() =>
  teamComparison.value.map((item) => ({
    name: item.teamName,
    max: 100,
  })),
)

const radarValues = computed(() => teamComparison.value.map((item) => item.averageScore))

const alerts = computed(() => {
  const summary = summaryQuery.data.value
  const monthly = monthlyQuery.data.value

  return [
    {
      title: '考核推进',
      value: `${summary?.pendingAssessments ?? 0} 项`,
      description: '本月待推进的月度考核数量。',
    },
    {
      title: '周报审批',
      value: `${summary?.weeklyReportsPendingReview ?? 0} 份`,
      description: '待经理评审的周报总量。',
    },
    {
      title: '成绩波动',
      value: monthly ? `${formatScore(monthly.highestScore)} / ${formatScore(monthly.lowestScore)}` : '-',
      description: '当前月份的最高分与最低分。',
    },
  ]
})
</script>

<template>
  <section class="dashboard-grid">
    <MetricCard v-for="item in metrics" :key="item.label" :item="item" />
  </section>

  <section class="content-grid">
    <PageSection title="年度得分趋势" description="基于年度统计接口展示月均分变化，用于观察团队绩效走势。">
      <template v-if="trendLabels.length">
        <LineTrendChart :labels="trendLabels" :values="trendValues" series-name="平均得分" />
      </template>
      <div v-else class="empty-block">暂无年度趋势数据</div>
    </PageSection>

    <PageSection title="本月团队对比" description="将当前月份各团队平均分映射为雷达图，适合答辩时展示横向对比。">
      <template v-if="radarIndicators.length">
        <RadarScoreChart :indicators="radarIndicators" :values="radarValues" />
      </template>
      <div v-else class="empty-block">暂无团队对比数据</div>
    </PageSection>
  </section>

  <PageSection title="重点提醒" description="结合统计结果，将本月最值得跟进的事项压缩到首页。">
    <el-row :gutter="16">
      <el-col v-for="item in alerts" :key="item.title" :xs="24" :md="8">
        <el-card class="summary-card" shadow="hover">
          <strong>{{ item.title }}</strong>
          <p>{{ item.value }}</p>
          <p>{{ item.description }}</p>
        </el-card>
      </el-col>
    </el-row>
  </PageSection>
</template>

<style scoped lang="scss">
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.summary-card {
  height: 100%;
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  background: var(--theme-surface-muted);
  box-shadow: var(--theme-shadow-soft);
}

.summary-card p {
  margin-top: 10px;
  color: var(--theme-foreground-secondary);
}

.empty-block {
  display: grid;
  place-items: center;
  min-height: 220px;
  color: var(--theme-foreground-secondary);
}

@media (max-width: 1440px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
