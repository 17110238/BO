import React from 'react';

import MainLayout from 'layouts/MainLayout';
import BankReportFormContainer from 'components/E-Wallet/BankReportForm/BankReportFormContainer';

const index = () => {
  return (
    <MainLayout isFixedDatatable={false}>
      <BankReportFormContainer />
    </MainLayout>
  );
};

export default index;
