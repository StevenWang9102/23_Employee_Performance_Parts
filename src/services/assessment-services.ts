import server from './api/api-services.js'
import {LoginModel} from '../pages/static/login/login-model'
import { baseUrl } from './api/base-url'



export const FetchAllStandardDetails = () => {
  return server({
    url: baseUrl + 'Assessment/GetAllAssessmentStandardDetails',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchAllStandardPlan= () => {
  return server({
    url: baseUrl + 'Assessment/GetAllAssessmentPlan',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchAllStandards = () => {
  return server({
    url: baseUrl + 'Assessment/GetAllAssessmentStandard',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const FetchAllDepartment = () => {
  return server({
    url: baseUrl + 'Dept/GetAllDepartmentWithStandard',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

// /api/Assessment/GetOneAssessment
export const FetchAllAssessment = () => {
  return server({
    url: baseUrl + 'Assessment/GetOneAssessment',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const CreateStandards = (body: any) => {
  return server({
    url: baseUrl + 'Assessment/AddAssessmentStandard',
    method: 'POST',
    data: body,
    headers: {
      isLoading: false
    }
  })
}

export const CreateAssessmentPlan = (body: any) => {
  return server({
    url: baseUrl + 'Assessment/AddAssessmentPlan',
    method: 'POST',
    data: body,
    headers: {
      isLoading: false
    }
  })
}

// /api/Assessment/AddAssessmentStandardDetails
export const CreateStandardsDetails = (body: any) => {
  return server({
    url: baseUrl + 'Assessment/AddAssessmentStandardDetails',
    method: 'POST',
    data: body,
    headers: {
      isLoading: false
    }
  })
}

export const UpdateStandards = (body: any) => {
  return server({
    url: baseUrl + 'Assessment/UpdateAssessmentStandard',
    method: 'PUT',
    data: body,
    headers: {
      isLoading: false
    }
  })
}

export const UpdateDepartMent = (body: any) => {
  // /api/Dept/UpdateDepartment
  return server({
    url: baseUrl + 'Dept/UpdateDepartment',
    method: 'PUT',
    data: body,
    headers: {
      isLoading: false
    }
  })
}

// /api/Assessment/UpdateAssessmentPlan
export const UpdateAssessmentPlan = (body: any) => {
  return server({
    url: baseUrl + 'Assessment/UpdateAssessmentPlan',
    method: 'PUT',
    data: body,
    headers: {
      isLoading: true
    }
  })
}

export const DeleteAssessmentPlan = (id: number) => {
  return server({
    url: baseUrl + `Assessment/DeleteAssessmentPlan?id=${id}`,
    method: 'DELETE',
    headers: {
      isLoading: true
    }
  })
}

export const DeleteStandards = (id: number) => {
  return server({
    url: baseUrl + `Assessment/DeleteAssessmentStandard?id=${id}`,
    method: 'DELETE',
    headers: {
      isLoading: false
    }
  })
}

// /api/Assessment/DeleteAssessmentStandardDetails
export const DeleteStandardDetail = (id: number) => {
  return server({
    url: baseUrl + `Assessment/DeleteAssessmentStandardDetails?id=${id}`,
    method: 'DELETE',
    headers: {
      isLoading: false
    }
  })
}

