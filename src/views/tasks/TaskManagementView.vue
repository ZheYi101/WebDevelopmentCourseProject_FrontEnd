<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const tasks = [
  { title: '完成周度接口联调', assignee: '王晨', priority: '高', deadline: '2026-06-15', status: '进行中' },
  { title: '补充异常处理用例', assignee: '李娜', priority: '中', deadline: '2026-06-16', status: '待开始' },
  { title: '更新项目进度说明', assignee: '陈诚', priority: '低', deadline: '2026-06-17', status: '已完成' },
]
</script>

<template>
  <PageSection title="周任务管理" description="支撑任务分配、优先级控制、进度跟踪与逾期展示。">
    <template #extra>
      <el-space>
        <el-button>导出任务清单</el-button>
        <el-button type="primary">创建周任务</el-button>
      </el-space>
    </template>

    <el-table :data="tasks">
      <el-table-column prop="title" label="任务标题" min-width="220" />
      <el-table-column prop="assignee" label="执行成员" min-width="140" />
      <el-table-column prop="priority" label="优先级" width="100" />
      <el-table-column prop="deadline" label="计划截止" width="140" />
      <el-table-column prop="status" label="状态" width="120" />
    </el-table>
  </PageSection>
</template>
