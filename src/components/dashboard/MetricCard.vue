<script setup lang="ts">
import type { DashboardMetric } from '@/types/dashboard'

defineProps<{
  item: DashboardMetric
}>()
</script>

<template>
  <el-card class="metric-card" shadow="hover">
    <p class="metric-card__label">{{ item.label }}</p>
    <strong class="metric-card__value">{{ item.value }}</strong>
    <el-tag :type="item.tone" effect="light">{{ item.trend }}</el-tag>
  </el-card>
</template>
