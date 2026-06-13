<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const rows = [
  { name: '王晨', manager: 90, director: 88, gm: 92, final: 90.0 },
  { name: '李娜', manager: 87, director: 85, gm: 89, final: 87.0 },
  { name: '陈诚', manager: 93, director: 91, gm: 94, final: 92.7 },
]
</script>

<template>
  <PageSection
    title="月度考核"
    description="按课设公式自动汇总部门经理 40%、技术总监 30%、总经理 30% 的月度总分。"
  >
    <template #extra>
      <el-button type="primary">发起本月评分</el-button>
    </template>

    <el-alert
      title="当前为前端初始化演示数据，后续对接接口后可保留自动计算与评分详情展示。"
      type="info"
      show-icon
      :closable="false"
      class="mb-16"
    />

    <el-table :data="rows">
      <el-table-column prop="name" label="成员" width="120" />
      <el-table-column prop="manager" label="经理评分" width="120" />
      <el-table-column prop="director" label="总监评分" width="120" />
      <el-table-column prop="gm" label="总经理评分" width="140" />
      <el-table-column prop="final" label="自动汇总分" width="140" />
    </el-table>
  </PageSection>
</template>
