import React, { useEffect, useState } from 'react'
import MyTable from './table'
import {
  CreateStandards,
  UpdateStandards,
  DeleteStandards,
  FetchAllStandards,
} from '../../../services/assessment-services'

export const AssessmentStandard = () => {

  const [standards, setStandards] = useState([])

  useEffect(() => {
    FetchAllStandardsLocal()
  }, [])

  const FetchAllStandardsLocal = ()=>{
    FetchAllStandards()
    .then((res) => {
      console.log("FetchAllStandards,res=", res.data.data);
      setStandards(res.data.data);
    })
    .catch((err) => { });
  }

  
  const createOneStandard = (body: any) => {
    CreateStandards(body)
    .then((res) => {
      FetchAllStandardsLocal()
    })
    .catch((err) => { });
  }

  const updateOneStandard = (body: any) => {
    UpdateStandards(body)
    .then((res) => {
      // console.log("FetchAllStandards,res=", res.data.data);
      FetchAllStandardsLocal()
    })
    .catch((err) => { });
  }

  const deleteOneStandard = (id: number) => {
    DeleteStandards(id)
    .then((res) => {
      FetchAllStandardsLocal()
    })
    .catch((err) => { });
  }

  console.log('standards2134', standards);
  
  return (
    <section style={{ padding: 0 }}>
      
      <MyTable
        standards={standards}
        createOneStandard={createOneStandard}
        updateOneStandard={updateOneStandard}
        deleteOneStandard={deleteOneStandard}
      />      
    </section>
  )
}

export default AssessmentStandard
