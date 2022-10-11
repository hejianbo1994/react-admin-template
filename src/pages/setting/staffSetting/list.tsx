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

const StaffSettingList: FC = () => {
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
  ]

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
export default withRouter(StaffSettingList)
