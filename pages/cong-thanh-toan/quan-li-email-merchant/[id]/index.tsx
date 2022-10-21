import React from 'react';
import MainLayout from 'layouts/MainLayout';
import DetailEmailMerchantContainer from 'components/RevenueStatistics/DetailRevenueMerchant/DetailRevenueMerchantContainer';
import { useRouter } from 'next/router';
function DetailEmailMerchant() {
  const router = useRouter();

  return (
    <MainLayout isFixedDatatable={true}>
      <DetailEmailMerchantContainer merchantId={router.query.id} />
    </MainLayout>
  );
}

export default DetailEmailMerchant;
