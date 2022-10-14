import React, { useRef, useState, FC } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Form,
  Space,
  Tag,
  Radio,
  Select
} from 'antd'
import { FormOutlined, CloseOutlined } from '@ant-design/icons'
import CryptoJs from 'crypto-js'
import Api from '@/api/authCenter/businessManage'
import MyTable from '@/components/common/table'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const tailLayout = {
  wrapperCol: { offset: 8 }
}

const BusinessList: FC = () => {
  const tableRef: RefType = useRef()
  const [loading, setLoading] = useState(false)
  const children = useRef([])
  const children2 = useRef([])

  const [modalArgs, setModalArgs] = useState({
    type: '',
    title: '',
    open: false
  })
  const [modalArgs2, setModalArgs2] = useState({
    type: '',
    title: '',
    open: false
  })

  const [form] = Form.useForm()
  const [form2] = Form.useForm()

  // 搜索栏配置项
  const searchConfigList = [
    {
      key: 'businessId',
      slot: <Input placeholder="businessId" allowClear />,
      rules: [],
      initialValue: ''
    }
    // {
    //   key: 'gender',
    //   slot: (
    //     <MySelect
    //       data={[
    //         { name: 'male', key: 'male' },
    //         { name: 'female', key: 'female' }
    //       ]}
    //       placeholder="gender"
    //     />
    //   )
    // }
  ]

  // 列表
  const columns = [
    {
      title: '商户id',
      dataIndex: 'businessId',
      align: 'center'
    },
    {
      title: '商户名称',
      dataIndex: 'businessName',
      align: 'center'
    },
    {
      title: '管理员',
      align: 'center',
      render: (_, record) => (
        <Space wrap className="flex justify-start">
          {record.users.map((user) => {
            return (
              <Tag key={user.phone} className="flex items-center">
                <FormOutlined onClick={() => edit2(record, user)} />
                {user.name}({user.phone})
                <Popconfirm
                  title={`确认删除${user.name}?`}
                  okText="确认"
                  cancelText="取消"
                  onConfirm={() => del(record, user)}
                >
                  <CloseOutlined />
                </Popconfirm>
              </Tag>
            )
          })}
        </Space>
      )
    },
    {
      title: '状态',
      align: 'center',
      render: (_, record) => (
        <Space>{{ true: '正常', false: '停用' }[record.status]}</Space>
      )
    },

    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button className="btn" onClick={() => edit(record)} size="small">
            编辑权限
          </Button>
          <Button className="btn" onClick={() => add2(record)} size="small">
            添加管理员
          </Button>
          {record.status && (
            <Popconfirm
              title="确认停用?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => disable(record)}
            >
              <Button className="btn" size="small">
                停用
              </Button>
            </Popconfirm>
          )}
          {!record.status && (
            <Popconfirm
              title="确认启用?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => enable(record)}
            >
              <Button className="btn" size="small">
                启用
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  // 编辑商户
  const edit = (record) => {
    Api.businessPermission({
      businessId: record.businessId
    }).then((res) => {
      setModalArgs({ type: 'edit', title: '编辑', open: true })
      form.setFieldsValue(res)
      children.current = res.allPermission.map((permission) => (
        <Select.Option
          disabled={permission.hidden}
          key={permission.code}
          value={permission.code}
          label={permission.name}
        >
          {permission.name}
        </Select.Option>
      ))
    })
  }

  // 编辑管理员
  const edit2 = (record, user) => {
    console.log(user)
    Api.businessUserPermission({
      businessId: record.businessId,
      id: user._id
    }).then((res) => {
      setModalArgs2({ type: 'edit', title: '编辑', open: true })
      form2.setFieldsValue(res)
      children2.current = res.businessPermission.map((permission) => (
        <Select.Option
          key={permission.code}
          value={permission.code}
          label={permission.name}
        >
          {permission.name}
        </Select.Option>
      ))
    })
  }

  // 新增商户按钮
  const AddBtn = () => (
    <Button className="fr" onClick={add} type="primary">
      新增商户
    </Button>
  )

  // 新增商户
  const add = () => {
    Api.allPermissionOpt().then((res) => {
      children.current = res.allPermission.map((permission) => (
        <Select.Option
          disabled={permission.hidden}
          key={permission.code}
          value={permission.code}
          label={permission.name}
        >
          {permission.name}
        </Select.Option>
      ))
      setModalArgs({ type: 'add', title: '新增商户', open: true })
    })
  }

  // 新增管理员
  const add2 = (record) => {
    Api.businessPermissionOpt({
      businessId: record.businessId
    }).then((res) => {
      children2.current = res.businessPermission.map((permission) => (
        <Select.Option
          key={permission.code}
          value={permission.code}
          label={permission.name}
        >
          {permission.name}
        </Select.Option>
      ))
      form2.setFieldsValue(res)
      setModalArgs2({ type: 'add', title: '新增管理员', open: true })
    })
  }

  // 新增/编辑商户-取消
  const handleCancel = () => {
    setModalArgs({ type: '', title: '', open: false })
    form.resetFields()
  }
  // 新增/编辑管理员-取消2
  const handleCancel2 = () => {
    setModalArgs2({ type: '', title: '', open: false })
    form2.resetFields()
  }

  // 新增/编辑商户-确认
  const handleFinish = (values: any) => {
    if (modalArgs.type === 'edit') {
      Api.businessPermissionUpdate({
        businessId: form.getFieldValue('businessId'),
        businessPermission: values.businessPermission
      }).then(() => {
        tableRef.current.update()
        setLoading(false)
        handleCancel()
      })
    }
    if (modalArgs.type === 'add') {
      console.log(values)
      Api.businessAdd({
        businessPermission: values.businessPermission,
        status: values.status,
        businessName: values.businessName
      }).then(() => {
        tableRef.current.update()
        setLoading(false)
        handleCancel()
      })
    }
  }

  // 新增/编辑管理员-确认2
  const handleFinish2 = (values: any) => {
    if (modalArgs2.type === 'edit') {
      Api.businessUserPermissionUpdate({
        id: form2.getFieldValue('_id'),
        businessId: form2.getFieldValue('businessId'),
        permission: values.permission
      }).then(() => {
        tableRef.current.update()
        setLoading(false)
        handleCancel2()
      })
    }
    if (modalArgs2.type === 'add') {
      Api.businessUserAdd({
        businessId: form2.getFieldValue('businessId'),
        permission: values.permission,
        phone: values.phone,
        name: values.name,
        password: CryptoJs.MD5(values.password).toString()
      }).then(() => {
        tableRef.current.update()
        setLoading(false)
        handleCancel2()
      })
    }
  }

  // 删除管理员
  const del = (record, user) => {
    Api.businessUserDel({
      businessId: record.businessId,
      id: user._id
    })
      .then(() => {
        tableRef.current.update()
      })
      .catch(() => {})
  }

  // 停用商户
  const disable = (record) => {
    Api.businessDisable({
      businessId: record.businessId
    })
      .then(() => {
        tableRef.current.update()
      })
      .catch(() => {})
  }

  // 启用商户
  const enable = (record) => {
    Api.businessEnable({
      businessId: record.businessId
    })
      .then(() => {
        tableRef.current.update()
      })
      .catch(() => {})
  }

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }

  const handleChange2 = (value: string[]) => {
    console.log(`selected ${value}`)
  }

  const handleFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const handleFinishFailed2 = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <AddBtn />
      <MyTable
        rowKey="_id"
        apiFun={Api.getBusinessUserList}
        searchConfigList={searchConfigList}
        columns={columns}
        ref={tableRef}
        // extraProps={{ results: 10 }}
      />

      {/* 编辑/新增 商户 */}
      <Modal
        open={modalArgs.open}
        title={modalArgs.title}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          {...layout}
          name="basic"
          initialValues={{}}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="商户名称"
            name="businessName"
            rules={[{ required: true, message: '请输入商户名称!' }]}
          >
            <Input disabled={modalArgs.type === 'edit'} />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态!' }]}
          >
            <Radio.Group disabled={modalArgs.type === 'edit'}>
              <Radio value> 正常 </Radio>
              <Radio value={false}> 停用 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="商户权限" name="businessPermission">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择管理员权限"
              onChange={handleChange}
              optionLabelProp="label"
            >
              {children.current}
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button htmlType="button" onClick={handleCancel}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑/新增 管理员 */}
      <Modal
        open={modalArgs2.open}
        title={modalArgs2.title}
        onCancel={handleCancel2}
        footer={null}
      >
        <Form
          form={form2}
          {...layout}
          name="basic"
          initialValues={{}}
          onFinish={handleFinish2}
          onFinishFailed={handleFinishFailed2}
          autoComplete="off"
        >
          <Form.Item
            label="管理员"
            name="name"
            rules={[{ required: true, message: '请输入管理员!' }]}
          >
            <Input disabled={modalArgs2.type === 'edit'} />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: '请输入手机号!' }]}
          >
            <Input disabled={modalArgs2.type === 'edit'} />
          </Form.Item>
          <Form.Item
            hidden={modalArgs2.type === 'edit'}
            label="密码"
            name="password"
            rules={[
              { required: modalArgs2.type === 'add', message: '请输入密码!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="管理员权限" name="permission">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择管理员权限"
              onChange={handleChange2}
              optionLabelProp="label"
            >
              {children2.current}
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button htmlType="button" onClick={handleCancel2}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
const withLocation = (Component) => (props) => {
  const location = useLocation()

  return <Component {...props} location={location} />
}
export default withLocation(BusinessList)
