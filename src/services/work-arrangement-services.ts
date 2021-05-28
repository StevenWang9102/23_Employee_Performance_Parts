import server from './api/api-services.js'
import {baseUrl} from './api/base-url'

export const getEmployeeRequest = () =>{
    return server({
        url: baseUrl + 'Employee/GetAllEmployee',
        method: "GET"
    })
}

export const getMachineRequest = () =>{
    return server({
        url:baseUrl + 'Machine/GetAllMachine',
        method: "GET"
    })
}

export const getDateRequest = (date:string) =>{
    return server({
        url: baseUrl + `WorkingArrangement/GetAllWorkingArrangement?workingDate=${date}`,
        method: "GET"
    })
}

export const postArrangementRequest = (data:any) =>{
    return server({
        url: baseUrl + 'WorkingArrangement/AddWorkingArrangement',
        method: "POST",
        data: data
    })
}

export const updateArrangementRequest = (data:any) =>{
    return server({
        url: baseUrl + 'WorkingArrangement/UpdateWorkingArrangement',
        method: "PUT",
        data: data
    })
}

export const deleteArrangementRequest = (data:number[]) =>{
    return server({
        url: baseUrl + 'WorkingArrangement/DeleteWorkingArrangement',
        method:"DELETE",
        data:data
    })
}

export const getWeekRequest = (startDate:string, endDate:string) =>{
    return server({
        url: baseUrl + `WorkingArrangement/GetAllWorkingArrangement?start=${startDate}&end=${endDate}`,
        method: "GET"
    })
}