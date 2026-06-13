<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const logs = [
  { operator: 'audit01', type: '登录审计', target: '后台登录', time: '2026-06-13 08:22' },
  { operator: 'admin', type: '角色调整', target: 'manager01', time: '2026-06-13 10:05' },
  { operator: 'manager01', type: '评分提交', target: '2026-06 月度考核', time: '2026-06-13 16:33' },
]
</script>

<template>
  <PageSection title="审计日志" description="展示登录日志与关键操作日志，作为安全与等保思路的演示亮点。">
    <template #extra>
      <el-button>导出日志</el-button>
    </template>

    <el-table :data="logs">
      <el-table-column prop="operator" label="操作人" min-width="140" />
      <el-table-column prop="type" label="动作类型" min-width="140" />
      <el-table-column prop="target" label="目标对象" min-width="220" />
      <el-table-column prop="time" label="操作时间" min-width="180" />
    </el-table>
  </PageSection>
</template>
