import React from 'react';
import MainLayout from 'layouts/MainLayout';
import DetailRevenueMerchantContainer from 'components/RevenueStatistics/DetailRevenueMerchant/DetailRevenueMerchantContainer';
import { useRouter } from 'next/router';
function index() {
  const router = useRouter();

  return (
    <MainLayout isFixedDatatable={true}>
      <DetailRevenueMerchantContainer merchantId={router.query.id} />
    </MainLayout>
  );
}

export default index;
