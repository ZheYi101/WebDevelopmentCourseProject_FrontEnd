<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useChangePasswordMutation } from '@/composables/use-auth'
import { appTitle } from '@/configs/app'
import { appMenus } from '@/configs/menu'
import { useAuthStore } from '@/stores/auth'
import { iconMap } from '@/utils/icons'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const changePasswordMutation = useChangePasswordMutation()

const activeMenu = computed(() => route.path)
const visibleMenus = computed(() => appMenus.filter((menu) => authStore.hasAnyRole(menu.roles)))
const showPasswordDialog = ref(false)
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码至少 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的新密码不一致'))
          return
        }

        callback()
      },
      trigger: 'blur',
    },
  ],
}

async function handleCommand(command: string) {
  if (command === 'logout') {
    await authStore.logout()
    ElMessage.success('已退出登录')
    await router.push('/login')
    return
  }

  if (command === 'change-password') {
    showPasswordDialog.value = true
  }
}

async function handleChangePassword() {
  const valid = await passwordFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  await changePasswordMutation.mutateAsync({
    oldPassword: passwordForm.oldPassword,
    newPassword: passwordForm.newPassword,
  })

  ElMessage.success('密码修改成功，请使用新密码登录')
  showPasswordDialog.value = false
  resetPasswordForm()
}

function resetPasswordForm() {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}
</script>

<template>
  <el-container class="app-shell">
    <el-aside class="app-shell__aside" width="260px">
      <div class="app-shell__brand">
        <div class="app-shell__brand-mark">KP</div>
        <div>
          <strong>{{ appTitle }}</strong>
          <p>课程设计前端管理台</p>
        </div>
      </div>

      <el-menu :default-active="activeMenu" class="app-shell__menu" router>
        <el-menu-item v-for="menu in visibleMenus" :key="menu.key" :index="String(menu.to)">
          <el-icon>
            <component :is="iconMap[menu.icon]" />
          </el-icon>
          <span>{{ menu.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-shell__header">
        <div>
          <h1>{{ route.meta.title ?? appTitle }}</h1>
          <p>围绕团队绩效、任务协同、周报考核与统计审计的统一管理后台</p>
        </div>

        <el-dropdown @command="handleCommand">
          <div class="app-shell__user">
            <el-avatar>{{ authStore.currentUser?.realName?.slice(0, 1) ?? '用' }}</el-avatar>
            <div>
              <strong>{{ authStore.currentUser?.realName ?? '未登录用户' }}</strong>
              <p>{{ authStore.roleLabel }}</p>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="change-password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <el-main class="app-shell__main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="showPasswordDialog" title="修改密码" width="460px" @closed="resetPasswordForm">
    <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-position="top">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-space>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" :loading="changePasswordMutation.isPending.value" @click="handleChangePassword">
          保存
        </el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
}

.app-shell__aside {
  border-right: 1px solid var(--theme-border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 251, 246, 0.82)),
    var(--theme-surface);
  backdrop-filter: blur(20px);
}

.app-shell__brand {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 24px 20px 12px;
}

.app-shell__brand strong {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
}

.app-shell__brand p {
  color: var(--theme-foreground-secondary);
  font-size: 13px;
}

.app-shell__brand-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: 16px;
  background: linear-gradient(135deg, #d79879, var(--theme-accent) 52%, #bb7355 100%);
  color: #fffdf9;
  font-weight: 700;
  box-shadow: var(--theme-shadow-soft);
}

.app-shell__menu {
  border-right: none;
  background: transparent;
}

.app-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  padding: 24px 28px 12px;
}

.app-shell__header h1 {
  margin: 0 0 8px;
  font-size: 28px;
  color: var(--theme-foreground);
}

.app-shell__header p {
  color: var(--theme-foreground-secondary);
}

.app-shell__user {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid var(--theme-border);
  border-radius: 18px;
  background: var(--theme-surface);
  box-shadow: var(--theme-shadow-soft);
  cursor: pointer;
}

.app-shell__user p {
  color: var(--theme-foreground-secondary);
  font-size: 13px;
}

.app-shell__main {
  padding: 12px 28px 28px;
}

@media (max-width: 768px) {
  .app-shell__aside {
    display: none;
  }

  .app-shell__header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding-inline: 16px;
  }

  .app-shell__main {
    padding-inline: 16px;
  }
}
</style>
