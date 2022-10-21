import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import BankReportFormContainer from 'components/E-Wallet/BankReportForm/BankReportFormContainer';

function index() {
  return (
    <MainLayout>
      <BankReportFormContainer />
    </MainLayout>
  );
}

export default index;
