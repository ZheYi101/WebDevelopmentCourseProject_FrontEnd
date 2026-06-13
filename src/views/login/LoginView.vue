<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { appTitle } from '@/configs/app'
import { type RoleCode, roleOptions } from '@/constants/roles'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: 'admin',
  password: '123456',
  roleCode: 'system_admin' as RoleCode,
})

async function handleLogin() {
  try {
    await authService.login({
      username: form.username,
      password: form.password,
      roleCode: form.roleCode,
    })
  } catch {
    // 初始化阶段保留前端演示回退，后续接通后端后可直接移除。
  }

  authStore.login({
    username: form.username,
    realName: getRealName(form.roleCode),
    roleCode: form.roleCode,
  })
  ElMessage.success('登录成功，已进入管理台')
  router.push(authStore.getDefaultRoute())
}

function getRealName(roleCode: RoleCode) {
  return roleOptions.find((item) => item.value === roleCode)?.label ?? '演示账号'
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__panel">
      <div class="login-page__hero">
        <span>Web 课程设计</span>
        <h1>{{ appTitle }}</h1>
        <p>
          面向软件企业技术团队的绩效考核管理前端，覆盖登录分权、任务过程、周报考核、统计分析与审计追踪。
        </p>
        <ul>
          <li>五类后台角色分权演示</li>
          <li>任务、周报、月度考核闭环</li>
          <li>统计图表与审计日志扩展位</li>
        </ul>
      </div>

      <el-card class="login-page__card" shadow="hover">
        <template #header>
          <div>
            <strong>系统登录</strong>
            <p>当前为初始化演示版，后续可直接对接后端鉴权接口。</p>
          </div>
        </template>

        <el-form label-position="top">
          <el-form-item label="账号">
            <el-input v-model="form.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="form.roleCode" class="w-full">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" class="w-full" size="large" @click="handleLogin">
            进入系统
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
