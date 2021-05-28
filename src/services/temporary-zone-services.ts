import server from './api/api-services'
import {baseUrl} from './api/base-url'

export const getAllTempZoneRequest = () => {
  return server({
    url: baseUrl + 'TempZone/GetAllTempZone',
    method: 'GET'
  })
}

export const getEmptyCellRequest = () => {
  return server({
    url: baseUrl + 'ShelfPlate/GetEmptyCell',
    method: 'GET',
    headers: {
      isLoading: false
    }
  })
}

export const movePlateToAnotherCellRequest = (data:any) => {
  return server({
    url: baseUrl + 'ShelfPlate/MovePlateToAnotherCell',
    method: 'PUT',
    data: data
  })
}

export const movePlateToShelfRequest = (plateId:number, cellId:number) => {
  return server({
    url: baseUrl + `TempZone/MovePlateToShelf?plateId=${plateId}&cellId=${cellId}`,
    method: 'PUT',
    // data:data
  })
}

export const clearEmptyPlateFromTempZone = () => {
  return server({
    url: baseUrl + 'TempZone/ClearEmptyPlateFromTempZone',
    method: 'DELETE',
  })
}
