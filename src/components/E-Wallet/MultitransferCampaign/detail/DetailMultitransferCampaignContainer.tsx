import React, { useState } from 'react';
import HeaderDetailMultiTransferCampaign from './HeaderDetailMultitransferCampaign';
import ContentMultiTransferCampaign from './ContentMultitransferCampaign';
import DatatableDetailMultiTransferCampaign from './DatatableDetailMultitransferCampaign';

const fakeData = [
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
  {orderId: 'Nguyen Van A'},
]
const DetailMultitransferCampaignContainer: React.FC = (props: any) => {

  return (
    <div className="box-content multitransfer-campaign-container detail-muiltitransfer-campaign-container">
      <HeaderDetailMultiTransferCampaign />
      <ContentMultiTransferCampaign />
      <DatatableDetailMultiTransferCampaign 
        data={fakeData}
      />
    </div>
  )
}

export default DetailMultitransferCampaignContainer;