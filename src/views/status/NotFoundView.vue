<template>
  <div class="status-page">
    <el-result
      icon="warning"
      title="页面不存在"
      sub-title="当前访问的页面还没有配置，返回首页继续查看课设前端初始化结果。"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/dashboard')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>
