import React, { useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons'
import { Form, Input, Button, message } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import './login.less'
import Logo from '@/assets/img/logo.png'
import session from '@/api/sys/session'
import { OidcLogin } from '@/pages/login/OidcLogin'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo, setUserInfo } from '@/store/slicers/userSlice'
import { setTabs } from '@/store/slicers/tabSlice'
import { selectTheme } from '@/store/slicers/appSlice'
import { userRes } from '@/mocks/authentication_mock'
import CryptoJs from 'crypto-js'

const LoginForm: FC = () => {
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector(selectUserInfo)
  const theme = useAppSelector(selectTheme)
  const history = useHistory()
  useEffect(() => {
    const { token } = userInfo
    if (token) {
      history.push('/')
      return
    }
    // 重置 tab栏为首页
    dispatch(setTabs(['/']))
  }, [history, dispatch, userInfo])

  // 触发登录方法
  const onFinish = (values: CommonObjectType<string>) => {
    const { phone, password } = values
    session
      .login({
        phone,
        password: CryptoJs.MD5(password).toString()
      })
      .then(({ token, permission }) => {
        dispatch(setUserInfo({ token, phone, permission }))
        history.push('/')
      })
      .catch(() => {})
  }

  const FormView = (
    <Form
      initialValues={{ phone: '', password: '' }}
      className="login-form"
      name="login-form"
      onFinish={onFinish}
    >
      <Form.Item
        name="phone"
        rules={[{ required: true, message: '请输入手机号' }]}
      >
        <Input placeholder="手机号" prefix={<PhoneOutlined />} size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
        // extra="用户名：admin 密码：123456"
      >
        <Input.Password
          placeholder="密码"
          prefix={<LockOutlined />}
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          className="login-form-button"
          htmlType="submit"
          size="large"
          type="primary"
        >
          登录
        </Button>
        {/* <OidcLogin loginCallback={() => history.push('/')} /> */}
      </Form.Item>
    </Form>
  )

  const floatColor = { light: '110,65,255', dark: '24,144,255' }[theme]
  return (
    <div className="login-layout" id="login-layout">
      <ReactCanvasNest
        config={{
          pointColor: floatColor,
          lineColor: floatColor,
          pointOpacity: 0.6
        }}
        style={{ zIndex: 1 }}
      />
      <div className="logo-box">
        <img alt="" className="logo" src={Logo} />
        <span className="logo-name">Space云筑</span>
      </div>
      {FormView}
    </div>
  )
}

export default LoginForm
