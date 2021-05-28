import React from 'react'
import CommonForm from '../../../../components/common/common-form/common-form'
import { Button, Descriptions, Divider, Radio } from 'antd'
import { ApiRequest } from '../../../../services/api/api'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'

const QuotationCustomerSidePage = () => {
  const [formRef, setFormRef] = useState<any>()
  const [quotationData, setQuotationData] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<any>()
  const [formItems, setFormItems] = useState<any>([])
  const [disableSubmit, setDisableSubmit] = useState<any>(false)
  const formRefCurrent: any = React.useRef()

  useEffect(() => {
    const [qNo, qId] = window.location.href.slice(window.location.href.indexOf('=') + 1).split('_')
    ApiRequest({
      url: 'Quotation/GetQuotationByIdAndNo?id=' + qId + '&quotationNo=' + qNo,
      method: 'get'
    }).then((res: any) => {
      console.log(res)
	    if (!res.data.success) {
        SweetAlertService.errorMessage(res.data.errorMessage.message)
		    setDisableSubmit(true)
	    }
	    if (res.data.data.custConfirmed) {
		    SweetAlertService.errorMessage('Already confirmed.')
		    setDisableSubmit(true)
	    }
	    setQuotationData(res.data.data)
	    checkIsOnlyProduct(res.data.data)
    }).catch(_ => {
	    SweetAlertService.errorMessage('Invalid Page.')
    })
  }, [])

  useEffect(() => {
    formRefCurrent.current = formRef
  }, [formRef])

  useEffect(() => {
	  console.log(quotationData)
	  const quotationItemData = setFormItem()
	  const initValue: any = {}
	  for (const quotationItemDataElement of quotationItemData) {
		  initValue[quotationItemDataElement[0]] = quotationItemDataElement[1][0].quotationItemId
	  }
	  setInitFormValues(initValue)
  }, [quotationData])

  const handleQuotationItemData = (quotationItemData: any, row: any, type: any) => {
    if (quotationItemData.filter((item: any) => item[0] === row[type])[0]) {
      quotationItemData = quotationItemData.map((item: any) => {
        if (item[0] === row[type]) {
          item[1].push(concatQuotationItemNameRow(row))
        }
        return item
      })
    } else {
      if (row[type]) {
        quotationItemData.push([row[type], [concatQuotationItemNameRow(row)]])
      }
    }
    return quotationItemData
  }

  const concatQuotationItemNameRow = (row: any) => ({...row, name: 'Qty: ' + row.notes + ' -- ' + 'Price: $' + row.price})

  const checkIsOnlyProduct = (data: any) => {
    if (data?.quotationItem?.filter((row: any) => row.productId).length) {
      setDisableSubmit(true)
      return 1
    }
    return 0
  }

  const setFormItem = () => {
    let quotationItemData: any = []
    if (quotationData?.quotationItem) {
      for (const row of quotationData.quotationItem) {
	      quotationItemData = handleQuotationItemData(quotationItemData, row, 'baseProductId')
      }
    }
    console.log(quotationItemData)
    const formItem: any = []
    quotationItemData.forEach((row: any) => {
	    console.log(row)
      formItem.push({
        name: row[0],
        isWholeRowWidth: true,
        rules: [{required: true}],
        // span: 12,
        label: 'Price Select - ' + row[1][0].baseProduct.baseProductName,
        inputElement: (
	        <Radio.Group>
		        {row[1].map((item: any, i: any) => <Radio value={item.quotationItemId} key={i.toString()}>{item.name}</Radio>)}
	        </Radio.Group>
        )
      })
      formItem.push({
        isWholeRowWidth: true,
        inputElement: <Divider />
      })
    })
    setFormItems(formItem)
    return quotationItemData
  }

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
	  console.log(changedValues)
	  console.log(newValues)
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: any = await formRef.validateFields()
    if (formValues) {
	    console.log(formValues)
	    const selectedQuotations = Object.keys(formValues).map((key: any) => formValues[key])
	    console.log(selectedQuotations)
	    const requestValues = {
		    ...quotationData,
		    custConfimedAt: (new Date()).toISOString(),
		    custConfirmed: 1,
		    draft: 0,
		    quotationItem: quotationData.quotationItem.filter((row: any) => selectedQuotations.includes(row.quotationItemId))
	    }
	    console.log(requestValues)
	    const result = await ApiRequest({
		    url: 'Quotation/UpdateQuotation',
		    method: 'put',
		    data: requestValues
	    })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        setDisableSubmit(true)
      }
    }
  }

  const description = () => {
    const data = quotationData
    if (!data) {
      return null
	  }
    return (
      <div style={{background: 'white', opacity: 0.78}}>
		    <Descriptions bordered labelStyle={{color: 'black'}} contentStyle={{color: 'black'}}>
			    <Descriptions.Item label="Customer">{data.customer.company}</Descriptions.Item>
			    <Descriptions.Item label="Sales">{data.employee.firstName + ' ' + data.employee.firstName}</Descriptions.Item>
			    <Descriptions.Item label="Quote Date">{data.effDate}</Descriptions.Item>
			    <Descriptions.Item label="Valid Date">{data.expDate}</Descriptions.Item>
			    <Descriptions.Item label="Quotation No">{data.quotationNo}</Descriptions.Item>
			    <Descriptions.Item label="Comments">{data.notes}</Descriptions.Item>
			    <Descriptions.Item label="Options">
				    {data.quotationOption && data.quotationOption[0]?.customizeOptionNotes.split('\n').map((str: string, i: any) => <div key={i.toString()}>{str}</div>)}
			    </Descriptions.Item>
		    </Descriptions>
	    </div>
	  )
  }

  return (
    <div className={'cusQuoImage'} style={{height: '100vh'}}>
	    <div style={{padding: '3rem', height: '100%', overflowY: 'auto'}}>
		    <h1 style={{textAlign: 'center', margin: '0 auto', paddingBottom: '3rem', color: '#005132', fontWeight: 600, fontFamily: 'fantasy', fontSize: '3rem'}}>Jadcup Quotation</h1>
		    {description()}
		    <Divider />
		    <CommonForm
			    items={formItems}
			    onFormChange={onFormChange}
			    onFormBlur={onFormBlur}
			    initFormValues={initFormValues}
		    />
		    {(quotationData && !disableSubmit) && (
			    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
				    <Button
					    disabled={!formRef}
					    onClick={onConfirm}
					    type="primary"
				    >Submit</Button>
			    </div>
		    )}
	    </div>
    </div>
  )
}

export default QuotationCustomerSidePage
