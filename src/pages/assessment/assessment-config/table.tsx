import { Table, Space, Button, Modal } from 'antd';
import { Select } from 'antd';
import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber  } from 'antd';
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined, FundOutlined } from '@ant-design/icons';
import {
  FetchAllStandardDetails,
  CreateStandardsDetails,
  UpdateStandards,
  DeleteStandards,
  FetchAllStandards,
} from '../../../services/assessment-services'
import { Card, Col, Row } from 'antd';

const MyTable = (props: any) => {

  const { Option } = Select;
  const {
    standardsList,
    departmentList,
  } = props

  const standardsListLocal = standardsList.filter((each: any)=>each.active == 1)
  console.log("MyTable689,standardsListLocal",standardsListLocal);
  
  return (
    <section style={{ maxWidth: 800, margin: "auto" }}>
      <div className="site-card-wrapper">
    <Row gutter={16}>

      {departmentList.map((each: any)=>{
        return (
          <Col span={8} style={{margin: "10px 0"}}>
            <Card title={`${each.deptName} Department`} bordered={true}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a standard"
              optionFilterProp="children"
              value={each.acceStandardId}
              // onChange={onChange}
              // onFocus={onFocus}
              // onBlur={onBlur}
              // onSearch={onSearch}
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            > 
            {
              standardsList.filter((each: any)=>each.active == 1).map((each: any)=>{
                <Option value={each.acceStandardId}>{each.name}</Option>
              })
            }
              {/* <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option> */}
            </Select>
            </Card>
          </Col>
        )
      })}
    </Row>
  </div>

    </section>
  );
}

export default MyTable;
