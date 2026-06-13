<script setup lang="ts">
import PageSection from '@/components/common/PageSection.vue'

const users = [
  { username: 'admin', role: '系统管理员', status: '启用', updatedAt: '2026-06-13 10:30' },
  { username: 'manager01', role: '部门经理', status: '启用', updatedAt: '2026-06-12 19:10' },
  { username: 'audit01', role: '审计管理员', status: '锁定', updatedAt: '2026-06-12 16:45' },
]
</script>

<template>
  <PageSection title="用户与角色管理" description="覆盖账号管理、角色绑定、重置密码与审计账号管理。">
    <template #extra>
      <el-space>
        <el-button>导入测试账号</el-button>
        <el-button type="primary">新增账号</el-button>
      </el-space>
    </template>

    <el-form inline class="filter-form">
      <el-form-item label="账号">
        <el-input placeholder="搜索账号" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select placeholder="全部角色" style="width: 180px" />
      </el-form-item>
      <el-button type="primary">查询</el-button>
    </el-form>

    <el-table :data="users">
      <el-table-column prop="username" label="账号" min-width="180" />
      <el-table-column prop="role" label="角色" min-width="160" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="updatedAt" label="最近更新时间" min-width="180" />
      <el-table-column label="操作" width="220">
        <template #default>
          <el-space>
            <el-button link type="primary">编辑</el-button>
            <el-button link>重置密码</el-button>
            <el-button link type="danger">锁定</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
  </PageSection>
</template>
