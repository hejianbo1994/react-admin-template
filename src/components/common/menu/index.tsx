import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import type { MenuTheme } from 'antd'

import { flattenRoutes, getKeyName } from '@/assets/js/publicFunc'
import menus from '@/route/routes'
import logo from '@/assets/img/logo.png'
import { useAppSelector, useAppDispatch } from '@/store/redux-hooks'
import { selectUserInfo, setUserInfo } from '@/store/slicers/userSlice'
import { selectCollapsed } from '@/store/slicers/appSlice'

import Api from '@/api'
import styles from './Menu.module.less'

const flatMenu = flattenRoutes(menus)

type MenuType = CommonObjectType<string>

type Theme = 'dark' | 'light'

const MenuView: FC = () => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('theme') as Theme
  )
  const navigate = useNavigate()

  const userInfo = useAppSelector(selectUserInfo)
  const collapsed = useAppSelector(selectCollapsed)
  const { pathname } = useLocation()
  const { tabKey: curKey = 'home' } = getKeyName(pathname)
  const [current, setCurrent] = useState(curKey)
  const [menuList, setMenuList] = useState([])
  const { permission = [], businessName } = userInfo
  const dispatch = useAppDispatch()

  // 递归逐级向上获取最近一级的菜单，并高亮
  const higherMenuKey = useCallback(
    (checkKey = 'home', path = pathname) => {
      if (
        checkKey === '403' ||
        flatMenu.some((item: MenuType) => item.key === checkKey)
      ) {
        return checkKey
      }
      const higherPath = path.match(/(.*)\//g)[0].replace(/(.*)\//, '$1')
      const { tabKey } = getKeyName(higherPath)
      return higherMenuKey(tabKey, higherPath)
    },
    [pathname]
  )

  useEffect(() => {
    if (userInfo.token) {
      //  创建菜单树

      Api.getCurrentInfo()
        .then((res) => {
          dispatch(setUserInfo(res))
        })
        .catch(() => {})
    }
  }, [userInfo.token])

  useEffect(() => {
    const list = menus.map((item) => renderMenu(item)).filter((v) => v)
    setMenuList(list)
  }, [userInfo.permission])

  useEffect(() => {
    setTheme(window.localStorage.getItem('theme') as Theme)
  }, [theme])

  useEffect(() => {
    const { tabKey } = getKeyName(pathname)
    const higherKey = higherMenuKey(tabKey)
    setCurrent(higherKey)
  }, [higherMenuKey, pathname])

  // 菜单点击事件
  const handleClick = ({ key }): void => {
    setCurrent(key)
  }

  // 创建可跳转的多级子菜单
  const createMenuItem = (data: MenuType) => {
    return (
      !data.hideInMenu && {
        label: data.name,
        key: data.key,
        icon: <data.icon />,
        onClick: () => {
          navigate(data.path)
        }
      }
    )
  }

  // 创建可展开的第一级子菜单
  const creatSubMenu = (data) => {
    const menuItemList = data.routes.reduce((prev, item: MenuType) => {
      const isAuthMenu = permission.find((key: any) => item.key === key)
      return isAuthMenu && !item.hideInMenu ? [...prev, renderMenu(item)] : prev
    }, [])

    return menuItemList.length > 0
      ? {
          label: data.name,
          key: data.key,
          icon: <data.icon />,
          children: menuItemList
        }
      : null
  }

  // 判断是否有子菜单，渲染不同组件
  function renderMenu(item: MenuType) {
    if (item.type === 'subMenu') {
      return creatSubMenu(item)
    }
    return createMenuItem(item)
  }

  const setDefaultKey = flatMenu
    .filter((item: MenuType) => item.type === 'subMenu')
    .reduce((prev: MenuType[], next: MenuType) => [...prev, next.key], [])

  const showKeys = collapsed ? [] : setDefaultKey
  const LogLink = () => (
    <Link to={{ pathname: '/' }}>
      <div className="flex items-center logo">
        <img alt="logo" src={logo} width="32" />
        {!collapsed && <h1>Space云筑</h1>}
      </div>
    </Link>
  )
  return (
    <Layout.Sider
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        userSelect: 'none'
      }}
      width={220}
    >
      <LogLink />
      <Menu
        items={menuList}
        defaultOpenKeys={showKeys}
        mode="inline"
        onClick={handleClick}
        selectedKeys={[current]}
        style={{
          flex: 1
        }}
      />
    </Layout.Sider>
  )
}

export default MenuView
