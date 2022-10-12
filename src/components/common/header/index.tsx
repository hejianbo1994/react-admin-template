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
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import { selectUserInfo, initUserInfo } from '@/store/slicers/userSlice'
import { setCollapsed as setCollapsedGlobal } from '@/store/slicers/appSlice'
import style from './Header.module.less'

type MenuType = CommonObjectType<string>

const Header: FC = () => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
  )
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector(selectUserInfo)
  const { phone } = userInfo
  const [collapsed, setCollapsed] = useState(false)
  const logout = async () => {
    dispatch(initUserInfo())
    window.localStorage.clear()
  }
  const menuList = [
    {
      label: <span className="ant-btn-link">退出登录</span>,
      key: 'logout',
      onClick: logout
    }
  ]

  const menu = <Menu items={menuList} />

  const toggle = (): void => {
    setCollapsed(!collapsed)
    dispatch(setCollapsedGlobal(!collapsed))
  }

  const lightMedia = () => {
    const body =
      document.getElementsByTagName('body')[0] || document.documentElement

    const script = document.createElement('script')
    script.id = 'themeJs'
    script.src = './less.min.js'
    script.type = 'text/javascript'
    script.id = 'themeJs'
    body.appendChild(script)
    window.onload = function () {
      const themeStyle = document.getElementById('less:color')
      if (themeStyle) {
        window.localStorage.setItem('themeStyle', themeStyle.innerHTML)
      }
    }
  }

  const darkMedia = () => {
    const themeJs = document.getElementById('themeJs')
    const themeStyle =
      document.getElementById('less:color') ||
      document.getElementById('less:admin-color')
    if (themeJs) themeJs.remove()
    if (themeStyle) themeStyle.remove()
  }

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      console.log('dark')
      window.localStorage.setItem('theme', 'dark')
      darkMedia()
    }
    if (newTheme === 'light') {
      console.log('light')
      window.localStorage.setItem('theme', 'light')
      lightMedia()
    }
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

      <div className={`fr ${style.themeSwitchWrapper}`}>
        <div
          className={`${style.themeSwitch} ${
            { dark: style.themeSwitchDark, light: '' }[theme as string]
          }`}
          title="更换主题"
          onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <div className={style.themeSwitchInner} />
          <Icon icon="emojione:sun" />
          <Icon icon="bi:moon-stars-fill" color="#ffe62e" />
        </div>
      </div>

      {/* 右上角 */}
      <Dropdown className={`fr ${style.content}`} overlay={menu}>
        <span className={style.user}>
          <span>{phone}</span>
          {/* <span>{username}</span> */}
        </span>
      </Dropdown>
    </Layout.Header>
  )
}
export default Header
