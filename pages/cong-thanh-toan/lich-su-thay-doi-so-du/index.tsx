import React from 'react';
import MainLayout from 'layouts/MainLayout';
import NotifyContainer from 'components/Notify/Container';
import SearchAccountBalance from 'components/Accountant/SearchAccountBalance/SearchAccountBalancePageContainer';

function index() {
  return (
    <MainLayout>
      <SearchAccountBalance />
    </MainLayout>
  );
}

export default index;
