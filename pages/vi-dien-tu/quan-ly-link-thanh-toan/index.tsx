import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import SocialPaymentContainer from 'components/E-Wallet/socialPayment/SocialPaymentContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <SocialPaymentContainer />
    </MainLayout>
  );
}

export default index;
