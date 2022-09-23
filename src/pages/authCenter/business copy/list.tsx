import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { List, Typography, Button } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import { selectUserInfo, setUserInfo } from '@/store/slicers/userSlice'
import { useAppDispatch, useAppSelector } from '@/store/redux-hooks'

const { Text } = Typography

const Business: FC = () => {
  const userInfo = useAppSelector(selectUserInfo)
  const history = useHistory()
  const { username, permission, phone } = userInfo
  const dispatch = useAppDispatch()

  // 切换权限
  const changeAuth = () => {
    const newInfo = {
      ...userInfo,
      // 模拟权限
      permission:
        permission.length === 5
          ? [
              {
                code: 'user:list',
                name: '查看用户列表'
              },
              {
                code: 'user:edit',
                name: '编辑用户'
              },
              {
                code: 'auth:test',
                name: '查看权限测试页'
              },
              {
                code: 'setting:accountSetting',
                name: '查看账户设置'
              }
            ]
          : [
              {
                code: 'user:list',
                name: '查看用户列表'
              },
              {
                code: 'user:add',
                name: '新增用户'
              },
              {
                code: 'user:edit',
                name: '编辑用户'
              },
              {
                code: 'role:list',
                name: '查看角色列表'
              },
              {
                code: 'auth:test',
                name: '查看权限测试页'
              }
            ]
    }
    dispatch(setUserInfo(newInfo))
  }

  return (
    <>
      <Text style={{ margin: 20 }}>
        当前用户：<Text code>{username}</Text>
      </Text>
      <br />
      <Text style={{ margin: 20 }}>
        当前权限：
        <KeyOutlined />
      </Text>
      <List
        size="large"
        footer={
          <Button type="primary" onClick={changeAuth}>
            切换权限
          </Button>
        }
        bordered
        dataSource={permission}
        renderItem={(item) => (
          <List.Item>
            {item.name} - {item.code}
          </List.Item>
        )}
        style={{ margin: 20 }}
      />
      <Button onClick={() => history.push('/role/list')} style={{ margin: 20 }}>
        切换权限后，点击这里，访问【角色列表】试试
      </Button>
    </>
  )
}

export default Business
