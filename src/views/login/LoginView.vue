<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useLoginMutation } from '@/composables/use-auth'
import { appTitle } from '@/configs/app'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loginMutation = useLoginMutation()
const formRef = ref<FormInstance>()

const form = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  const result = await loginMutation.mutateAsync({
    username: form.username,
    password: form.password,
  })

  ElMessage.success(`欢迎回来，${result.user.realName}`)
  if (result.user.mustChangePassword) {
    ElMessage.warning('当前账号需要尽快修改初始密码')
  }

  await router.push(authStore.getDefaultRoute())
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__panel">
      <div class="login-page__hero">
        <span>Web 课程设计</span>
        <h1>{{ appTitle }}</h1>
        <p>
          面向软件企业技术团队的绩效考核管理前端，覆盖权限登录、团队成员、项目任务、周报考核、统计分析与审计日志。
        </p>
        <ul>
          <li>基于 Vue 3 + TypeScript + Element Plus 的后台系统</li>
          <li>请求统一走 Vue Query + Service 层</li>
          <li>可直接继续补接口联调和业务页面细节</li>
        </ul>
      </div>

      <el-card class="login-page__card" shadow="hover">
        <template #header>
          <div>
            <strong>系统登录</strong>
            <p>请输入后端分配的账号密码，登录后会根据角色自动进入可访问页面。</p>
          </div>
        </template>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-button type="primary" class="w-full" size="large" :loading="loginMutation.isPending.value" @click="handleLogin">
            进入系统
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
}

.login-page__panel {
  display: grid;
  grid-template-columns: 1.15fr 420px;
  gap: 24px;
  align-items: stretch;
  width: min(1180px, 100%);
}

.login-page__hero {
  padding: 48px;
  border-radius: 32px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.13), transparent 24%),
    linear-gradient(135deg, #d59677 0%, var(--theme-accent) 42%, #8a5b45 100%);
  color: #fffaf5;
  box-shadow: var(--theme-shadow);
}

.login-page__hero span {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.login-page__hero h1 {
  margin: 0 0 16px;
  font-size: 40px;
  line-height: 1.15;
}

.login-page__hero p {
  max-width: 560px;
  color: rgba(255, 250, 245, 0.9);
  line-height: 1.75;
}

.login-page__hero ul {
  margin: 28px 0 0;
  padding-left: 20px;
  line-height: 2;
}

.login-page__card {
  align-self: center;
  border: 1px solid var(--theme-border);
  border-radius: 28px;
  background: var(--theme-surface-strong);
  box-shadow: var(--theme-shadow);
}

.login-page__card strong {
  display: block;
  margin-bottom: 8px;
  font-size: 22px;
  color: var(--theme-foreground);
}

.login-page__card p {
  color: var(--theme-foreground-secondary);
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 1440px) {
  .login-page__panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 16px;
  }

  .login-page__hero,
  .login-page__card {
    padding: 24px;
  }

  .login-page__hero h1 {
    font-size: 30px;
  }
}
</style>
