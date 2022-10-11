export interface UserInfo {
  businessName: string
  businessId: string
  businessPermission: {
    code: string
    name: string
  }[]
  phone: string
  name: string
  password?: string
  token: string
  permission: string[]
}

export interface BusinessInfo {
  status: boolean
  businessPermission: string[]
  allPermission: { code: string; name: string; hidden: boolean }[]
  businessName: string
  businessId: string
}
export interface BusinessUserInfo {
  phone: string
  businessPermission: { code: string; name: string; hidden: boolean }[]
  allPermission: { code: string; name: string; hidden: boolean }[]
  permission: string[]
  name: string
  _id: string
}
export interface Permission {
  code: string
  name: string
  hidden: boolean
}
