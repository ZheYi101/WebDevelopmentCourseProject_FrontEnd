import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { defaultRoutePath } from '@/configs/app'
import { type RoleCode, roleOptions } from '@/constants/roles'
import { storageKeys } from '@/utils/storage'

interface AuthState {
  realName: string
  username: string
  roleCode: RoleCode
}

const defaultAuthState: AuthState = {
  realName: '系统管理员',
  username: '',
  roleCode: 'system_admin',
}

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<AuthState>(readStoredAuth())

  const isLoggedIn = computed(() => Boolean(auth.value.username))

  const roleLabel = computed(() => roleOptions.find((item) => item.value === auth.value.roleCode)?.label ?? '未分配角色')

  function login(payload: Partial<AuthState>) {
    auth.value = {
      ...auth.value,
      ...payload,
    }
    persistAuth(auth.value)
  }

  function logout() {
    auth.value = {
      ...defaultAuthState,
      username: '',
    }
    window.localStorage.removeItem(storageKeys.auth)
  }

  function getDefaultRoute() {
    return defaultRoutePath
  }

  return {
    auth,
    isLoggedIn,
    roleLabel,
    login,
    logout,
    getDefaultRoute,
  }
})

function readStoredAuth(): AuthState {
  const raw = window.localStorage.getItem(storageKeys.auth)

  if (!raw) {
    return defaultAuthState
  }

  try {
    return {
      ...defaultAuthState,
      ...JSON.parse(raw),
    }
  } catch {
    return defaultAuthState
  }
}

function persistAuth(auth: AuthState) {
  window.localStorage.setItem(storageKeys.auth, JSON.stringify(auth))
}
