import server from "./api/api-services";
import {baseUrl} from "./api/base-url";

export const getPlateByPlateCodeRequest = (plateCode:any) =>{
    return server({
        url: baseUrl + `Plate/GetPlateByPlateCode?code=${plateCode}`,
        method: "GET"
    })
}

export const getPlateByBoxIdRequest = (boxId:any) =>{
    return server({
        url: baseUrl + `Plate/GetPlateByBoxId?boxId=${boxId}`,
        method: "GET"
    })
}

export const getBoxByPlateIdRequest = (plateId:number) =>{
    return server({
        url: baseUrl + `Plate/GetBoxByPlateId?plateId=${plateId}`,
        method: "GET"
    })
}

export const getBoxByBarCodeRequest = (barCode:number) =>{
    return server({
        url: baseUrl + `Box/GetBoxByBarCode?barCode=${barCode}`,
        method: "GET"
    })
}

export const addTempZoneRequest = (plateId:number,data:any) =>{
    return server({
        url: baseUrl + `TempZone/AddTempZone?plateId=${plateId}`,
        method: 'POST',
        data:data
    })
}