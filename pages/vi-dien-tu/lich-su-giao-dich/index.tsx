import React from 'react';
import MainLayout from 'layouts/MainLayout';
import TransactionHistoryContainer from 'components/E-Wallet/TransactionHistory/Container';

const TransactionHistory = () => {
  return (
    <MainLayout>
      <TransactionHistoryContainer />
    </MainLayout>
  );
};

export default TransactionHistory;
