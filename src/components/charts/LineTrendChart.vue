<script setup lang="ts">
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { getThemeCssVar } from '@/utils/theme'

const props = withDefaults(
  defineProps<{
    labels: string[]
    values: number[]
    seriesName?: string
  }>(),
  {
    seriesName: '趋势',
  },
)

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value) {
    return
  }

  const accent = getThemeCssVar('--theme-accent', '#cc7d5e')
  const accentGhost = getThemeCssVar('--theme-accent-ghost-strong', 'rgba(204, 125, 94, 0.28)')
  const foregroundSecondary = getThemeCssVar('--theme-foreground-secondary', '#6f665f')
  const border = getThemeCssVar('--theme-border', 'rgba(45, 45, 43, 0.08)')

  chart ??= echarts.init(chartRef.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },
    textStyle: {
      color: foregroundSecondary,
      fontFamily: 'Geist, PingFang SC, Microsoft YaHei, sans-serif',
    },
    grid: {
      left: 32,
      right: 20,
      top: 30,
      bottom: 28,
    },
    xAxis: {
      type: 'category',
      data: props.labels,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: border,
        },
      },
      axisLabel: {
        color: foregroundSecondary,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: border,
        },
      },
      axisLabel: {
        color: foregroundSecondary,
      },
    },
    series: [
      {
        name: props.seriesName,
        type: 'line',
        smooth: true,
        data: props.values,
        areaStyle: {
          color: accentGhost,
        },
        lineStyle: {
          color: accent,
          width: 3,
        },
        itemStyle: {
          color: accent,
        },
      },
    ],
  })
  chart.resize()
}

function resizeChart() {
  chart?.resize()
}

onMounted(async () => {
  await nextTick()
  renderChart()
  window.addEventListener('resize', resizeChart)
})

watch(
  () => [props.labels, props.values],
  () => {
    renderChart()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="chart-panel"></div>
</template>

<style scoped lang="scss">
.chart-panel {
  width: 100%;
  height: 320px;
}
</style>
