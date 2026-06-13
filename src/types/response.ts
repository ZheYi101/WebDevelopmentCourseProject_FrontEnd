export interface CommonRespWrap<T> {
  code: number
  msg: string
  data?: T
}
