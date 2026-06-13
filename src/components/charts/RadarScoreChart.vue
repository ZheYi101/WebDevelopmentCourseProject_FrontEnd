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
  const accentSoft = getThemeCssVar('--theme-accent-soft', '#e7c8bb')
  const foregroundSecondary = getThemeCssVar('--theme-foreground-secondary', '#6f665f')
  const border = getThemeCssVar('--theme-border', 'rgba(45, 45, 43, 0.08)')

  chart = echarts.init(chartRef.value)
  chart.setOption({
    textStyle: {
      color: foregroundSecondary,
      fontFamily: 'Geist, Inter, PingFang SC, Microsoft YaHei, sans-serif',
    },
    radar: {
      indicator: [
        { name: '任务达成', max: 100 },
        { name: '协作效率', max: 100 },
        { name: '质量控制', max: 100 },
        { name: '周报质量', max: 100 },
        { name: '项目贡献', max: 100 },
      ],
      radius: '60%',
      splitLine: {
        lineStyle: {
          color: border,
        },
      },
      splitArea: {
        areaStyle: {
          color: ['transparent'],
        },
      },
      axisLine: {
        lineStyle: {
          color: accentSoft,
        },
      },
      name: {
        color: foregroundSecondary,
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [88, 84, 90, 79, 86],
            areaStyle: {
              color: accentGhost,
            },
            lineStyle: {
              color: accent,
              width: 2.5,
            },
            itemStyle: {
              color: accent,
            },
          },
        ],
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
