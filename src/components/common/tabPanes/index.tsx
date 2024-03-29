import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useCallback,
  Component
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Alert, Dropdown, Menu } from 'antd'
import Home from '@/pages/home'
import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import { SyncOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'
import {
  selectTabs,
  selectReloadPath,
  setTabs,
  setReloadPath
} from '@/store/slicers/tabSlice'
import classNames from 'classnames'
import style from './TabPanes.module.less'

const { TabPane } = Tabs

const initPane = [
  {
    title: '首页',
    key: 'home',
    content: Home,
    closable: false,
    path: '/'
  }
]

interface Props {
  defaultActiveKey: string
  panesItem: {
    title: string
    content: Component
    key: string
    closable: boolean
    path: string
  }
  tabActiveKey: string
}
const noCheckAuth = ['/', '/403', '/test-api', '/workspace'] // 不需要检查权限的页面
// 检查权限
const checkAuth = (newPathname: string): boolean => {
  // 不需要检查权限的
  if (noCheckAuth.includes(newPathname)) {
    return true
  }
  const { tabKey: currentKey } = getKeyName(newPathname)
  return isAuthorized(currentKey)
}

// 多页签组件
const TabPanes: FC<Props> = (props) => {
  const dispatch = useAppDispatch()
  const reloadPath = useAppSelector(selectReloadPath)
  const curTab = useAppSelector(selectTabs)
  const [activeKey, setActiveKey] = useState<string>('')
  const [panes, setPanes] = useState<CommonObjectType[]>(initPane)
  const [isReload, setIsReload] = useState<boolean>(false)
  const [selectedPanel, setSelectedPanel] = useState<CommonObjectType>({})
  const pathRef: RefType = useRef<string>('')

  const { defaultActiveKey, panesItem, tabActiveKey } = props

  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const fullPath = pathname + search

  // 记录当前打开的tab
  const storeTabs = useCallback(
    (ps): void => {
      const pathArr = ps.map((item) => item.path)
      dispatch(setTabs(pathArr))
    },
    [dispatch]
  )

  // 从本地存储中恢复已打开的tab列表
  const resetTabs = useCallback((): void => {
    const initPanes = curTab.reduce(
      (prev: CommonObjectType[], next: string) => {
        const { title, tabKey, component: Content } = getKeyName(next)
        return [
          ...prev,
          {
            title,
            key: tabKey,
            content: Content,
            closable: tabKey !== 'home',
            path: next
          }
        ]
      },
      []
    )
    const { tabKey } = getKeyName(pathname)
    setPanes(initPanes)
    setActiveKey(tabKey)
  }, [curTab, pathname])

  // 初始化页面
  useEffect(() => {
    resetTabs()
  }, [resetTabs])

  useEffect(() => {
    panes.forEach((item) => {
      const isHasAuth = checkAuth(item.path)
      if (!isHasAuth) {
        remove(item.key)
      }
    })
  }, [panes])

  // tab切换
  const onChange = (tabKey: string): void => {
    setActiveKey(tabKey)
  }

  // 移除tab
  const remove = (targetKey: string): void => {
    const delIndex = panes.findIndex(
      (item: CommonObjectType) => item.key === targetKey
    )
    panes.splice(delIndex, 1)

    // 删除非当前tab
    if (targetKey !== activeKey) {
      const nextKey = activeKey
      setPanes(panes)
      setActiveKey(nextKey)
      storeTabs(panes)
      return
    }

    // 删除当前tab，地址往前推
    const nextPath = curTab[delIndex - 1]
    const { tabKey } = getKeyName(nextPath)
    // 如果当前tab关闭后，上一个tab无权限，就一起关掉
    if (!isAuthorized(tabKey) && nextPath !== '/') {
      remove(tabKey)
      navigate(curTab[delIndex - 2])
    } else {
      navigate(nextPath)
    }
    setPanes(panes)
    storeTabs(panes)
  }

  // tab新增删除操作
  const onEdit = (targetKey: string | any, action: string) =>
    action === 'remove' && remove(targetKey)

  // tab点击
  const onTabClick = (targetKey: string): void => {
    const { path } = panes.filter(
      (item: CommonObjectType) => item.key === targetKey
    )[0]
    navigate({ pathname: path })
  }

  // 刷新当前 tab
  const refreshTab = (): void => {
    setIsReload(true)
    setTimeout(() => {
      setIsReload(false)
    }, 1000)

    dispatch(setReloadPath(pathname + search))
    setTimeout(() => {
      dispatch(setReloadPath('null'))
    }, 500)
  }

  // 关闭其他或关闭所有
  const removeAll = async (isCloseAll?: boolean) => {
    const { path, key } = selectedPanel
    navigate(isCloseAll ? '/' : path)

    const homePanel = [
      {
        title: '首页',
        key: 'home',
        content: Home,
        closable: false,
        path: '/'
      }
    ]

    const nowPanes =
      key !== 'home' && !isCloseAll ? [...homePanel, selectedPanel] : homePanel
    setPanes(nowPanes)
    setActiveKey(isCloseAll ? 'home' : key)
    storeTabs(nowPanes)
  }

  useEffect(() => {
    const newPath = pathname + search

    // 当前的路由和上一次的一样，return
    if (!panesItem.path || panesItem.path === pathRef.current) return

    // 保存这次的路由地址
    pathRef.current = newPath

    const index = panes.findIndex(
      (_: CommonObjectType) => _.key === panesItem.key
    )
    // 无效的新tab，return
    if (!panesItem.key || (index > -1 && newPath === panes[index].path)) {
      setActiveKey(tabActiveKey)
      return
    }

    // 新tab已存在，重新覆盖掉（解决带参数地址数据错乱问题）
    if (index > -1) {
      panes[index].path = newPath
      setPanes(panes)
      setActiveKey(tabActiveKey)
      return
    }

    // 添加新tab并保存起来
    panes.push(panesItem)
    setPanes(panes)
    setActiveKey(tabActiveKey)
    storeTabs(panes)
  }, [panes, panesItem, pathname, resetTabs, search, storeTabs, tabActiveKey])

  const isDisabled = () => selectedPanel.key === 'home'

  const menuList = [
    {
      label: '刷新',
      key: 'refresh',
      onClick: refreshTab,
      disabled: selectedPanel.path !== fullPath
    },
    {
      label: '关闭',
      key: 'close',
      onClick: (e) => {
        e.domEvent.stopPropagation()
        remove(selectedPanel.key)
      },
      disabled: isDisabled()
    },
    {
      label: '关闭其他',
      key: 'closeOther',
      onClick: (e) => {
        e.domEvent.stopPropagation()
        removeAll()
      }
    },
    {
      label: '全部关闭',
      key: 'closeAll',
      onClick: (e) => {
        e.domEvent.stopPropagation()
        removeAll(true)
      },
      disabled: isDisabled()
    }
  ]

  // tab右击菜单
  const menu = <Menu items={menuList} />

  // 阻止右键默认事件
  const preventDefault = (e: CommonObjectType, panel: object) => {
    e.preventDefault()
    setSelectedPanel(panel)
  }

  const panesList = panes.map((pane) => ({
    label: (
      <Dropdown overlay={menu} placement="bottomLeft" trigger={['contextMenu']}>
        <span onContextMenu={(e) => preventDefault(e, pane)}>
          {/* {isReload && pane.path === fullPath && pane.path !== '/403' && (
        <SyncOutlined title="刷新" spin={isReload} />
      )} */}
          {pane.title}
        </span>
      </Dropdown>
    ),
    key: pane.key,
    closable: pane.closable,
    children:
      reloadPath !== pane.path ? (
        <pane.content path={pane.path} />
      ) : (
        <div style={{ height: '100vh' }}>
          <Alert message="刷新中..." type="info" />
        </div>
      )
  }))

  return (
    <Tabs
      // destroyInactiveTabPane
      items={panesList}
      activeKey={activeKey}
      className={classNames(style.tabs, 'history-tabs')}
      defaultActiveKey={defaultActiveKey}
      hideAdd
      onChange={onChange}
      onEdit={onEdit}
      onTabClick={onTabClick}
      type="editable-card"
      size="small"
    />
  )
}

export default TabPanes
