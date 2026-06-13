import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

import { RESP_CODE } from '@/constants/response-code'
import { getResolvedApiBaseUrl } from '@/services/api-base-url'
import type { CommonRespWrap } from '@/types/response'

import type { ServiceOptions } from './base-service'
import { SERVICE_TIMEOUT } from './base-service'
import { RequestError } from './request-error'

const axiosInstance = axios.create({
  baseURL: getResolvedApiBaseUrl(),
  timeout: SERVICE_TIMEOUT,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => {
    const responseType = response.config.responseType
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response
    }

    const body: CommonRespWrap<unknown> = response.data

    if (body.code !== RESP_CODE.OK) {
      throw new RequestError(body.msg, body.code)
    }

    return response
  },
  (axiosError: AxiosError) => Promise.reject(RequestError.fromAxiosError(axiosError)),
)

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

export const request: ServiceOptions<AxiosRequestConfig>['request'] = async (req, options) => {
  const response = await axiosInstance({
    url: req.url,
    method: req.method,
    params: req.params,
    data: req.data,
    ...options,
  })

  const responseType = response.config.responseType
  if (responseType === 'blob' || responseType === 'arraybuffer') {
    return response.data
  }

  const body = response.data as CommonRespWrap<unknown>
  return body.data as never
}
