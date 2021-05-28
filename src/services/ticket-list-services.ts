import server from './api/api-services';
import {baseUrl} from "./api/base-url";


export const getAllTicket = () =>{
    return server({
        url: baseUrl + 'Ticket/GetAllTicket',
        method: "GET"
    })
}