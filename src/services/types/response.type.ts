export interface IResponse<T, E = Record<string, any>> {
  data: T
  extra: E
  code: number
  message: string
  success: boolean
}

export interface IPaginationRequestQuery {
  page?: number
  pageSize?: number
}

export type IRequestQuery<T extends Record<string, any>> = {
  page?: number
  pageSize?: number
} & {
  [K in keyof T]?: T[K]
}
