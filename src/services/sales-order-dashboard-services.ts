import server from "./api/api-services";
import {baseUrl} from "./api/base-url";


export const getAllOrderRequest = () =>{
    return server({
        method: "GET",
        url: baseUrl + 'SalesOrder/GetAllOrder'
    })
}