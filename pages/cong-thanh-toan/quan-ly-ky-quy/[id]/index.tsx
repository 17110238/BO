import DetailRevenueMerchantContainer from 'components/RevenueStatistics/DetailRevenueMerchant/DetailRevenueMerchantContainer';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import React from 'react';

const index = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <DetailRevenueMerchantContainer merchantId={router?.query?.id} />
    </MainLayout>
  );
};

export default index;
