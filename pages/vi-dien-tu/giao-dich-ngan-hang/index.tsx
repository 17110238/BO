import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import TranssactionBankContainer from 'components/E-Wallet/TransactionBank/TranssactionBankContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <TranssactionBankContainer />
    </MainLayout>
  );
}

export default index;
