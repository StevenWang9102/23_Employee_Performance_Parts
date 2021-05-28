import React, { useEffect, useState } from 'react'
import MyTable from './table'
import {
  FetchAllStandardDetails,
  CreateStandardsDetails,
  UpdateStandards,
  DeleteStandardDetail,
  FetchAllStandards,
} from '../../../../services/assessment-services'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'

export const AssessmentStandard = (props: any) => {

  const {currentRecord} = props
  const [standardItemsList, setStandardDetails] = useState([])
  const [standardList, setStandardsList] = useState([])
  const [currentStandardId, setCurrentStandardId] = useState(null)

  useEffect(() => {
    FetchStandardDetailLocal();

    FetchAllStandards()
    .then((res) => {
      console.log("FetchAllStandardDetails,res=", res.data.data);
      setStandardsList(res.data.data);
    })
    .catch((err) => { });
  }, [])

  const FetchStandardDetailLocal = ()=>{
    FetchAllStandardDetails()
    .then((res) => {
      console.log("FetchAllStandardDetails,res=", res.data.data);
      console.log("FetchAllStandardDetails,currentRecord=", currentRecord);
      const temp = res.data.data.filter((each: any)=> each.acceStandardId === currentRecord.acceStandardId )
      setStandardDetails(temp);
    })
    .catch((err) => { });
  }

  // const createOneStandardItem = (body) => {
  //   CreateStandardsDetails(body)
  //   .then((res) => {
  //     FetchStandardDetailLocal()
  //     const temp = currentStandardId
  //     // alert(currentStandardId)
  //     setCurrentStandardId(temp)
  //   })
  //   .catch((err) => { });
  // }

  const updateOneStandard = (body: any) => {
    UpdateStandards(body)
    .then((res) => {
      FetchStandardDetailLocal()
    })
    .catch((err) => { });
  }

  const deleteOneStandardDetail = (id: any) => {
    DeleteStandardDetail(id)
    .then((res) => {
      FetchStandardDetailLocal()
      SweetAlertService.successMessage('Delete successfully')
    })
    .catch((err) => { });
  }

  console.log('standards2134', standardItemsList);
  
  return (
    <section style={{ padding: 0 }}>

      <MyTable
        standardList={standardList}
        currentStandardId={currentStandardId}
        setCurrentStandardId={setCurrentStandardId}
        standardItemsList={standardItemsList}
        FetchStandardDetailLocal={FetchStandardDetailLocal}
        updateOneStandard={updateOneStandard}
        deleteOneStandardDetail={deleteOneStandardDetail}
      />      
    </section>
  )
}

export default AssessmentStandard
