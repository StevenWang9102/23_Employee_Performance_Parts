import server from "./api/api-services";
import {baseUrl} from "./api/base-url";
import {getCurrentDateString} from "./helpers";

export const getSuborderByDateRequest = (isLoading: boolean) =>{
    return server({
        url: baseUrl + 'Suborder/GetSuborderByDate?completeDate=' +  getCurrentDateString(),
        method: "GET",
        headers:{
            isLoading:isLoading
        }
    })
}
