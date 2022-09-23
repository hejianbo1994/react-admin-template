import React, { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu, Dropdown, Layout } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoadingOutlined,
  CheckOutlined
} from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import { Icon } from '@iconify/react'
import { oidcLogout } from '@/config/oidc_setting'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo, setUserInfo } from '@/store/slicers/userSlice'
import {
  selectTheme,
  setCollapsed as setCollapsedGlobal
} from '@/store/slicers/appSlice'

import style from './Header.module.less'

const Header: FC = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const userInfo = useAppSelector(selectUserInfo)
  const history = useHistory()
  const { username = '-', phone } = userInfo
  const firstWord = username.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const logout = async () => {
    console.log('user 登出', userInfo)
    if (userInfo.is_oidc_user) {
      setLoading(true)
      await oidcLogout()
      dispatch(setUserInfo({})) // 清除用户信息 下同
    } else {
      dispatch(setUserInfo({}))
      history.replace({ pathname: '/login' })
    }
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span className="ant-btn-link">退出登录</span>
        {loading && <LoadingOutlined />}
      </Menu.Item>
    </Menu>
  )

  const toggle = (): void => {
    setCollapsed(!collapsed)
    dispatch(setCollapsedGlobal(!collapsed))
  }

  return (
    <Layout.Header className={style.header}>
      <div className={style.toggleMenu} onClick={toggle}>
        {collapsed ? (
          <MenuUnfoldOutlined className={style.trigger} />
        ) : (
          <MenuFoldOutlined className={style.trigger} />
        )}
      </div>
      <Breadcrumb />

      {/* 右上角 */}
      <Dropdown className={`fr ${style.content}`} overlay={menu}>
        <span className={style.user}>
          <span className="avart">{firstWord}</span>
          <span>{phone}</span>
          {/* <span>{username}</span> */}
        </span>
      </Dropdown>
    </Layout.Header>
  )
}
export default Header
