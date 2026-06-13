<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { appTitle } from '@/configs/app'
import { appMenus } from '@/configs/menu'
import { useAuthStore } from '@/stores/auth'
import { iconMap } from '@/utils/icons'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

const visibleMenus = computed(() => appMenus.filter((menu) => menu.roles.includes(authStore.auth.roleCode)))

function handleCommand(command: string) {
  if (command === 'logout') {
    authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<template>
  <el-container class="app-shell">
    <el-aside class="app-shell__aside" width="260px">
      <div class="app-shell__brand">
        <div class="app-shell__brand-mark">KP</div>
        <div>
          <strong>{{ appTitle }}</strong>
          <p>Web 课设前端管理台</p>
        </div>
      </div>

      <el-menu :default-active="activeMenu" class="app-shell__menu" router>
        <el-menu-item
          v-for="menu in visibleMenus"
          :key="menu.key"
          :index="String(menu.to)"
        >
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
          <p>围绕团队绩效、任务闭环、周报考核与审计追踪进行统一管理</p>
        </div>

        <el-dropdown @command="handleCommand">
          <div class="app-shell__user">
            <el-avatar>绩</el-avatar>
            <div>
              <strong>{{ authStore.auth.realName }}</strong>
              <p>{{ authStore.roleLabel }}</p>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
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
</template>
