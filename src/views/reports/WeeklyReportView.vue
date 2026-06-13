<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const reports = [
  { user: '王晨', week: '2026-W24', summary: '完成登录流程联调与路由守卫', nextPlan: '接入评分表单' },
  { user: '李娜', week: '2026-W24', summary: '整理周报提交流程', nextPlan: '增加点评功能' },
]
</script>

<template>
  <PageSection title="周报管理" description="支持成员提交周报、经理查看与点评，便于形成业务闭环。">
    <template #extra>
      <el-button type="primary">提交周报</el-button>
    </template>

    <el-table :data="reports">
      <el-table-column prop="user" label="成员" width="120" />
      <el-table-column prop="week" label="周次" width="120" />
      <el-table-column prop="summary" label="本周总结" min-width="240" />
      <el-table-column prop="nextPlan" label="下周计划" min-width="220" />
    </el-table>
  </PageSection>
</template>
