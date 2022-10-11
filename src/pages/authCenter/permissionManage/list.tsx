import React, { useRef, useState, FC } from 'react'
import { withRouter } from 'react-router-dom'
import MyTable from '@/components/common/table'
import Api from '@/api/authCenter/permissionManage'
import { Button, Input, Modal, Form, Space, Radio } from 'antd'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const tailLayout = {
  wrapperCol: { offset: 8 }
}

const PermissionList: FC = () => {
  const tableRef: RefType = useRef()
  const [loading, setLoading] = useState(false)

  const [modalArgs, setModalArgs] = useState({
    type: '',
    title: '',
    open: false
  })

  const [form] = Form.useForm()

  // 列表
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: 'code',
      dataIndex: 'code',
      align: 'center'
    },
    {
      title: 'hidden',
      align: 'center',
      render: (_, record) => ({ true: '不可选', false: '可选' }[record.hidden])
    }

    // {
    //   title: '操作',
    //   align: 'center',
    //   render: (_, record) => (
    //     <Space>
    //       <Button className="btn" onClick={() => edit(record)} size="small">
    //         编辑权限
    //       </Button>
    //       <Button className="btn" onClick={() => add2(record)} size="small">
    //         添加管理员
    //       </Button>
    //       {record.status && (
    //         <Popconfirm
    //           title="确认停用?"
    //           okText="确认"
    //           cancelText="取消"
    //           onConfirm={() => disable(record)}
    //         >
    //           <Button className="btn" size="small">
    //             停用
    //           </Button>
    //         </Popconfirm>
    //       )}
    //       {!record.status && (
    //         <Popconfirm
    //           title="确认启用?"
    //           okText="确认"
    //           cancelText="取消"
    //           onConfirm={() => enable(record)}
    //         >
    //           <Button className="btn" size="small">
    //             启用
    //           </Button>
    //         </Popconfirm>
    //       )}
    //     </Space>
    //   )
    // }
  ]

  // 编辑商户
  // const edit = (record) => {
  //   Api.businessPermission({
  //     businessId: record.businessId
  //   }).then((res) => {
  //     children.current = res.allPermission.map((permission) => (
  //       <Select.Option
  //         disabled={permission.hidden}
  //         key={permission.code}
  //         value={permission.code}
  //         label={permission.name}
  //       >
  //         {permission.name}
  //       </Select.Option>
  //     ))
  //     form.setFieldsValue(res)
  //     setModalArgs({ type: 'edit', title: '编辑', open: true })
  //   })
  // }

  // 编辑管理员
  // const edit2 = (record, user) => {
  //   console.log(user)
  //   Api.businessUserPermission({
  //     businessId: record.businessId,
  //     id: user._id
  //   }).then((res) => {
  //     children2.current = res.businessPermission.map((permission) => (
  //       <Select.Option
  //         disabled={permission.hidden}
  //         key={permission.code}
  //         value={permission.code}
  //         label={permission.name}
  //       >
  //         {permission.name}
  //       </Select.Option>
  //     ))
  //     form2.setFieldsValue(res)
  //     setModalArgs2({ type: 'edit', title: '编辑', open: true })
  //   })
  // }

  // 新增权限按钮
  const AddBtn = () => (
    <Button className="fr" onClick={add} type="primary">
      新增权限
    </Button>
  )

  // 新增权限
  const add = () => {
    setModalArgs({ type: 'add', title: '新增权限', open: true })
  }

  // 新增管理员
  // const add2 = (record) => {
  // Api.businessPermissionOpt({
  //   businessId: record.businessId
  // }).then((res) => {
  //   children2.current = res.businessPermission.map((permission) => (
  //     <Select.Option
  //       disabled={permission.hidden}
  //       key={permission.code}
  //       value={permission.code}
  //       label={permission.name}
  //     >
  //       {permission.name}
  //     </Select.Option>
  //   ))
  //   form2.setFieldsValue(res)
  //   setModalArgs2({ type: 'add', title: '新增管理员', open: true })
  // })
  // }

  // 新增/编辑权限-取消
  const handleCancel = () => {
    setModalArgs({ type: '', title: '', open: false })
    form.resetFields()
  }

  // 新增/编辑权限-确认
  const handleFinish = (values: any) => {
    if (modalArgs.type === 'edit') {
      // Api.businessPermissionUpdate({
      //   businessId: form.getFieldValue('businessId'),
      //   businessPermission: values.businessPermission
      // }).then(() => {
      //   tableRef.current.update()
      //   setLoading(false)
      //   handleCancel()
      // })
    }
    if (modalArgs.type === 'add') {
      Api.permissionAdd({
        name: values.name,
        code: values.code,
        hidden: values.hidden
      }).then(() => {
        tableRef.current.update()
        setLoading(false)
        handleCancel()
      })
    }
  }

  // 删除管理员
  // const del = (record, user) => {
  //   Api.businessUserDel({
  //     businessId: record.businessId,
  //     id: user._id
  //   })
  //     .then(() => {
  //       tableRef.current.update()
  //     })
  //     .catch(() => {})
  // }

  // 停用商户
  // const disable = (record) => {
  //   Api.businessDisable({
  //     businessId: record.businessId
  //   })
  //     .then(() => {
  //       tableRef.current.update()
  //     })
  //     .catch(() => {})
  // }

  // 启用商户
  // const enable = (record) => {
  //   Api.businessEnable({
  //     businessId: record.businessId
  //   })
  //     .then(() => {
  //       tableRef.current.update()
  //     })
  //     .catch(() => {})
  // }

  // const handleChange = (value: string[]) => {
  //   console.log(`selected ${value}`)
  // }

  const handleFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <AddBtn />
      <MyTable
        rowKey="_id"
        apiFun={Api.permissionList}
        columns={columns}
        ref={tableRef}
        // extraProps={{ results: 10 }}
      />

      {/* 编辑/新增 权限 */}
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
            label="name"
            name="name"
            rules={[{ required: true, message: '请输入name!' }]}
          >
            <Input disabled={modalArgs.type === 'edit'} />
          </Form.Item>
          <Form.Item
            label="code"
            name="code"
            rules={[{ required: true, message: '请输入code!' }]}
          >
            <Input disabled={modalArgs.type === 'edit'} />
          </Form.Item>
          <Form.Item
            label="hidden"
            name="hidden"
            rules={[{ required: true, message: '请选择hidden!' }]}
          >
            <Radio.Group disabled={modalArgs.type === 'edit'}>
              <Radio value> 不可选 </Radio>
              <Radio value={false}> 可选 </Radio>
            </Radio.Group>
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
    </>
  )
}
export default withRouter(PermissionList)
