import React, { useEffect, useState } from 'react'
import AssessTable from './component/assessment-table'
import {
  CreateAssessmentPlan,
  UpdateAssessmentPlan,
  DeleteAssessmentPlan,
  FetchAllAssessment,
  FetchAllStandardPlan,
} from '../../../services/assessment-services'
// import { sort } from 'fast-sort';

interface ICurrentPage {
  page: string,
  name: string,
  accessmentPlanId: string
}

export const AssessmentStandard = () => {

  const [assessmentPlans, setAssessmentPlans] = useState([])
  const [assessment, setAssessment] = useState([])
  const [currentPage, setCurrentPage] = useState<ICurrentPage>({
    page: "plan",
    name: '',
    accessmentPlanId: ''
  })

  useEffect(() => {
    FetchAllAssessementPlan()

    FetchAllAssessment()
      .then((res) => {
        console.log("FetchAllAssessment,res=", res.data.data);
        const data = res.data.data
        // const sorted = sort(data).desc(u => u.createdAt);
        setAssessment(data);
      })

  }, [])

  const FetchAllAssessementPlan = () => {
    FetchAllStandardPlan()
      .then((res) => {
        console.log("FetchAllStandards,res=", res.data.data);
        const data = res.data.data
        // const sorted = sort(data).desc(u => u.createdAt);
        setAssessmentPlans(data);
      })
      .catch((err) => { });
  }


  const createAssessmentPlan = (body: any) => {
    CreateAssessmentPlan(body)
      .then((res) => {
        FetchAllStandardPlan()
          .then((res) => {
            console.log("FetchAllStandards,res=", res.data.data);
            setAssessmentPlans(res.data.data);
          })
          .catch((err) => { });
      })
      .catch((err) => { });
  }

  const updateAssessmentPlan = (body: any) => {
    UpdateAssessmentPlan(body)
      .then((res) => {
        // console.log("FetchAllStandards,res=", res.data.data);
        FetchAllAssessementPlan()
      })
      .catch((err) => { });
  }

  const deleteAssessmentPlan = (id: number) => {
    DeleteAssessmentPlan(id)
      .then((res) => {
        FetchAllAssessementPlan()
      })
      .catch((err) => { });
  }

  console.log('standards2134', assessmentPlans);

  return (
    <section style={{ padding: 0 }}>

      <AssessTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        assessment={assessment}
        createAssessmentPlan={createAssessmentPlan}
        updateAssessmentPlan={updateAssessmentPlan}
        deleteAssessmentPlan={deleteAssessmentPlan}
      />

    </section>
  )
}

export default AssessmentStandard
