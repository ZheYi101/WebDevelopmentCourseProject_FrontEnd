<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const projects = [
  { name: '绩效系统一期', owner: '张磊', status: '进行中', milestone: '联调中' },
  { name: '研发流程看板', owner: '刘静', status: '规划中', milestone: '需求评审' },
  { name: '交付日报中心', owner: '周航', status: '已完成', milestone: '验收通过' },
]
</script>

<template>
  <PageSection title="项目管理" description="管理项目负责人、状态、里程碑与时间范围。">
    <template #extra>
      <el-button type="primary">新建项目</el-button>
    </template>

    <el-table :data="projects">
      <el-table-column prop="name" label="项目名称" min-width="220" />
      <el-table-column prop="owner" label="负责人" min-width="140" />
      <el-table-column prop="status" label="项目状态" min-width="140" />
      <el-table-column prop="milestone" label="当前里程碑" min-width="180" />
    </el-table>
  </PageSection>
</template>
