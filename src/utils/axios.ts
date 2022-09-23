import Axios from 'axios'
import { message } from 'antd'
import { store } from '@/store'
import { HashRouter } from 'react-router-dom'
import { setUserInfo } from '@/store/slicers/userSlice'

interface AxiosConfig {
  timeout: number
  headers: {
    'Content-Type': string
  }
}

const config: AxiosConfig = {
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json'
  }
}

const axios = Axios.create(config)

const router: CommonObjectType = new HashRouter({})

// token失效，清除用户信息并返回登录界面
const clearAll = () => {
  store.dispatch(setUserInfo({}))
  router.history.replace({ pathname: '/login' })
}

// 请求前拦截
axios.interceptors.request.use(
  (req) => {
    const { token = '' } = store.getState().user.UserInfo || {}
    req.headers.Authorization = `Bearer ${token}`
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 返回后拦截
axios.interceptors.response.use(
  (response): Promise<any> => {
    // todo 应考虑在全局统一化响应数据格式.如果没有,则应移除这个拦截器
    const { data } = response
    return Promise.resolve(data.data)
  },
  (err) => {
    if (err.response.status === 401) {
      // token失效
      clearAll()
    }
    message.destroy()
    message.error(err.response.data.message)
    return Promise.reject(err.response)
  }
)

// post请求
// @ts-ignore
axios.post = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'post',
    url,
    data: params
  })

// get请求
axios.get = (url: string, params?: object): Promise<any> =>
  axios({
    method: 'get',
    url,
    params
  })

export default axios
