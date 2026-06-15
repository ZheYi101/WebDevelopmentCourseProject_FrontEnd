<script setup lang="ts">
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { getThemeCssVar } from '@/utils/theme'

const props = defineProps<{
  indicators: Array<{ name: string; max: number }>
  values: number[]
}>()

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value) {
    return
  }

  const accent = getThemeCssVar('--theme-accent', '#cc7d5e')
  const accentGhost = getThemeCssVar('--theme-accent-ghost-strong', 'rgba(204, 125, 94, 0.28)')
  const accentSoft = getThemeCssVar('--theme-accent-soft', '#e7c8bb')
  const foregroundSecondary = getThemeCssVar('--theme-foreground-secondary', '#6f665f')
  const border = getThemeCssVar('--theme-border', 'rgba(45, 45, 43, 0.08)')

  chart ??= echarts.init(chartRef.value)
  chart.setOption({
    textStyle: {
      color: foregroundSecondary,
      fontFamily: 'Geist, PingFang SC, Microsoft YaHei, sans-serif',
    },
    radar: {
      indicator: props.indicators,
      radius: '62%',
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
            value: props.values,
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
  () => [props.indicators, props.values],
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
