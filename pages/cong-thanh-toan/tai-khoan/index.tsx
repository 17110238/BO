import React from 'react';
import MainLayout from 'layouts/MainLayout';
import AccountsContainer from 'components/Account/AccountsContainer';
import { useRouter } from 'next/router';
function index() {
  const router = useRouter();

  return (
      <AccountsContainer tabActive={0} />
  );
}

export default index;
