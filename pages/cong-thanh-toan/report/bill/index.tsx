import React from 'react';
import MainLayout from 'layouts/MainLayout';
import ReportTransactionContainer from 'components/ReportColection/ReportTransactionContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportTransactionContainer />
    </MainLayout>
  );
}

export default index;

