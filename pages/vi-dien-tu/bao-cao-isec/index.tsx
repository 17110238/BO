import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import IsecReportContainer from 'components/E-Wallet/isecReport/IsecReportContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <IsecReportContainer />
    </MainLayout>
  );
}

export default index;
