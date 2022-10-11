import $axios from '@/utils/axios'
import { Permission } from '@/app_models/user'

export default {
  permissionList(params?: object): Promise<Permission> {
    return $axios.get('/api/web/permission/list', params)
  },
  permissionAdd(params?: object): Promise<Permission> {
    return $axios.post('/api/web/permission/add', params)
  }
}
