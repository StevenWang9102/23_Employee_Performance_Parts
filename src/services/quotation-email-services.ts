import server from "./api/api-services";
import {baseUrl} from "./api/base-url";

export const sendEmail = (data:any) =>{
    return server({
        method: "POST",
        url: baseUrl + 'Common/SendEmail',
        data: data,
        headers: { 'content-type': 'multipart/form-data' },
    })
}