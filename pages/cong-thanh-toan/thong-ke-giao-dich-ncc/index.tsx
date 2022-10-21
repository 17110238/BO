import React from 'react';
import MainLayout from 'layouts/MainLayout';
import ReportSupplierTransactionContainer from 'components/ReportTransactionSupplier/ReportSupplierTransactionContainer';
function ReportTransactionSupplier() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportSupplierTransactionContainer />
    </MainLayout>
  );
}

export default ReportTransactionSupplier;
