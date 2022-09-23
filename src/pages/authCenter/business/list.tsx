import React, { useRef, FC } from 'react'
import { withRouter } from 'react-router-dom'
import MyTable from '@/components/common/table'
import Api from '@/api/authCenter/business'

const BusinessList: FC = () => {
  const tableRef: RefType = useRef()

  const columns = [
    {
      title: '商户名称',
      dataIndex: 'businessName',
      align: 'center'
    },
    // {
    //   title: 'name',
    //   dataIndex: 'name',
    //   align: 'center',
    //   render: (name: CommonObjectType<string>) => `${name.first} ${name.last}`
    // sorter: true
    // },
    {
      title: '管理员',
      dataIndex: 'admin',
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center'
    }
  ]
  return (
    <>
      <MyTable
        rowKey="_id"
        apiFun={Api.getBusinessList}
        columns={columns}
        ref={tableRef}
        // extraProps={{ results: 10 }}
      />
    </>
  )
}
export default withRouter(BusinessList)
