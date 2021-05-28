import { Table, Space, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber  } from 'antd';
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import { Menu, Dropdown } from 'antd';
import EditableTable from './editableTable.js'
import {
  FetchAllStandardDetails,
  CreateStandardsDetails,
  UpdateStandards,
  DeleteStandards,
  FetchAllStandards,
} from '../../../../services/assessment-services'

const MyTable = (props: any) => {
const {
  standardList,
  updateOneStandard,
  deleteOneStandardDetail,
  standardItemsList,
  currentStandardId,
  setCurrentStandardId,
  FetchStandardDetailLocal
} = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [source, setSource] = useState([])
  const [visable, setVisable] = useState(false)
  const [visable1, setVisable1] = useState(false)
  const [menuVisiable, setMenuVisable] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>({})
  const [currentStandardName, setCurrentStandardName] = useState("All standards")
  // const [currentStandardId, setCurrentStandardId] = useState(null)
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  console.log('MyTable,standardItemsList', standardItemsList);
  console.log('MyTable,standardList', standardList);

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
      editable: true,
      width: "40%"
    },

    {
      title: 'Weight',
      dataIndex: 'weight',
      editable: true,
      width: "20%"
    },
    {
      title: 'Max Score',
      dataIndex: 'max',
      editable: true,
      width: "20%"
    },

    {
      title: 'Action',
      key: 'action',
      width: "20%",
      render: (text: any, record: any) => (

        <Space size="middle">
          {/* <Button
            type='primary'
            onClick={() => {
              setVisable(true)
              setCurrentRecord(record)
              form.setFieldsValue({
                ...form.getFieldsValue(),
                name: record.name
              })
            }} >Edit</Button> */}

          <Popconfirm
            title="Are you sure？"
            onConfirm={() => {
              // alert('onConfirm')
              console.log("delete,Record", record);
              const id = record.acceStandDetailId
              deleteOneStandardDetail(id)
            }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger> Delete  </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const sourceMaker = ()=>{
    var data = [];

    for (let i = 0; i < standardItemsList.length; i++) {
      const each = standardItemsList[i]
      data.push({
        key: i,
        max: each.max,
        acceStandDetailId: each.acceStandDetailId,
        acceStandardId: each.acceStandardId,
        name: each.item,
        weight: each.weight,
      });
    }

    return data
  }

  useEffect(() => {
    // Initial source
    console.log('MyTable,standards2', standardItemsList);

    if (standardItemsList.length > 0 && standardList.length > 0) {
      const temp: any = sourceMaker()
      setSource(temp)
    }

  }, [standardItemsList, standardList])

  // useEffect(() => {
  //   // Fliter source
  //   if(currentStandardId){
  //     var data = sourceMaker()
  //     const temp: any = data.filter(e=>e.acceStandardId == currentStandardId)
  //     setSource(temp)
  //   }
  // }, [currentStandardId])

  // visable1
  useEffect(() => {
    form1.resetFields()
  }, [visable1])

  const onMenuClick = (value: any)=>{
    const standardKey = value.key
    const standardName = standardList.filter((each: any)=>each.acceStandardId==standardKey)[0].name
    setCurrentStandardId(standardKey)
    setCurrentStandardName(standardName)
    setMenuVisable(false)
  }

  const createOneStandardItem = (body: any) => {
    CreateStandardsDetails(body)
    .then((res) => {
      FetchStandardDetailLocal()
      const temp = currentStandardId
      // alert(currentStandardId)
      setCurrentStandardId(temp)
    })
    .catch((err) => { });
  }

  const menu = () => {
    return <>
      <Menu
        onClick={(value)=>{
          console.log('menu453,value',value);
          console.log('menu453,standardList',standardList);
          console.log('menu453,find',standardList);
          onMenuClick(value)
        }}
      >
        {standardList.map((each: any) =>
          <Menu.Item 
            key={each.acceStandardId} 
            // name={each.name}
            // icon={<FundOutlined />}
          >
            {each.name}
          </Menu.Item>)}

      </Menu>
    </>
  }

  return (
    <section
      style={{ maxWidth: 800, margin: "auto" }}
    >
      {/* <Dropdown 
        trigger={['click']} 
        overlay={menu} 
        visible={menuVisiable}>
        
        <Button
          type="default"
          style={{margin: "30px 0px", zIndex: 10, color: '#3BA4FC', fontWeight: 600}} 
          onClick={()=>{ setMenuVisable(true) }}>
          {currentStandardName} 
          <DownOutlined />
        </Button>
      </Dropdown> */}

      <Button
        type='primary'
        style={{ margin: "10px 0", float: 'right' }}
        onClick={() => {
          setVisable1(true)
          form1.setFieldsValue({
            name: null,
            status: true
          })
        }}
      > Create new item </Button>

      <EditableTable
        columns={columns}
        dataSource={source}
      />

      {/* <Table
        columns={columns}
        dataSource={source}
      /> */}

      {/* ------------------------------------- Create ------------------------------------- */}
      <Modal
        title="Create new item"
        destroyOnClose
        visible={visable1}
        okText="Create"
        onOk={() => {
          console.log('CreateStandard432,form', form1.getFieldsValue());
          const formValues = form1.getFieldsValue();
          
          const body = {
            "acceStandDetailId": "",
            "item": formValues.name,
            "max": formValues.max,
            "acceStandardId": currentStandardId,
            "weight": formValues.weight
          }

          createOneStandardItem(body)
          setVisable1(false)
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
            {/* ReactDOM.render(<InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />, mountNode); */}
            <Input/>
          </Form.Item>

          <Form.Item
            label="Weigh"
            name="weight"
            rules={[
              {
                required: true,
                message: 'Please input a weight !',
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Maximum Score"
            name="max"
            rules={[
              {
                required: true,
                message: 'Please input maximum score !',
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ------------------------------------- Edit ------------------------------------- */}
      <Modal
        title="Standard Items"
        destroyOnClose
        visible={visable}
        okText="Submit"
        onOk={() => {
          console.log('updateOneStandard432,form', form.getFieldsValue());
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

      
    </section>
  );
}

export default MyTable;
