import { Table, Space, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd';
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import StandardItem from './item-page/standard-item';
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service';


const MyTable = (props: any) => {
  const {
    createOneStandard,
    updateOneStandard,
    deleteOneStandard,
    standards
  } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [source, setSource] = useState([])
  const [visable, setVisable] = useState(false)
  const [visable1, setVisable1] = useState(false)
  const [detaiVisable, setDetaiVisable] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>({})
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  console.log('MyTable,standards', standards);

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: any, record: any) => {
        console.log('render,text', text);
        console.log('render,record', record);

        if (text == 1) return <span style={{ color: 'green', fontWeight: 700 }}>Active</span>
        if (text == 0) return <span style={{ color: 'lightgray', fontWeight: 700 }}>Inactive</span>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (

        <Space size="middle">
          <Button
            // type='primary'
            onClick={() => {
              console.log('Modify,record', record);
              const acceStandardId = record.acceStandardId
              setDetaiVisable(true)
              setCurrentRecord(record)
            }} >Standard Details
          </Button>

          <Button
            type='primary'
            style={{width: 70}}
            onClick={() => {
              setVisable(true)
              setCurrentRecord(record)
              form.setFieldsValue({
                ...form.getFieldsValue(),
                name: record.name
              })
            }} >Edit
          </Button>

          <Popconfirm
            title="Are you sure？"
            onConfirm={() => {
              console.log("delete,Record", record);
              const id = record.acceStandardId
              deleteOneStandard(id)
            }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger> Delete  </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  useEffect(() => {
    console.log('MyTable,standards2', standards);
    if (standards.length > 0) {
      const data: any = [];

      for (let i = 0; i < standards.length; i++) {
        const each = standards[i]
        data.push({
          key: i,
          acceStandardId: each.acceStandardId,
          name: each.name,
          status: each.active,
        });
      }
      setSource(data)
    }

  }, [standards])


  const onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };

  console.log('render4358:standards', standards);

  return (
    <section
      style={{ maxWidth: 800, margin: "auto" }}
    >
      <h5 style={{display: 'inline', marginRight: "20px"}}>Assessment Standards</h5>
      <Button
        type='primary'
        style={{ margin: "10px 0" }}
        onClick={() => {
          setVisable1(true)
          form1.setFieldsValue({
            name: null,
            status: true
          })
        }}
      > Create new standard </Button>

      <Table
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={source}
      />

      {/* ------------------------------------- Create ------------------------------------- */}
      <Modal
        title="Create a standard"
        destroyOnClose
        visible={visable1}
        okText="Create"
        onOk={() => {
          console.log('CreateStandard432,form', form1.getFieldsValue());
          const formValues = form1.getFieldsValue();

          const body = {
            name: formValues.name,
            acceStandardId: " ",
            active: formValues.status ? 1 : 0
          }

          console.log('CreateStandard432,body', body.name);

          if(body.name == '' || body.name == null ){
            SweetAlertService.errorMessage("Name field is required.")
          } else {
            createOneStandard(body)
            setVisable1(false)
          }
        }}
        onCancel={() => setVisable1(false)}
      >
        <Form
          {...layout}
          form={form1}
          name="basic"
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue={true}
            rules={[{ required: true },
            ]}
          >
            <Switch
              size="small"
              defaultChecked={true}
              onChange={(value) => {
                console.log('onChange,switch', value);

                form1.setFieldsValue({
                  ...form1.getFieldsValue(),
                  status: value
                })
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ------------------------------------- Edit ------------------------------------- */}
      <Modal
        title="Edit a standard"
        destroyOnClose
        visible={visable}
        okText="Submit"
        onOk={() => {
          console.log('updateOneStandard432,form', form.getFieldsValue());
          // console.log('updateOneStandard432', currentRecord);
          const formValues = form.getFieldsValue();
          const acceStandardId = currentRecord.acceStandardId
          const body = {
            name: formValues.name,
            acceStandardId: acceStandardId,
            active: formValues.status ? 1 : 0
          }
          updateOneStandard(body)
          setVisable(false)
        }}
        onCancel={() => setVisable(false)}
      >
        <Form
          {...layout}
          form={form}
          name="basic"
          initialValues={{
            remember: true,
          }}
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Switch
              size="small"
              defaultChecked={currentRecord.status == 1}
              onChange={(value) => {
                form1.setFieldsValue({
                  ...form1.getFieldsValue(),
                  status: value
                })
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

       {/* ------------------------------------- Standard Details ------------------------------------- */}
       <Modal
        title="Edit standard items"
        width="90%"
        destroyOnClose
        visible={detaiVisable}
        okText="Submit"
        onOk={() => {
          // console.log('updateOneStandard432,form', form.getFieldsValue());
          // // console.log('updateOneStandard432', currentRecord);
          // const formValues = form.getFieldsValue();
          // const acceStandardId = currentRecord.acceStandardId
          // const body = {
          //   name: formValues.name,
          //   acceStandardId: acceStandardId,
          //   active: formValues.status ? 1 : 0
          // }
          // updateOneStandard(body)
          // setVisable(false)
        }}
        onCancel={() => setDetaiVisable(false)}
      >
        <StandardItem
          currentRecord={currentRecord}
        />
      </Modal>

    </section>
  );
}

export default MyTable;
