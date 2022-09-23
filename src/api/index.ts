import $axios from '@/utils/axios'
import { BusinessInfo } from '@/app_models/user'

export default {
  // 获取数据
  getList(params?: object): Promise<CommonObjectType<string>> {
    return $axios.get('https://randomuser.me/api', params)
  },
  getCurrentInfo(params?: object): Promise<BusinessInfo> {
    return $axios.get('/api/web/getCurrentInfo', params)
  }
}
