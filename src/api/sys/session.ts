import $axios from '@/utils/axios'
import { UserInfo } from '@/app_models/user'

export default {
  // 获取数据
  login(params?: object): Promise<UserInfo> {
    return $axios.post('/api/web/business/login', params)
  }
  // login(params?: object): Promise<UserInfo> {
  //   return $axios.post('/api/web/login', params)
  // }
}
