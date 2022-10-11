import $axios from '@/utils/axios'
import { BusinessInfo, BusinessUserInfo } from '@/app_models/user'

export default {
  getBusinessUserList(params?: object): Promise<BusinessInfo> {
    return $axios.get('/api/web/business/list', params)
  },
  businessPermissionUpdate(params?: object): Promise<BusinessInfo> {
    return $axios.post('/api/web/business/permission/update', params)
  },
  businessAdd(params?: object): Promise<BusinessInfo> {
    return $axios.post('/api/web/business/add', params)
  },
  businessDisable(params?: object): Promise<BusinessInfo> {
    return $axios.post('/api/web/business/disable', params)
  },
  businessEnable(params?: object): Promise<BusinessInfo> {
    return $axios.post('/api/web/business/enable', params)
  },
  businessPermission(params?: object): Promise<BusinessInfo> {
    return $axios.post('/api/web/business/permission', params)
  },
  businessPermissionOpt(params?: object): Promise<BusinessUserInfo> {
    return $axios.post('/api/web/business/permission/opt', params)
  },
  allPermissionOpt(params?: object): Promise<BusinessUserInfo> {
    return $axios.post('/api/web/all/permission/opt', params)
  },
  businessUserPermission(params?: object): Promise<BusinessUserInfo> {
    return $axios.post('/api/web/business/user/permission', params)
  },
  businessUserPermissionUpdate(params?: object): Promise<BusinessUserInfo> {
    return $axios.post('/api/web/business/user/permission/update', params)
  },
  businessUserAdd(params?: object): Promise<BusinessUserInfo> {
    return $axios.post('/api/web/business/user/add', params)
  },
  businessUserDel(params?: object): Promise<BusinessUserInfo> {
    return $axios.post('/api/web/business/user/del', params)
  }
}
