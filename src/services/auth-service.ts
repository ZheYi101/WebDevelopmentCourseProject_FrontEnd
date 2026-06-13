import type { AxiosRequestConfig } from 'axios'

import { BaseService } from '@/utils/base-service'
import { request } from '@/utils/service'

export interface LoginCommand {
  username: string
  password: string
  roleCode: string
}

export interface LoginResult {
  token: string
  username: string
  realName: string
  roleCode: string
}

class AuthService extends BaseService<AxiosRequestConfig> {
  login(data: LoginCommand) {
    return this.request<LoginResult>({
      url: this.genBaseURL('/auth/login'),
      method: 'POST',
      data,
    })
  }

  changePassword(data: { oldPassword: string; newPassword: string }) {
    return this.request<undefined>({
      url: this.genBaseURL('/auth/change-password'),
      method: 'POST',
      data,
    })
  }
}

export const authService = new AuthService({
  request,
  baseURL: '',
})
