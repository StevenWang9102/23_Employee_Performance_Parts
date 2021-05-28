import React from 'react'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, getItemsObj, getRandomKey, renderFn } from '../../../services/helpers'
import { Button } from 'antd'
import CommonDatePickerFilter from '../../../components/common/common-date-picker-filter'

export const colKey: any = {
  company: 'company',
  customerCode: 'customerCode',
  salutation: 'salutation',
  contactPerson: 'contactPerson',
  address1: 'address1',
  address2: 'address2',
  postalCode: 'postalCode',
  phone: 'phone',
  mobile: 'mobile',
  email: 'email',
  leadRating: 'leadRating',
  notes: 'notes',
  city: urlKey.City,
  customerGroup1: urlKey.CustomerGroup1,
  customerGroup2: urlKey.CustomerGroup2,
  customerGroup3: urlKey.CustomerGroup3,
  customerGroup4: urlKey.CustomerGroup4,
  customerGroup5: urlKey.CustomerGroup5,
  customerStatus: urlKey.CustomerStatus,
  customerSource: urlKey.CustomerSource,
  paymentCycle: urlKey.PaymentCycle,
  employee: urlKey.Employee,
  brand: urlKey.Brand,
  deliveryMethod: urlKey.DeliveryMethod,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.company, label: 'Company'},
    {key: colKey.customerCode, label: 'Customer Code', otherOptions: {required: true}},
    {key: colKey.salutation, label: 'Salutation'},
    {key: colKey.contactPerson, label: 'Contact Person'},
    {key: colKey.city, label: 'City', otherOptions: {type: 'select'}},
    {key: colKey.address1, label: 'Address'},
    {key: colKey.address2, label: 'Delivery Address'},
    {key: colKey.postalCode, label: 'Postal Code'},
    {key: colKey.phone, label: 'Phone'},
    {key: colKey.mobile, label: 'Mobile'},
    {key: colKey.email, label: 'Email'},
    {key: colKey.customerGroup1, label: 'Group1', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup2, label: 'Group2', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup3, label: 'Group3', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup4, label: 'Group4', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup5, label: 'Group5', otherOptions: {type: 'select'}},
    {key: colKey.leadRating, label: 'Rating', otherOptions: {type: 'inputNumber'}},
    {key: colKey.paymentCycle, label: 'Payment Cycle', otherOptions: {type: 'select'}},
    {key: colKey.customerStatus, label: 'Status', otherOptions: {type: 'select'}},
    {key: colKey.employee, label: 'Sales', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}},
    {key: colKey.brand, label: 'Branding', otherOptions: {type: 'select'}},
    {key: colKey.customerSource, label: 'Source', otherOptions: {type: 'select'}},
    {key: colKey.deliveryMethod, label: 'Delivery Method', otherOptions: {type: 'select'}},
    {key: colKey.notes, label: 'Comments', otherOptions: {type: 'inputTextArea'}},
  ]
}

const colInfos: any = {
  companyInfo: {
    title: 'Company Info',
    field: 'companyInfo',
    keywords: [
      colKey.company,
      colKey.customerCode,
      colKey.brand,
      colKey.notes,
    ],
    render: [
      colKey.company,
    ]
  },
  contactInfo: {
    title: 'Contact Info',
    field: 'contactInfo',
    keywords: [
      colKey.salutation,
      colKey.contactPerson,
      colKey.phone,
      colKey.mobile,
      colKey.email,
    ],
    render: [
      colKey.phone,
    ]
  },
  addressInfo: {
    title: 'Address Info',
    field: 'addressInfo',
    keywords: [
      colKey.city,
      colKey.address1,
      colKey.address2,
      colKey.postalCode,
      colKey.deliveryMethod,
    ],
    render: [
      colKey.address1,
    ]
  },
  groupClassification: {
    title: 'Group Classification',
    field: 'groupClassification',
    keywords: [
      colKey.customerGroup1,
      colKey.customerGroup2,
      colKey.customerGroup3,
      colKey.customerGroup4,
      colKey.customerGroup5,
    ],
    render: [
      colKey.customerGroup1,
    ]
  },
  otherInfo: {
    title: 'Other Info',
    field: 'otherInfo',
    keywords: [
      colKey.paymentCycle,
      colKey.customerSource,
      colKey.employee,
      colKey.leadRating,
      colKey.customerStatus,
    ],
    render: [
      colKey.customerSource,
      // colKey.employee,
    ]
  }
}

const CustomerManagementColumnModel = (props: any): any => {
  let modelArr: any = [
    colInfos.companyInfo,
    colInfos.contactInfo,
    colInfos.addressInfo,
    colInfos.groupClassification,
    colInfos.otherInfo
  ]

  modelArr = modelArr.map((row: any) => ({
    ...getColModelItem(row, keyInfosArray),
    render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), row.render),
  }))

  modelArr.push(
    {
      title: 'Created At',
      field: 'createdAt',
      type: 'datetime',
      editable: 'never',
      render: (rowData: any) => rowData.createdAtDate,
      filterComponent: (props:any) => {
        return (
          <>
            <CommonDatePickerFilter
              columnDef={props.columnDef}
              onFilterChanged={props.onFilterChanged}
            />
          </>
        )
      },
      customFilterAndSearch: (
        filterValue:any,
        rowData:any
      ) => {
        if (filterValue && (!filterValue.startDate || !filterValue.endDate || filterValue.startDate > filterValue.endDate)) {
          return false
        }
        return !filterValue || (rowData.createdAt >= filterValue.startDate && rowData.createdAt.slice(0, 10) <= filterValue.endDate)
      },
    },
    {
      title: 'Status Change',
      field: 'statusChange',
      editComponent: (props: any) => null,
      render: (rowData: any) => (
        <Button
          key={getRandomKey()}
          type="primary"
          danger={rowData[colKey.customerStatus + 'Id'] === 1}
          onClick={() => {
            props.updateCustomerStatus(rowData, rowData[colKey.customerStatus + 'Id'] === 1 ? 2 : 1)
          }}
        >
          {rowData[colKey.customerStatus + 'Id'] === 1 ? 'Deactivate' : 'Active'}
        </Button>
      )
    }
  )

  return modelArr
}

export default CustomerManagementColumnModel
