import server from "./api/api-services";
import {baseUrl} from "./api/base-url";
import { getCurrentDateString } from './helpers'

export const getAllWorkingArrangementRequest = () =>{
    return server({
        method: "GET",
        // url: baseUrl + 'WorkingArrangement/GetAllWorkingArrangement?workingDate=' + getCurrentDateString()
        url: baseUrl + 'WorkingArrangement/GetAllWorkingArrangement?workingDate=2021-05-11'

    })
}

export const getSuborderByMachineId = (machineId:number) => {
    return server({
        method: "GET",
        url: baseUrl + `Suborder/GetSuborderByMachineId?id=${machineId}&completeDate=${getCurrentDateString()}`
    })
}
