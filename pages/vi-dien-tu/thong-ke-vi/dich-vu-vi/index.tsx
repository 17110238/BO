import ReportWalletServiceContainer from 'components/ReportWalletService';
import MainLayout from 'layouts/MainLayout';
import React from 'react';

const ReportWalletServicePage = () => {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportWalletServiceContainer />
    </MainLayout>
  );
};

export default ReportWalletServicePage;
