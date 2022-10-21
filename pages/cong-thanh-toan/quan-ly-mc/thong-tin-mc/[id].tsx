import React from 'react';
import MainLayout from 'layouts/MainLayout';

import { useRouter } from 'next/router';
import ViewMerchantContainer from 'components/Merchant/viewMerchant/ViewMerchantContainer';
const index = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <ViewMerchantContainer merchantId={router?.query?.id} />
    </MainLayout>
  );
};

export default index;
