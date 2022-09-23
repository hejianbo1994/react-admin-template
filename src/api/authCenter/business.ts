import $axios from '@/utils/axios'
import { BusinessInfo } from '@/app_models/user'

export default {
  getBusinessList(params?: object): Promise<BusinessInfo> {
    return $axios.get('/api/web/getBusinessList', params)
  }
}
