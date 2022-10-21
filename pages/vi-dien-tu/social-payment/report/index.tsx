import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import SocialPaymentContainer from 'components/E-Wallet/socialPayment/SocialPaymentContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <SocialPaymentContainer activeTab={2} />
    </MainLayout>
  );
}

export default index;
