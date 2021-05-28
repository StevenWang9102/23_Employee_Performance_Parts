import { Table, Space, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd';
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import { getCookie, setCookie } from 'react-use-cookie'
import { Link, useHistory, useLocation} from 'react-router-dom'

const createForm = (props: any) => {
  const {form1} = props
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  return (
    <section
     style={{ maxWidth: 1000, margin: "auto" }}
    >
     <Form
          {...layout}
          form={props.form1}
          name="basic"
          // initialValues={{
          //   remember: true,
          // }}
          // onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your standard name !',
              },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue={true}
            rules={[ { required: true },
            ]}
          >
            <Switch
              size="small"
              defaultChecked={true}
              onChange={(value)=>{
                console.log('onChange,switch', value);
                
                form1.setFieldsValue({
                  ...form1.getFieldsValue(),
                  status: value
                })
              }}
            />
          </Form.Item>
        </Form>
    </section>
  );
}

export default createForm;
