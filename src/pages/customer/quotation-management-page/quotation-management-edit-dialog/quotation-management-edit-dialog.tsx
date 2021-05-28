import React from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { Button, DatePicker, Input, InputNumber, Switch, Checkbox } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../services/api/api'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'
import CommonFormCustomItem from '../../../../components/common/common-form/common-form-custom-item'

interface IQuotationItem {
	quotationItemId?: any
	quotationId?: any
	productId?: any
	price?: any
	baseProductId?: any
	originPrice?: any
	cartonPrice?: any
	isLowerPrice?: any
	cartonQuantity?: any
	carton?: any
	minPriceNotes?: any
	itemDesc?: any
	notes?: any
	quantitySelection?: any
	isGenerateProduct?: any
}

interface IQuotationOption {
	optionId?: any
	quotationId?: any
	quotationOptionItemId: any
	customizeOptionNotes: any
}

interface IFormValues {
	quotationId?: any
	draft?: any
	customerId?: any
	employeeId?: any
	effDate?: any
	expDate?: any
	quotationItem: IQuotationItem[]
	optionCheckboxGroup?: any
	optionCustomComment?: any
}

const QuotationManagementEditDialog = (props: { customerId?: any, quotationData: any, onDialogClose: any, isNewQuotation: boolean }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  // const [quotationItemChangedValueIndex, setQuotationItemChangedValueIndex] = useState<any>()

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [baseProductsOptions, setBaseProductsOptions] = useState([])
  const [quotationCommentOptions, setQuotationCommentOptions] = useState([])
  const [isOnlyShowProduct, setIsOnlyShowProduct] = useState<number>(0)

  useEffect(() => {
    console.log(props.quotationData)
	  let optionCustomComment = ''
	  const optionCheckboxGroup: any[] = []
	  if (props.quotationData?.quotationOption?.length) {
      props.quotationData.quotationOption.map((row: IQuotationOption) => {
        if (row.customizeOptionNotes) {
          optionCustomComment = row.customizeOptionNotes
			  }
        if (row.quotationOptionItemId) {
          optionCheckboxGroup.push(row.quotationOptionItemId)
			  }
		  })
	  }
	  let isOnlyProduct = 0
	  if (props.quotationData?.quotationItem?.filter((row: any) => row.productId).length) {
	  	isOnlyProduct = 1
	  }
	  setIsOnlyShowProduct(isOnlyProduct)
	  getSelectOptions(urlKey.QuotationOptionItem).then(res => {
		  setQuotationCommentOptions(res.map((row: any) => ({
			  label: row[urlKey.QuotationOptionItem + 'Name'],
			  value: row[urlKey.QuotationOptionItem + 'Id'],
		  })))
		  setInitFormValues({
			  isOnlyProduct: isOnlyProduct,
			  // draft: 0,
			  ...props.quotationData,
			  quotationItem: props.quotationData?.quotationItem?.map((row: any) => ({
				  ...row,
				  no: row.productId || row.baseProductId,
				  cartonQuantity: getCartonQuantity(row.product || row.baseProduct),
				  // originPrice: getOriginPrice(row.product || row.baseProduct) || 0,
			  })),
			  effDate: props.quotationData?.effDate && moment(props.quotationData.effDate + '.000Z') || moment(),
			  expDate: props.quotationData?.expDate && moment(props.quotationData.expDate + '.000Z') || moment().add(1, 'month'),
			  optionCheckboxGroup: optionCheckboxGroup,
			  optionCustomComment: props.isNewQuotation ? res.map((row: any) => row.quotationOptionItemName).join('\n') : optionCustomComment
		  })
	  })
    if (props.quotationData?.customerId) {
      getSelectOptions('', 'Product/GetProductByCustomerId?id=' + props.quotationData?.customerId)
        .then(res => setProductsOptions(res))
    }
    getSelectOptions(urlKey.Customer).then(res => {
	    setCustomerOptions(res)
	    if (props.quotationData?.customerId) {
		    setSelectedCustomer(res.filter((row: any) => row.customerId === props.quotationData?.customerId)[0])
	    }
    })
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.BaseProduct).then(res => setBaseProductsOptions(res))
  }, [props.quotationData])

  useEffect(() => {
    if (formRef && props.customerId && props.isNewQuotation) {
      setCustomerInfosToForm(props.customerId, {...initFormValues, customerId: props.customerId}, formRef)
    }
  }, [formRef])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', span: 6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
    {name: 'employeeId', label: 'Sales', inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'effDate', label: 'Quote Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'expDate', label: 'Valid Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'quotationNo', label: 'Quotation No', inputElement: <Input disabled={true} />},
	  {name: 'notes', label: 'Comments', inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />},
	  // {name: 'draft', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
	  {name: 'isOnlyProduct', label: 'With Only Product', isWholeRowWidth: true, inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    [
	    {name: ['quotationItem', 'no'], span: 1, label: 'No.', inputElement: <CommonFormCustomItem />},
	    {name: ['quotationItem', 'productId'], span: 6, label: 'Product', inputElement: commonFormSelect(urlKey.Product, productsOptions)},
	    {name: ['quotationItem', 'baseProductId'], span: 6, label: 'Base Product', inputElement: commonFormSelect(urlKey.BaseProduct, baseProductsOptions)},
	    {name: ['quotationItem', 'itemDesc'], label: 'Item Desc', inputElement: <Input />},
	    {name: ['quotationItem', 'minPriceNotes'], label: 'Min Price($) * Notes(Qty)', inputElement: <Input disabled={true} />},
	    {name: ['quotationItem', 'carton'], label: 'Carton Price($) - Quantity', inputElement: <Input disabled={true} />},
	    {name: ['quotationItem', 'originPrice'], span: 2, label: 'Min Price', inputElement: <InputNumber disabled={true} />},
      {name: ['quotationItem', 'price'], span: 2, label: 'Price($)', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
	    // {name: ['quotationItem', 'cartonQuantity'], label: 'Carton Quantity', inputElement: <InputNumber disabled={true} />},
	    // {name: ['quotationItem', 'cartonPrice'], label: 'Carton Price($)', rules: [{type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
	    // {name: ['quotationItem', 'notes'], label: 'Notes(Qty)', inputElement: <InputNumber disabled={true} />},
	    // {name: ['quotationItem', 'isGenerateProduct'], label: 'Generate Product', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    ],
	  // {name: 'optionCheckboxGroup', label: 'Quotation Comment Options', isWholeRowWidth: true, inputElement: <Checkbox.Group style={{display: 'flex', flexDirection: 'column'}} options={quotationCommentOptions} />},
	  {name: 'optionCustomComment', label: 'Additional Comment', isWholeRowWidth: true, inputElement: <Input.TextArea showCount={true} autoSize={ true } />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    console.log(changedValues)
    console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    let quotationItemChangedValueIndex = 0
    let quotationItemChangedValue: IQuotationItem
    switch (changedValuesKey) {
	    case 'isOnlyProduct':
		    setIsOnlyShowProduct(changedValues['isOnlyProduct'])
		    break
      case 'customerId':
        if (changedValues['customerId']) {
          setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'quotationItem':
        quotationItemChangedValueIndex = changedValues['quotationItem'].length - 1
        // setQuotationItemChangedValueIndex(quotationItemChangedValueIndex)
        quotationItemChangedValue = changedValues['quotationItem'][quotationItemChangedValueIndex]
	      console.log(quotationItemChangedValue)
	      if (!quotationItemChangedValue) {
		      console.log('oooo')
	      	return
	      }
        // console.log(quotationItemChangedValue)
        if (quotationItemChangedValue && quotationItemChangedValue.productId && (Object.keys(quotationItemChangedValue).length === 1)) {
        	setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, quotationItemChangedValue?.productId, null)
          return
        }
	      if (quotationItemChangedValue && quotationItemChangedValue.baseProductId && (Object.keys(quotationItemChangedValue).length === 1)) {
	      	setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, null, quotationItemChangedValue?.baseProductId)
		      return
	      }
        break
    }
  }

  const setProductPriceToForm = async (form: any) => {
  	const formValues = form.getFieldsValue()
	  const quotationItem: any = formValues?.quotationItem || []
	  const updatedValues = {
		  ...formValues,
		  quotationItem: quotationItem.map((row: any, index: number) => {
			  console.log(row)
		  	if (!getCartonQuantity(row.product || row.baseProduct)) {
		  		SweetAlertService.errorMessage('No.' + (index + 1) + ' Quotation doesn\'t have carton quantity, please configure firstly.')
			  }
		  	let cartonPrice = row.price * (row.cartonQuantity || getCartonQuantity(row.product || row.baseProduct))
			  if (cartonPrice) {
			  	cartonPrice = parseFloat(cartonPrice.toFixed(3))
			  }
		  	const originPrice = row.originPrice || getOriginPrice(row.product || row.baseProduct)
			  const returnData = {
				  ...row,
				  cartonPrice: cartonPrice.toFixed(3) || 0,
				  carton: '$' + (cartonPrice.toFixed(3) || 0) + ' - ' + row.cartonQuantity,
			  }
		  	if (originPrice) {
		  		returnData.originPrice = originPrice
				  returnData.minPriceNotes = '$' + row.originPrice + ' * ' + row.notes
			  }
		  	return returnData
		  })
	  }
	  form.setFieldsValue(updatedValues)
  }

  const setProductInfosToForm = async (index: any, newValues: any, form: any, productId: any, baseProductId: any) => {
    console.log(index)
    // console.log(productId)
	  console.log(selectedCustomer)
    const result = await ApiRequest({
      url: productId ? 'Product/GetProductById?id=' + productId + '&group1Id=' + selectedCustomer?.group1Id : 'BaseProduct/GetBaseProductById?id=' + baseProductId,
      method: 'get',
      isShowSpinner: true
    })
    if (result && newValues) {
      const productInfos = result.data.data
      const quotationItem: any = newValues.quotationItem || []
	    const productOriginPrice = productInfos.minPrice || 0
	    const baseProductOriginPrice = productInfos.price?.filter((row: any) => row.group1Id === selectedCustomer?.group1Id)[0]?.minPrice
	    console.log(productInfos)
	    console.log(selectedCustomer)
	    if (productId) {
		    quotationItem[index] = {
			    productId: productInfos.productId,
			    no: productInfos.productId,
			    baseProductId: null,
			    cartonQuantity: getCartonQuantity(productInfos),
			    originPrice: getOriginPrice(productInfos),
			    price: productOriginPrice,
			    cartonPrice: (productOriginPrice * getCartonQuantity(productInfos)).toFixed(3)
		    }
	    } else {
		    console.log(productInfos.productPrice)
		    if (!productInfos.productPrice.length) {
		    	SweetAlertService.errorMessage('Please configure price for "' + productInfos.baseProductName + '" at Base Product Management Page firstly.')
		    }
		    const productPrices = productInfos.productPrice.map((row: any) => ({
			    productId: null,
			    cartonQuantity: getCartonQuantity(productInfos),
			    baseProductId: productInfos.baseProductId,
			    no: productInfos.baseProductId,
			    itemDesc: selectedCustomer?.customerCode,
			    originPrice: row.price,
			    price: row.price,
			    cartonPrice: (row.price * getCartonQuantity(productInfos)).toFixed(3),
			    notes: row.quantiy,
			    carton: '$' + (row.price * getCartonQuantity(productInfos)).toFixed(3) + ' - ' + getCartonQuantity(productInfos),
			    minPriceNotes: '$' + row.price + ' * ' + row.quantiy,
		    }))
		    quotationItem.splice(index, 1, ...productPrices)
	    }
      const updatedValues = {
        ...newValues,
        quotationItem: quotationItem
      }
	    console.log(updatedValues)
      form.setFieldsValue(updatedValues)
    }
  }

  const getOriginPrice = (data: any) => {
	  console.log(data)
  	if (!data) {
  		return null
	  }
  	if (data.productId) {
  		const product: any = productsOptions.filter((row: any) => row.productId === data.productId)[0]
		  console.log(product)
		  return product?.minPrice || 0
	  } else {
  		const baseProduct: any = baseProductsOptions.filter((row: any) => row.baseProductId === data.baseProductId)[0]
		  console.log(baseProduct)
		  return baseProduct?.price.filter((row: any) => row.group1Id === selectedCustomer?.group1Id)[0]?.minPrice
	  }
  }

  const getCartonQuantity = (data: any) => {
    console.log(data)
    if (!data) {
      return 9999999999
    }
    return data.productId ?
			data.baseProduct.packagingType?.quantity :
			data.packagingType?.quantity

  }

  const setCustomerInfosToForm = async (customerId: any, newValues: any, form: any) => {
    getSelectOptions('', 'Product/GetProductByCustomerId?id=' + customerId).then(res => setProductsOptions(res))
    const result = await ApiRequest({
      urlInfoKey: urlKey.Customer,
      type: urlType.GetById,
      dataId: customerId,
      isShowSpinner: false
    })
    if (result) {
	    console.log(newValues)
      const customerInfos = result.data.data
	    setSelectedCustomer(customerInfos)
      const updatedValues = {
        ...newValues,
        quotationItem: [],
        customerId: customerInfos.customerId,
        employeeId: customerInfos.employeeId,
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
	  console.log(form.getFieldsValue().quotationItem)
	  const quotationItem = form.getFieldsValue().quotationItem
    if (quotationItem && quotationItem[quotationItem?.length - 1]) {
	    console.log(quotationItem[quotationItem?.length - 1])
	    setProductPriceToForm(form)
    }
  }

  const setQuotaionOption = (formValues: IFormValues) => {
    const quotationOption = []
	  // formValues.optionCheckboxGroup.map((row: any) => {
    //   quotationOption.push({
    // 	  quotationId: props.quotationData.quotationId,
    // 	  quotationOptionItemId: row,
    // 	  customizeOptionNotes: null
    //   })
	  // })
	  if (formValues.optionCustomComment) {
      quotationOption.push({
			  quotationId: props.quotationData.quotationId,
			  quotationOptionItemId: null,
			  customizeOptionNotes: formValues.optionCustomComment
		  })
	  }
	  return quotationOption
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
	    // console.log(formValues)
	    const quotationOption: IQuotationOption[] = setQuotaionOption(formValues)
      const requestValues = {
        ...formValues,
        quotationId: props.quotationData.quotationId,
	      draft: formValues.draft ? 1 : 0,
	      quotationOption: quotationOption,
        quotationItem: formValues.quotationItem?.map((row: IQuotationItem) => ({
          ...row,
	        cartonPrice: parseFloat(row.cartonPrice),
	        isLowerPrice: row.originPrice > row.price ? 1 : 0,
          quotationId: props.quotationData.quotationId
        })),
      }
      // console.log(requestValues)
      let result
      if (props.isNewQuotation) {
        result = await ApiRequest({
          urlInfoKey: urlKey.Quotation,
          type: urlType.Create,
          data: requestValues
        })
      } else {
	      result = await ApiRequest({
		      urlInfoKey: urlKey.Quotation,
		      type: urlType.Update,
		      data: requestValues
	      })
	      // if (result && !requestValues.draft) {
		    //   const updateStatusResult = await ApiRequest({
			  //     url: 'Quotation/UpdateQuotationDraftStatus?id=' + result.data.data,
			  //     method: 'put'
		    //   })
	      // }
      }
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const getItems = () => {
	  const items = props.isNewQuotation ?
		  formItems.filter((row: any) => row.name !== 'quotationNo') :
		  formItems
	  return items.map((row: any) => {
	  	if (row instanceof Array) {
			  return row.filter((item: any) => isOnlyShowProduct ?
				  !['baseProductId', 'itemDesc', 'minPriceNotes', 'no'].includes(item.name[1]) :
				  (item.name[1] !== 'productId' && item.name[1] !== 'originPrice')
			  )
		  }
	  	return row
	  })
  }

  const onGenerateProduct = () => {
	  const productsForGenerate = formRef.getFieldsValue().quotationItem.filter((row: any) => row.isGenerateProduct)
	  if (productsForGenerate.length) {
		  productsForGenerate.map((row: any) => {
			  ApiRequest({
				  urlInfoKey: urlKey.Product,
				  type: urlType.Create,
				  data: {
					  productName: row.itemDesc,
					  baseProductId: row.baseProductId,
					  customerId: selectedCustomer.customerId
				  },
				  isShowSpinner: true
			  })
		  })
	  }
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm
	      items={ getItems() }
	      onFormChange={onFormChange}
	      onFormBlur={onFormBlur}
	      initFormValues={initFormValues}
      />
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
	      {/*<Button*/}
		    {/*  disabled={!formRef}*/}
		    {/*  onClick={onGenerateProduct}*/}
		    {/*  type="primary"*/}
		    {/*  style={{marginRight: '2rem'}}*/}
	      {/*>Generate Product</Button>*/}
        <Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
        >Confirm</Button>
      </div>
    </div>
  )
}

export default QuotationManagementEditDialog
