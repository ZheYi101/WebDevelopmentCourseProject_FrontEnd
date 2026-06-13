<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { getThemeCssVar } from '@/utils/theme'

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (!chartRef.value) {
    return
  }

  const accent = getThemeCssVar('--theme-accent', '#cc7d5e')
  const accentGhost = getThemeCssVar('--theme-accent-ghost-strong', 'rgba(204, 125, 94, 0.28)')
  const foregroundSecondary = getThemeCssVar('--theme-foreground-secondary', '#6f665f')
  const border = getThemeCssVar('--theme-border', 'rgba(45, 45, 43, 0.08)')

  chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },
    textStyle: {
      color: foregroundSecondary,
      fontFamily: 'Geist, Inter, PingFang SC, Microsoft YaHei, sans-serif',
    },
    grid: {
      left: 30,
      right: 20,
      top: 30,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
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
      min: 60,
      max: 100,
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
        name: '团队均分',
        type: 'line',
        smooth: true,
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
        data: [78, 81, 84, 86, 88, 91],
      },
    ],
  })

  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
})

function resizeChart() {
  chart?.resize()
}
</script>

<template>
  <div ref="chartRef" class="chart-panel"></div>
</template>
