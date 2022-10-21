import React from 'react';
import MainLayout from 'layouts/MainLayout';
import TemplateManageContainer from 'components/E-Wallet/Template/TemplateContainer';
import AccountWalletStatementContainer from 'components/AccountWalletStatement';

function index() {
  return (
    <MainLayout>
      <AccountWalletStatementContainer />
    </MainLayout>
  );
}

export default index;
