import server from './api/api-services.js'
import {LoginModel} from '../pages/static/login/login-model'
import {baseUrl} from './api/base-url'

export const LoginRequest = (model : LoginModel) => {
  return server({
    url: baseUrl + 'Employee/EmployeeLogin',
    method: 'POST',
    data: model,
    headers: {
      isLoading: false
    }
  })
}

