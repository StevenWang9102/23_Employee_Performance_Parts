import React, { useEffect, useState } from 'react'
import MyTable from './table'
import { Button, Space, Modal } from 'antd';
import {
  FetchAllStandards,
  UpdateDepartMent,
  UpdateStandards,
  DeleteStandardDetail,
  FetchAllDepartment,
} from '../../../services/assessment-services'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { Card, Col, Row, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

export const AssessmentStandard = () => {

  const [standardsList, setAllStandards] = useState<any>([])
  const [departmentList, setDepartmentList] = useState([])
  const [currentStandardId, setCurrentStandardId] = useState(null)

  useEffect(() => {
    // FetchStandardDetailLocal();

    FetchAllDepartment()
      .then((res) => {
        console.log("FetchAllDepartment,res=", res.data.data);
        setDepartmentList(res.data.data);
      })
      .catch((err) => { });

    FetchAllStandards()
      .then((res) => {
        console.log("FetchAllStandardDetails,res=", res.data.data);
        setAllStandards(res.data.data);
      })
      .catch((err) => { });

  }, [])

  const FetchStandardDetailLocal = () => {

  }


  // const updateOneStandard = (body) => {
  //   UpdateStandards(body)
  //     .then((res) => {
  //       FetchStandardDetailLocal()
  //     })
  //     .catch((err) => { });
  // }

  // const deleteOneStandardDetail = (id) => {
  //   DeleteStandardDetail(id)
  //     .then((res) => {
  //       FetchStandardDetailLocal()
  //       SweetAlertService.successMessage('Delete successfully')
  //     })
  //     .catch((err) => { });
  // }

  console.log('standards2134', standardsList);

  function onSelectChange(index: number, value: any, option: any) {
    confirm({
      title: 'Do you want to apply this standard?',
      icon: <ExclamationCircleOutlined/>,
      // content: 'Some descriptions',
      onOk() {
        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        const deptInfo: any = departmentList[index]
        console.log('onSelectChange,info', value);
        console.log('onSelectChange,option', option);
        console.log('onSelectChange,deptInfo', deptInfo);
        
        const body: any = {
          "deptId": deptInfo.deptId,
          "deptName": deptInfo.deptName,
          "acceStandardId": option.value
        }

        updateDepartment(body)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const updateDepartment = (body: any) =>{
    UpdateDepartMent(body)
    .then((res) => {
      // Refresh page
      FetchAllDepartment()
      .then((res) => {
        console.log("FetchAllDepartment,res=", res.data.data);
        setDepartmentList(res.data.data);
        SweetAlertService.successMessage('Update successfully')
      })
      .catch((err) => { });
    })
    .catch((err) => { });
  }

  console.log('departmentList76',departmentList);
  
  return (
    <section style={{ padding: 0 }}>
      <h3>Assessment Configuration</h3>

      <section style={{ maxWidth: 800, margin: "auto" }}>
        <div className="site-card-wrapper">
          <Row gutter={16}>

            {departmentList.map((each: any, index: number) => {
              return (
                <Col span={8} style={{ margin: "10px 0" }}>
                  <Card title={`${each.deptName} Department`} bordered={true}>
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      value={each.acceStandardId}
                      placeholder="Select a standard"
                      optionFilterProp="children"
                      onChange={(value, option)=>{
                        console.log('onSelectChange,value', value);
                        console.log('onSelectChange,option', option);
                        onSelectChange(index,each,option)
                    
                      }}
                      // onFocus={onFocus}
                      // onBlur={onBlur}
                      // onSearch={onSearch}
                      filterOption={(input, option) =>
                        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {
                        standardsList.filter((each: any) => each.active == 1).map((each: any) => {
                          console.log('each786',each);
                          return <Option value={each.acceStandardId}>{each.name}</Option>
                        })
                      }

                    </Select>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>

        <Space>

      </Space>
      
      </section>
      {/* <MyTable
        departmentList={departmentList}
        // currentStandardId={currentStandardId}
        // setCurrentStandardId={setCurrentStandardId}
        standardsList={standardsList}
        // FetchStandardDetailLocal={FetchStandardDetailLocal}
        // updateOneStandard={updateOneStandard}
        // deleteOneStandardDetail={deleteOneStandardDetail}
      />       */}
    </section>
  )
}

export default AssessmentStandard
