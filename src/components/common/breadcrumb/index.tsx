import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Breadcrumb, Button } from 'antd'
import routes from '@/route/routes'

interface Props {
  breadcrumbs: any[]
}

// 通用面包屑
const Breadcrumbs: FC<Props> = ({ breadcrumbs }) => {
  const navigate = useNavigate()
  return (
    <></>
    // <Breadcrumb style={{ display: 'inline-block' }}>
    //   {breadcrumbs.map((bc: CommonObjectType, index: number) => {
    //     return (
    //       <Breadcrumb.Item key={bc.key}>
    //         <Button
    //           disabled={
    //             (!bc.exact && bc.match.path !== '/') ||
    //             index === breadcrumbs.length - 1
    //           }
    //           onClick={() => {
    //             navigate(bc.match.path)
    //           }}
    //           style={{ padding: '0' }}
    //           type="link"
    //         >
    //           {bc.name}
    //         </Button>
    //       </Breadcrumb.Item>
    //     )
    //   })}
    // </Breadcrumb>
  )
}

export default Breadcrumbs
// export default withBreadcrumbs(routes)(Breadcrumbs)
