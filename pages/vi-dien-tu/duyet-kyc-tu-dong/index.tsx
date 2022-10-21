import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import AutoApprovalKYCContainer from 'components/E-Wallet/autoApprovalKYC/AutoApprovalKYCContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <AutoApprovalKYCContainer />
    </MainLayout>
  );
}

export default index;
