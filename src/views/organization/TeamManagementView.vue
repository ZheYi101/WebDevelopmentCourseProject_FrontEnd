<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const teams = [
  { name: '平台研发组', department: '研发一部', manager: '张磊', members: 9 },
  { name: '测试保障组', department: '质量中心', manager: '刘静', members: 6 },
  { name: '交付支持组', department: '项目交付部', manager: '周航', members: 5 },
]
</script>

<template>
  <PageSection title="团队与成员管理" description="维护团队归属、岗位职级、成员联系方式及查询筛选。">
    <template #extra>
      <el-button type="primary">新增团队</el-button>
    </template>

    <el-row :gutter="16">
      <el-col v-for="team in teams" :key="team.name" :xs="24" :md="8">
        <el-card class="summary-card" shadow="hover">
          <strong>{{ team.name }}</strong>
          <p>{{ team.department }}</p>
          <p>负责人：{{ team.manager }}</p>
          <p>成员数：{{ team.members }}</p>
        </el-card>
      </el-col>
    </el-row>
  </PageSection>
</template>
