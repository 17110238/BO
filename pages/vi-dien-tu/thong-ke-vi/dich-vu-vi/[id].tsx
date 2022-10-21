import ReportWalletAppItem from 'components/ReportWalletAppItem';
import MainLayout from 'layouts/MainLayout';
import React from 'react';

const ReportWalletServiceDetailPage = () => {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportWalletAppItem />
    </MainLayout>
  );
};

export default ReportWalletServiceDetailPage;
