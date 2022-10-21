import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import ApprovalMerchantContainer from 'components/Merchant/approvalMerchant/ApprovalMerchantContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ApprovalMerchantContainer />
    </MainLayout>
  );
}

export default index;
