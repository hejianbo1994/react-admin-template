import {
  HomeOutlined,
  BankOutlined,
  UserOutlined,
  AuditOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  ApiOutlined
} from '@ant-design/icons'
import Home from '@/pages/home'
import Workspace from '@/pages/home/Workspace'
import ErrorPage from '@/pages/public/errorPage'

import UserList from '@/pages/user/list'
import AccountSetting from '@/pages/setting/accountSetting'
import StaffSettingList from '@/pages/setting/staffSetting/list'

import UserEdit from '@/pages/user/edit'

import RoleList from '@/pages/role/list'

import businesManageList from '@/pages/authCenter/businesManage/list'
import permissionManageList from '@/pages/authCenter/permissionManage/list'
import { MenuRoute } from '@/route/types'
// import React from 'react'
// import { Icon } from '@iconify/react'
import { TestApiLoad } from './TempTestRouteComponent'

/**
 * path 跳转的路径
 * component 对应路径显示的组件
 * exact 匹配规则，true的时候则精确匹配。
 */
const preDefinedRoutes: MenuRoute[] = [
  {
    path: '/',
    name: '首页',
    exact: true,
    key: 'home',
    icon: HomeOutlined,
    component: Home
  },
  {
    path: '/content',
    name: '内容',
    key: 'content',
    type: 'subMenu',
    icon: UserOutlined,
    iconfont: 'icon-xiaoshouzongjian',
    routes: [
      {
        path: '/content/materialLibrary',
        name: '素材库',
        exact: true,
        key: 'content:materialLibrary',
        component: AccountSetting,
        icon: AuditOutlined
      },
      {
        path: '/content/productLibrary',
        name: '产品库',
        exact: true,
        key: 'content:productLibrary',
        component: AccountSetting,
        icon: UserOutlined
      },
      {
        path: '/content/tagManage',
        name: '标签管理',
        exact: true,
        key: 'content:tagManage',
        component: AccountSetting,
        icon: UserOutlined
      },
      {
        path: '/content/pageManage',
        name: '页面管理',
        exact: true,
        key: 'content:pageManage',
        component: AccountSetting,
        icon: UserOutlined
      }
    ]
  },
  {
    path: '/interactive',
    name: '互动',
    key: 'interactive',
    type: 'subMenu',
    icon: UserOutlined,
    iconfont: 'icon-xiaoshouzongjian',
    routes: [
      {
        path: '/interactive/userManage',
        name: '用户管理',
        exact: true,
        key: 'interactive:userManage',
        component: UserList,
        icon: UserOutlined
      }
      // {
      //   path: '/interactive/add',
      //   name: '新增用户',
      //   exact: true,
      //   key: 'user:add',
      //   // hideInMenu: true,
      //   component: UserEdit
      // },
      // {
      //   path: '/user/edit',
      //   name: '编辑用户',
      //   exact: true,
      //   key: 'user:edit',
      //   hideInMenu: true,
      //   component: UserEdit
      // }
    ]
  },
  {
    path: '/setting',
    name: '设置',
    key: 'setting',
    type: 'subMenu',
    icon: UserOutlined,
    iconfont: 'icon-xiaoshouzongjian',
    routes: [
      {
        path: '/setting/companySetting',
        name: '公司设置',
        exact: true,
        key: 'setting:companySetting',
        component: AccountSetting,
        icon: UserOutlined
      },
      {
        path: '/setting/staffSetting',
        name: '人员设置',
        exact: true,
        key: 'setting:staffSetting',
        component: StaffSettingList,
        icon: UserOutlined
      }
    ]
  },
  // {
  // path: '/workspace',
  // name: '工作台',
  // exact: true,
  // key: 'workspace',
  // component: Workspace,
  // icon: DashboardOutlined
  // icon: () =>
  //   React.createElement(Icon, { icon: 'arcticons:syska-smart-home' })
  // },

  // {
  //   path: '/role',
  //   name: '角色管理',
  //   key: 'role',
  //   type: 'subMenu',
  //   icon: AuditOutlined,
  //   routes: [
  //     {
  //       path: '/role/list',
  //       name: '角色列表',
  //       exact: true,
  //       key: 'role:list',
  //       component: RoleList
  //     }
  //   ]
  // },
  {
    path: '/authCenter',
    name: '权限中心',
    key: 'authCenter',
    type: 'subMenu',
    icon: AuditOutlined,
    routes: [
      {
        icon: AuditOutlined,
        path: '/authCenter/businessManage',
        name: '商户管理',
        exact: true,
        key: 'authCenter:businessManage',
        component: businesManageList
      },
      {
        icon: AuditOutlined,
        path: '/authCenter/permissionManage',
        name: '权限管理',
        exact: true,
        key: 'authCenter:permissionManage',
        component: permissionManageList
      }
    ]
  },
  {
    path: '/test-api',
    name: '测试api',
    exact: true,
    hideInMenu: true,
    key: '/test-api',
    icon: ApiOutlined,
    component: TestApiLoad
  },
  {
    path: '/403',
    name: '暂无权限',
    exact: true,
    key: '/403',
    icon: InfoCircleOutlined,
    hideInMenu: true,
    component: ErrorPage
  }
]

export default preDefinedRoutes
