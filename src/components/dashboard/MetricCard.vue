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
    <p v-if="item.description" class="metric-card__hint">{{ item.description }}</p>
    <el-tag :type="item.tone" effect="light">{{ item.trend }}</el-tag>
  </el-card>
</template>

<style scoped lang="scss">
.metric-card__label {
  margin-bottom: 14px;
  color: var(--theme-foreground-secondary);
  font-size: 14px;
}

.metric-card__value {
  display: block;
  margin-bottom: 14px;
  font-size: 30px;
  line-height: 1;
  color: var(--theme-foreground);
}

.metric-card__hint {
  min-height: 22px;
  margin: 0 0 14px;
  color: var(--theme-foreground-secondary);
  font-size: 13px;
}
</style>
