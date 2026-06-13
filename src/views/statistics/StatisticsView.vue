<script setup lang="ts">
import LineTrendChart from '@/components/charts/LineTrendChart.vue'
import PageSection from '@/components/common/PageSection.vue'
</script>

<template>
  <PageSection title="统计分析" description="面向月/季/年汇总、团队对比、成员趋势和项目绩效分布。">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never">
          <template #header>月度趋势</template>
          <LineTrendChart />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="never" class="summary-card">
          <template #header>统计说明</template>
          <p>后续可接入 `/api/statistics/monthly`、`/quarterly`、`/yearly` 等接口。</p>
          <p>建议补充团队对比柱状图、个人趋势折线图、项目绩效分布饼图。</p>
        </el-card>
      </el-col>
    </el-row>
  </PageSection>
</template>
