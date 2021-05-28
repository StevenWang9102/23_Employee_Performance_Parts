import React, { useState } from 'react'
import CommonTablePage from '../../../components/common/common-table-page'
import { urlKey, urlType } from '../../../services/api/api-urls'
import CustomerManagementColumnModel from './customer-management-column-model'
import { ApiRequest } from '../../../services/api/api'
import { baseUrl } from '../../../services/api/base-url'
import QuotationManagementPage from '../quotation-management-page/quotation-management-page'
import CommonDialog from '../../../components/common/common-dialog'
import SalesOrderManagementPage from '../../order/sales-order/sales-order-management-page'
import ExtraAddressManagementPage from './extra-address-management-page/extra-address-management-page'
import {getRandomKey} from '../../../services/helpers'
import { getCookie } from 'react-use-cookie'

const CustomerManagementPage = (): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<any>()
  let isCreate: boolean = false

  const resetData = () => {
    setTriggerResetData(getRandomKey())
  }

  const quotationManagementDialog = (customerId: any) => <QuotationManagementPage customerId={customerId} />

  const orderManagementDialog = (customerId: any) => <SalesOrderManagementPage customerId={customerId} />

  const extraAddrDialog = (customerId: any) => <ExtraAddressManagementPage customerId={customerId} />

  const updateCustomerStatus = (rowData: any, statusId: any) => {
    ApiRequest({
      url: baseUrl + 'Customer/UpdateCustomerStatus?id=' + rowData.customerId + '&statusId=' + statusId,
      method: 'put'
    }).then(_ => {
      resetData()
    })
  }

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Quote',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(quotationManagementDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Order',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(orderManagementDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Addr',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(extraAddrDialog, rowData)
      }
    }
  ]

  const openDialog = (dialogFn: any, rowData: any) => {
    setDialogContent(dialogFn(rowData.customerId))
    setDialogTitle(rowData.company + ' -- ' + rowData.customerCode)
    setOpen(true)
  }

  return (
    <div>
      <CommonTablePage
        urlInfoKey={ urlKey.Customer }
        title="Customer Management"
        column={ CustomerManagementColumnModel({updateCustomerStatus: updateCustomerStatus}) }
        mappingUpdateData={(dataDetail: any, type: any) => {
          isCreate = type === urlType.Create;
          // if (isCreate) {
          //   dataDetail.employeeId = parseInt(getCookie('id'), 10)
          // }
          return dataDetail
        }}
        mappingRenderData={(data: any) => {
          if (isCreate) {
            openDialog(extraAddrDialog, data[data.length - 1])
          }
          return data.map((row: any) => ({
            ...row,
            createdAtDate: row.createdAt && (new Date(row.createdAt + '.000Z')).toDateString(),
          }))
        }}
        triggerResetData={triggerResetData}
        actionButtons={actionButtons}
      />
      <CommonDialog open={open} title={dialogTitle} onDialogClose={() => setOpen(false)} dialogContent={dialogContent} />
    </div>
  )
}

export default CustomerManagementPage
