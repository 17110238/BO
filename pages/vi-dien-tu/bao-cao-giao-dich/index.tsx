import ReportTransactionContainer from 'components/E-Wallet/ReportTransaction/ReportTransactionContainer';
import MainLayout from 'layouts/MainLayout';
import React from 'react';

export default function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportTransactionContainer />
    </MainLayout>
  );
}
