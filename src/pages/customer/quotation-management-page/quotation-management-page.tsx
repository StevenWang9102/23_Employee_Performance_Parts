import React, { useState } from 'react'

import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import QuotationManagementColumnModel from './quotation-management-column-model'
import QuotationManagementEditDialog from './quotation-management-edit-dialog/quotation-management-edit-dialog'
import CommonDialog from '../../../components/common/common-dialog'
import EmailModal from './quotation-email-dialog'
import quotationPdfGenerate from '../../pdf/quotation/quotationPdfGenerate'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import QuotationManagementApproveDialog from './quotation-management-approve-dialog/quotation-management-approve-dialog'
import {getCookie} from 'react-use-cookie'
import EmailModal1 from '../../../components/common/email-dialog'
import { ApiRequest } from '../../../services/api/api'
import { getRandomKey } from '../../../services/helpers'

export interface Email {
  employeeEmail: string
  customerEmail: string
  quotationNo:string
  quotationId:string
}

const QuotationManagementPage = (props: {customerId: any}) => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false) // Quotation Dialog
  const [open2, setOpen2] = useState(false) // Quotation Dialog
  const [quotationData, setQuotationData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewQuotation, setIsNewQuotation] = useState(false)
  // const [quotationCustomerId, setQuotationCustomerId] = useState<any>(props.customerId)

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const onDialogClose2 = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen2(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const quotationManagementEditDialog = <QuotationManagementEditDialog customerId={props.customerId} isNewQuotation={isNewQuotation} onDialogClose={onDialogClose} quotationData={quotationData} />

  const quotationManagementApproveDialog = <QuotationManagementApproveDialog customerId={props.customerId} onDialogClose={onDialogClose2} quotationData={quotationData} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        console.log(rowData)
        setOpen(true)
        setQuotationData(rowData)
        setDialogTitle('Quotation Edit')
        setIsNewQuotation(false)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Confirm Price',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (!rowData.inclLowerPrice) {
          SweetAlertService.errorMessage('Already Confirmed.')
          return
        }
        const result = await SweetAlertService.confirmMessage('Sure to approve current lower price?')
        if (result) {
          ApiRequest({
            url: 'Quotation/UpdateQuotation',
            method: 'put',
            data: {
              ...rowData,
              effDate: rowData.effDate1,
              expDate: rowData.expDate1,
              quotationItem: rowData.quotationItem.map((row: any) => ({...row, isLowerPrice: 0}))
            }
          }).then(_ => {
            setTriggerResetData(getRandomKey())
          })
        }
      }
    },
    {
      icon: 'danger', //Button attr of Ant design (danger, ghost)
      tooltip: 'Approve',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (!rowData.draft) {
          SweetAlertService.errorMessage('Already approved.')
          return
        }
        if (rowData.inclLowerPrice) {
          SweetAlertService.errorMessage('Lower price existed.')
          return
        }
        console.log(rowData)
        setOpen2(true)
        setQuotationData(rowData)
        setIsNewQuotation(false)
      }
    },
    {
      icon: '',
      tooltip: 'Add new quotation',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setQuotationData({})
        setDialogTitle('New Quotation')
        setIsNewQuotation(true)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Send Email',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        // console.log(rowData,'rowData in quotation')
        if (rowData.inclLowerPrice) {
          SweetAlertService.errorMessage('Lower price existed.')
          return
        }
        if (rowData.quotationItem.filter((row: any) => row.isLowerPrice).length) {
          SweetAlertService.errorMessage('Some quotation prices are lower than the original price.')
          return
        }
        const personInEmail:Email = {
          employeeEmail: getCookie('email'),
          customerEmail: rowData.customer.email,
          quotationNo: rowData.quotationNo,
          quotationId: rowData.quotationId
        }
        // console.log(personInEmail)
        setRowData(personInEmail)

        setIsEmailModalVisible(true)
        const obj = {
          customerName: rowData.customer.company,
          email: rowData.customer.email,
          // address: rowData.customer.address2 + ' ' + rowData.customer.address1,
          address: rowData.customer.address2,
          phone: rowData.customer.phone,
          validDate: rowData.expDate,
          quoteDate: rowData.effDate,
          quotationNo: rowData.quotationNo,
          tableContent: rowData.quotationItem.map((res:any) => {
            if (res.productId === null) {
              res.baseProduct.price = res.price
              res.baseProduct.notes = res.notes
              res.baseProduct.description = null
              res.baseProduct.itemDesc = res.itemDesc
              return res.baseProduct
            }
            res.product.price = res.price
            res.product.notes = res.notes
            return res.product
          }),
          options: rowData.quotationOption.map((res:any) => {
            if (res.customizeOptionNotes === null) {
              return res.quotationOptionItem.quotationOptionItemName
            }

            return res.customizeOptionNotes
          })
        }
        quotationPdfGenerate(obj, 'getBlob', getBlob)
      }
    },
  ]

  const getBlob = (blob?:any) => {
    console.log(blob, 'blob111')
    setEmailBlob(blob)

  }

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if ((props.customerId && (props.customerId === row.customerId)) || !props.customerId) {
        renderData.push({
          ...row,
          inclLowerPrice: row.quotationItem?.filter((item: any) => item.isLowerPrice).length ? 1 : 0,
          custConfirmed: row.custConfirmed ? 1 : 0,
          effDate1: row.effDate,
          expDate1: row.expDate,
          effDate: row.effDate && (new Date(row.effDate + '.000Z')).toDateString(),
          custConfimedAt1: row.custConfimedAt && (new Date(row.custConfimedAt + '.000Z')).toDateString(),
          expDate: row.expDate && (new Date(row.expDate + '.000Z')).toDateString(),
        })
      }
    })
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Quotation,
    title: 'Quotation Management',
    column: QuotationManagementColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.draft = parseInt(dataDetail.draft, 10)
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotAddable: true,
    isNotEditable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [rowData, setRowData] = useState<Email>()
  const [emailBlob, setEmailBlob] = useState()

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={quotationManagementEditDialog} />
      <CommonDialog title={'Quotation Approve'} open={open2} onDialogClose={onDialogClose2} dialogContent={quotationManagementApproveDialog} />
      <EmailModal1 visible={isEmailModalVisible} onCancel={() => setIsEmailModalVisible(false)} rowData={rowData} blob={emailBlob} quotationRowData={rowData}/>
    </div>
  )
}

export default QuotationManagementPage
