export interface Permission {
  code: string
  name: string
  description?: string
}

export interface UserInfo {
  username: string
  phone: string
  displayName?: string
  password?: string
  token: string
  permission: Permission[]
}

export interface BusinessInfo {
  phone: string
  displayName?: string
  password?: string
  token: string
  permission: Permission[]
  admin: string
}
