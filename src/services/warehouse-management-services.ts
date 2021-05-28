import server from './api/api-services'
import {baseUrl} from "./api/base-url";

export const getAllRawMaterialRequest = () =>{
    return server({
        url: baseUrl + 'RawMaterial/GetAllRawMaterial',
        method: "GET"
    })
}

export const getAllProductRequest = () =>{
    return server({
        url: baseUrl + 'Product/GetAllProduct',
        method: "GET"
    })
}

export const deleteObsoleteBox = (boxId:string) =>{
    return server({
        method: "DELETE",
        url: baseUrl + `Box/ObsoleteBox?id=${boxId}`
    })
}

export const updateStockQuantityRequest = (boxId:string, quantity:number) =>{
    return server({
        method: "PUT",
        url: baseUrl + `Box/UpdateStockBoxQuantity?boxId=${boxId}&quantity=${quantity}`
    })
}

export const getAllTemporaryZoneInManagementRequest = () =>{
    return server({
        method: "GET",
        url: baseUrl + 'TempZone/GetAllTempZone?active=1&zoneType=1'
    })
}

export const getAllStackingAreaInManagementRequest = () =>{
    return server({
        method: "GET",
        url: baseUrl + 'TempZone/GetAllTempZone?active=1&zoneType=2'
    })
}
