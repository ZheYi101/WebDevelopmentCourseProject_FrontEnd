<script setup lang="ts">
import { computed } from 'vue'

import LineTrendChart from '@/components/charts/LineTrendChart.vue'
import RadarScoreChart from '@/components/charts/RadarScoreChart.vue'
import PageSection from '@/components/common/PageSection.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import { useDashboardSummaryQuery } from '@/composables/use-dashboard-summary-query'
import type { DashboardMetric, PendingTask } from '@/types/dashboard'

const summaryQuery = useDashboardSummaryQuery()

const metrics = computed<DashboardMetric[]>(() => [
  {
    label: '本月待评分成员',
    value: `${summaryQuery.data.value?.pendingAssessments ?? 18} 人`,
    trend: '较上月 +4',
    tone: 'warning',
  },
  {
    label: '进行中周任务',
    value: `${summaryQuery.data.value?.activeTasks ?? 46} 项`,
    trend: '逾期 5 项',
    tone: 'danger',
  },
  { label: '团队平均绩效', value: '89.2', trend: '连续 3 月上升', tone: 'success' },
  { label: '关键审计事件', value: '12 条', trend: '本周新增 2 条', tone: 'primary' },
])

const pendingTasks: PendingTask[] = [
  { title: '绩效评分规则联调', owner: '王晨', deadline: '06-15', status: '待经理评分' },
  { title: '周报补录与审核', owner: '李娜', deadline: '06-16', status: '待成员提交' },
  { title: '项目里程碑复盘', owner: '陈诚', deadline: '06-17', status: '待总监确认' },
  { title: '异常登录审计核查', owner: '审计管理员', deadline: '06-18', status: '待日志复查' },
]
</script>

<template>
  <section class="dashboard-grid">
    <MetricCard v-for="item in metrics" :key="item.label" :item="item" />
  </section>

  <section class="content-grid">
    <PageSection title="月度绩效趋势" description="用于展示月/季/年绩效分数变化，后续可接统计接口。">
      <LineTrendChart />
    </PageSection>

    <PageSection title="评分维度雷达图" description="适合答辩时展示任务质量、协作效率等多维指标。">
      <RadarScoreChart />
    </PageSection>
  </section>

  <PageSection title="待推进事项" description="聚合周任务、周报、评分与审计等核心流程，便于首页总览。">
    <el-table :data="pendingTasks">
      <el-table-column prop="title" label="事项" min-width="220" />
      <el-table-column prop="owner" label="负责人" min-width="120" />
      <el-table-column prop="deadline" label="截止日期" width="120" />
      <el-table-column prop="status" label="当前状态" min-width="180" />
    </el-table>
  </PageSection>
</template>
