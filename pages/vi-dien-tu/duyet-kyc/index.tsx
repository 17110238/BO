import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import ApprovalKYCContainer from 'components/E-Wallet/approvalKYC/ApprovalKYCContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ApprovalKYCContainer />
    </MainLayout>
  );
}

export default index;
