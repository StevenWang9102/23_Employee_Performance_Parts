import { Table, Space, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd';
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import moment from 'moment'

const MyTable = (props: any) => {
  const {
    currentPage,
    setCurrentPage,
    createAssessmentPlan,
    updateAssessmentPlan,
    deleteAssessmentPlan,
    assessment
  } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [source, setSource] = useState([])
  const [visable, setVisable] = useState(false)
  const [visable1, setVisable1] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>({})
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  console.log('MyTable22,assessment', assessment);
  console.log('MyTable22,currentPage', currentPage);

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
      title: 'Employess',
      dataIndex: 'name',
    },
    {
      title: 'acceStandardId',
      dataIndex: 'acceStandardId',
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: any, record: any) => {
        console.log('render,text',text);
        console.log('render,record',record);
        
        if (text == 1) return <span style={{color: 'green', fontWeight: 700}}>Active</span>
        if (text == 0) return <span style={{color: 'lightgray', fontWeight: 700}}>Inactive</span>
      }
    },
    {
      title: 'Note',
      dataIndex: 'item',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) =>{ 
        console.log("record476", record);
        return (
        <Space size="middle">

          {/* <Button
            // type='primary'
            onClick={() => {
              // setVisable(true)
              // setCurrentRecord(record)
              // form.setFieldsValue({
              //   ...form.getFieldsValue(),
              //   name: record.name
              // })
            }} > Asseseement Now!
          </Button> */}

          <Button
            type='primary'
            onClick={() => {
              setVisable(true)
              setCurrentRecord(record)
              form.setFieldsValue({
                ...form.getFieldsValue(),
                name: record.name
              })
            }} >Edit</Button>

          <Popconfirm 
            title="Are you sure？" 
            onConfirm={()=>{
              console.log("delete,Record453", record);
              const id = record.accessmentPlanId
              deleteAssessmentPlan(id)
            }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
            <Button danger> Delete  </Button>
          </Popconfirm>
        </Space>
      )}
    },
  ];


  useEffect(() => {

    console.log('MyTable,assessment', assessment);

    if (assessment.length > 0) {
      var data: any = [];

      for (let i = 0; i < assessment.length; i++) {
        const each = assessment[i]
        data.push({
          key: i,
          ...each,
          name: `${each.employee.firstName} ${each.employee.lastName}`
          // createdAt: moment(each.createdAt).format("DD/MM/YYYY"),
          // createdAtOrigin: each.createdAt,
          // accessmentPlanId: each.accessmentPlanId,
          // name: each.notes,
          // status: each.active,
        });
      }
      console.log('MyTable,data', data);
      data = data.filter((e: any)=> e.accessmentPlanId == currentPage.accessmentPlanId)
      setSource(data)
    }

  }, [assessment])


  const onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };


  console.log('render4358:assessment', assessment);


  return (
    <section
     style={{ maxWidth: 800, margin: "auto" }}
    >
      <h5>Assessment</h5>
      {/* <h5>{currentPage.name}</h5> */}
      <Button
        style={{margin: "10px 0", marginRight: '10px'}}
        onClick={() => {
          setCurrentPage({
            page: 'plan',
            name: '',
            accessmentPlanId: '',
          })
          
        }}
      > Back to plan </Button>
      <Button
        type='primary'
        style={{margin: "10px 0", float: "right"}}
        onClick={() => {
          setVisable1(true)
          form1.setFieldsValue({
            name: null,
            status: true
          })
        }}
      > Create new assessment </Button>

      <Table
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={source}
      />

{/* ------------------------------------- Create ------------------------------------- */}
      <Modal 
        title="Create a plan"
        destroyOnClose
        visible={visable1}
        okText="Create"
        onOk={() => {
          console.log('CreateStandard432,form', form1.getFieldsValue());
          const formValues = form1.getFieldsValue();

          const body = {
            "accessmentPlanId": "",
            "createdAt": "2021-05-26T02:31:28.797Z",
            "active": formValues.status ? 1: 0,
            "notes": formValues.name,
          }

          createAssessmentPlan(body)
          setVisable1(false)
        }}
        onCancel={() => setVisable1(false)}
      >
        <Form
          {...layout}
          form={form1}
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
      </Modal>

{/* ------------------------------------- Edit ------------------------------------- */}
      <Modal 
        title="Edit a plan"
        destroyOnClose
        visible={visable}
        okText="Submit"
        onOk={() => {
          // console.log('updateOneStandard432', currentRecord);
          const formValues = form.getFieldsValue();
          // const acceStandardId = currentRecord.acceStandardId
          console.log('updateOneStandard432,formValues', formValues);
          console.log('updateOneStandard432,currentRecord', currentRecord);
          
          const body = {
            "accessmentPlanId": currentRecord.accessmentPlanId,
            "createdAt": currentRecord.createdAtOrigin,
            "active": formValues.status ? 1: 0,
            "notes": formValues.name,
          }

          // {
          //   "accessmentPlanId": "string",
          //   "createdAt": "2021-05-27T06:14:24.430Z",
          //   "active": 0,
          //   "notes": "string"
          // }
          
          updateAssessmentPlan(body)
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
              onChange={(value)=>{
                form1.setFieldsValue({
                  ...form1.getFieldsValue(),
                  status: value
                })
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

    </section>
  );
}

export default MyTable;
