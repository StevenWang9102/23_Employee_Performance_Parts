import React from 'react'
import CommonTablePage from '../../../../components/common/common-table-page'
import ExtraAddressManagementColumnModel from './extra-address-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const ExtraAddressManagementPage = (props: {customerId: any}):any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ExtraAddress}
      title="Extra Address Management"
      column={ExtraAddressManagementColumnModel.ExtraAddressManagementColumn}
      mappingRenderData={(data: any) => data.filter((row: any) => row.customerId === props.customerId)}
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, customerId: props.customerId})}
    />
  )
}

export default ExtraAddressManagementPage
