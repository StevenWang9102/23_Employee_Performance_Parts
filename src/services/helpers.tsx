import CommonRenderComponent from '../components/common/common-column-components/common-render-component'
import CommonEditComponent, { FormItemPropsInterface } from '../components/common/common-column-components/common-edit-component'
import React from 'react'
import moment from 'moment'

// --------------------------------compareTwoObjs-------------------------------------
export const compareTwoObjs = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// --------------------------------columnFunction-------------------------------------
interface ColumnFunctionPropsInterface {
  keywords: any
  isForRender?: boolean
  itemsObj?: any
  props?: any
  restFormItems?: any
}

const columnFunction = (columnFunctionProps: ColumnFunctionPropsInterface) => {
  const formItems: FormItemPropsInterface = columnFunctionProps.keywords.map((keyword: any) => columnFunctionProps.itemsObj[keyword])
  return columnFunctionProps.isForRender ?
    <CommonRenderComponent formItems={formItems} restFormItems={columnFunctionProps.restFormItems} /> :
    <CommonEditComponent propsFunction={columnFunctionProps.props} formItems={formItems} restFormItems={columnFunctionProps.restFormItems} />
}

export const renderFn = (itemsObj: any, keywords: any, restFormItems?: any) => {
  const columnFnProps: any = {isForRender: true, itemsObj: itemsObj, keywords: keywords, restFormItems: restFormItems}
  return columnFunction(columnFnProps)
}

export const editFn = (props: any, itemsObj: any, keywords: any, restFormItems?: any) => {
  const columnFnProps: any = {keywords: keywords, props: props, itemsObj: itemsObj, restFormItems: restFormItems}
  return columnFunction(columnFnProps)
}

export const filterFn = (inputValue: any, itemsObj: any, keywords: any,) => {
  let result = false
  keywords.map((keyword: any) => {
    if (itemsObj[keyword].value?.toString().toLowerCase().includes(inputValue?.toLowerCase())) {
      result = true
    }
  })
  return result
}

export const validateFn = (rowData: any, itemsObj: any, keywords: any) => {
  let result = true
  keywords.map((keyword: any) => {
    if (itemsObj[keyword].required) {
      if (result) {
        if (itemsObj[keyword].type === 'inputNumber') {
          result = rowData[keyword] >= 0
        } else {
          result = !!rowData[keyword]
        }
      }
    }
  })
  return result
}

const getItemObjFunction = (rowData: any, label: string, keyword: any, otherOptions?: any) => {
  let obj: any = {
    label: label,
    keyword: keyword,
    value: rowData[keyword],
  }
  if (otherOptions) {
    obj = {...obj, ...otherOptions}
  }
  if (otherOptions?.type === 'select') {
    obj = {...obj, value: rowData[keyword]?.[keyword + 'Name']}
  }
  // Also adapt to the requirement of overriding value key for selection options
  if (otherOptions?.valueJoinArray) {
    obj = {...obj, value: getJoinValueFromArray(rowData[keyword], otherOptions.valueJoinArray, rowData)}
  }
  return obj
}

export const getJoinValueFromArray = (data: any, array: any, rowData?: any) => {
  let value = ''
  array.map((item: any) => value += ((data?.[item] || rowData?.[item]) + ' - '))
  value = value.trim().replace(/-$/, '')
  if (!value.replace(/-/g, '').replace(/undefined/g, '').trim().length) {
    value = ''
  }
  return value
}

export const getItemsObj = (keyInfosArray: any, rowData: any) => {
  const obj: any = {}
  keyInfosArray.map((row: any) => {
    obj[row.key] = getItemObjFunction(rowData, row.label, row.key, row.otherOptions)
  })
  return obj
}

export const getColModelItem = (colInfo: any, keyInfosArray: any) => {
  return {
    title: colInfo.title,
    field: colInfo.field,
    sorting: false,
    validate: (rowData: any) => validateFn(rowData, getItemsObj(keyInfosArray(), rowData), colInfo.keywords),
    customFilterAndSearch: (inputValue: any, rowData: any) => filterFn(inputValue, getItemsObj(keyInfosArray(), rowData), colInfo.keywords),
    render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), colInfo.keywords),
    editComponent: (props: any) => editFn(props, getItemsObj(keyInfosArray(), props.rowData), colInfo.keywords),
  }
}

// --------------------------------getRandomKey-------------------------------------
export const getRandomKey = (): string => Math.random().toString(36).substring(7)

// --------------------------------getDiffDaysByMomentJs-------------------------------------
export const getDiffDays = (comparedDate: any) => {
  const today = moment()
  return today.diff(moment(comparedDate + '.000Z'), 'days')
}

// --------------------------------getCurrentDateString(YYYY-MM-DD)-------------------------------------
export const getCurrentDateString = () => {
  const currentDate = new Date()
  return [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()].join('-')
}

// --------------------------------Chunk Array into groups-------------------------------------
export const chunkArr = (inputArray: any, perChunk: any) => {
  return inputArray.reduce((resultArray: any, item: any, index: any) => {
    const chunkIndex = Math.floor(index / perChunk)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])
}

// --------------------------------UTC To Local Date(Time) String-------------------------------------
export const toLocalDate = (utc: any) => {
  return utc && (new Date(utc + '.000Z')).toDateString()
}

export const toLocalDateTime = (utc: any) => utc && (new Date(utc + '.000Z')).toLocaleString()

// --------------------------------Add &nbsp; to Api string data (For table rowData presentation)-------------------------------------
export const nbsStr = (str: string) => {
  if (!str) {
    return ''
  }
  return str.toString().replace(/\s/g, '\u00a0').replace(/-/g, '\u2011').trim()
}

// --------------------------------Replace space in string (For table filtering and searching)-------------------------------------
export const nsStr = (str: string) => {
  if (!str) {
    return ''
  }
  return str.toString().replace(/\s/g, '').trim()
}
