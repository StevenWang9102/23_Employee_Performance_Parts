import React, { useEffect, useState } from 'react'
import { Menu, Button, Dropdown } from 'antd'
import { AppstoreOutlined, UserOutlined, DownOutlined, LockOutlined } from '@ant-design/icons'
import { getName, logout } from '../../services/lib/utils/auth.utils'
import { Link, useHistory, useLocation} from 'react-router-dom'
import './style.css'
import SweetAlertService from '../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../services/api/api'
import { getCookie } from 'react-use-cookie'

const { SubMenu } = Menu

function CommonHeader() {
  const history = useHistory()
  const location = useLocation()
  const [current, setCurrent] = useState('mail')
  const [userRoutes, setUserRoutes] = useState<any>([])

  useEffect(() => {
    let isCancelled = false
    let allRoutes: any = []
    const pages: any = localStorage.getItem('pages')
    // console.log(JSON.parse(pages))
    const a = (JSON.parse(pages) || []).map((row: any) => {
      if (!allRoutes.filter((item: any) => item.groupId === row.groupId)[0]) {
        allRoutes.push({
          ...row,
          pages: [row]
        })
      } else {
        allRoutes = allRoutes.map((item: any) => item.groupId === row.groupId ? ({...item, pages: [...item.pages, row]}) : item)
      }
    })
    // console.log(allRoutes)
    if (!isCancelled) {
      const userRouters = allRoutes.sort((a: any, b: any) => a.group.sortingOrder - b.group.sortingOrder).map((row: any) => ({
        title: row.group.groupName,
        drop: true,
        accessLevel: 1,
        icon: <AppstoreOutlined />,
        inter: row.pages.sort((a: any, b: any) => a.sortingOrder - b.sortingOrder).map((item: any) => ({
          title: item.pageName,
          path: item.pageUrl,
          accessLevel: 2,
        }))
      }))
      console.log("userRouters324432",userRouters)
      setUserRoutes(userRouters)
    }
    return () => {
      isCancelled = true
    }
  }, [location.pathname])

  const profileMenu = (
    <Menu >
      <Menu.Item key="1" icon={<LockOutlined />} onClick={async () => {
        const result = await SweetAlertService.inputConfirm({
          type: 'text',
          title: 'New Password',
          defaultValue: '',
          placeholder: ' '
        })
        if (result !== null) {
          ApiRequest({
            url: 'Employee/ResetPassword?employeeId=' + getCookie('id') + '&newPassword=' + result,
            method: 'put'
          }).then(async _ => {
            await SweetAlertService.successMessage()
            logout(() => history.push('/'))
            sessionStorage.removeItem('token')
          })
        }
      }}>
        Change Password
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />} onClick={() => {
        logout(() => history.push('/'))
        sessionStorage.removeItem('token')
      }}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <div style={{display: 'flex', boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)', height: '3rem', marginBottom: '1.5rem', width: '100%', position: 'sticky', top: 0, zIndex: 20}}>
      <div style={{width: '15%', borderBottom: '1px solid #F7F7F7', textAlign: 'center', lineHeight: '47px', backgroundColor: 'white'}} onClick={() => history.push('/home')}>
        <img src="https://static.wixstatic.com/media/6f5302_d4fdbb80ae4446f695b333841f274373~mv2.png/v1/fill/w_310,h_84,al_c,q_85,usm_0.66_1.00_0.01/Logo.webp" style={{height: '40px', cursor: 'pointer'}} />
      </div>
      <div style={{width: '70%'}}>
        <Menu selectedKeys={[current]} mode="horizontal" style={{textAlign: 'center', color: 'rgb(109,140,125)'}}>
          {userRoutes.map((item: any) => {
            if (item.drop) {
              return (
                <SubMenu key={item.title} title={item.title} icon={item.icon} >
                  {item.inter.map((item2: any) => {
                    console.log("item2.path", item2.path);
                    console.log("item2.title", item2.title);
                    console.log("item.title", item.title);
                    
                    if (item2.path && item2.title) {
                      return (<Menu.Item key={item2.title} style={{color: 'rgb(109,140,125)'}}><Link to={item2.path} >{item2.title}</Link></Menu.Item>)
                    }
                  })}
                </SubMenu>
              )
            }
            return (
              <Menu.Item key={item.title} className="hyp" icon={item.icon}>
                <a href={item.path}>{item.title}</a>
              </Menu.Item>
            )
          })}
        </Menu>
      </div>
      <div style={{borderBottom: '1px solid #F7F7F7', lineHeight: '48px', backgroundColor: 'white'}}>
        <Dropdown overlay={profileMenu}>
          <Button style={{color: 'rgb(109,140,125)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            Hi, {getName()}
            <DownOutlined/>
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default CommonHeader
