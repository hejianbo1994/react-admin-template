import React, { useEffect, useState, useRef, FC } from 'react'
import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { Form, Input, Button, Modal, Select } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import './login.less'
import Logo from '@/assets/img/logo.png'
import session from '@/api/sys/session'
import { useAppDispatch } from '@/store/redux-hooks'
import { setUserInfo } from '@/store/slicers/userSlice'
import { setTabs } from '@/store/slicers/tabSlice'
import CryptoJs from 'crypto-js'
import { useHistory } from 'react-router-dom'

const { Option } = Select

const LoginForm: FC = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const selectedBusinessId = useRef('')
  const modal = useRef(null)
  useEffect(() => {
    // 重置 tab栏为首页
    dispatch(setTabs(['/']))
  }, [dispatch])

  const handleChange = (value: string) => {
    selectedBusinessId.current = value
  }

  const showConfirm = ({ phone, password, businessIdList }) => {
    modal.current = Modal.confirm({
      title: null,
      icon: null,
      content: (
        <>
          请选择登陆:&nbsp;&nbsp;
          <Select
            defaultValue={selectedBusinessId.current}
            style={{ width: 270 }}
            onChange={handleChange}
          >
            {businessIdList.map((business) => (
              <Option key={business.businessId} value={business.businessId}>
                {business.businessName}
              </Option>
            ))}
          </Select>
        </>
      ),
      onOk() {
        return new Promise<void>((resolve, reject) => {
          session
            .login({
              phone,
              password: CryptoJs.MD5(password).toString(),
              businessId: selectedBusinessId.current
            })
            .then(({ token }) => {
              dispatch(setUserInfo({ token }))
              history.replace({ pathname: '/' })
              resolve()
            })
            .catch(() => {
              modal.current.destroy()
              reject()
            })
        })
      },
      onCancel() {
        selectedBusinessId.current = ''
      }
    })
  }

  // 触发登录方法
  const onFinish = ({ phone, password }) => {
    setLoading(true)
    session
      .login({
        phone,
        password: CryptoJs.MD5(password).toString()
      })
      .then((res) => {
        setLoading(false)
        selectedBusinessId.current =
          selectedBusinessId.current || res[0].businessId
        showConfirm({ phone, password, businessIdList: res })
      })
      .catch(() => {
        setLoading(false)
      })
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
        <Input
          placeholder="手机号"
          prefix={<PhoneOutlined />}
          size="large"
          disabled={loading}
        />
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
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <Button
          loading={loading}
          className="login-form-button"
          htmlType="submit"
          size="large"
          type="primary"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  )

  const floatColor = '110,65,255'
  // const floatColor = { light: '110,65,255', dark: '24,144,255' }[theme]
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
