import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';

import DetailMerchant from 'components/Merchant/expertiseMerchant/detailMerchant/DetailMerchant';
function DetailExpertiseMerchant() {
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('popstate', (event) => {
      router.push(`${window.location.pathname}${window.location.search}`);
    });
    return () => {
      window.removeEventListener('popstate', (e) => {});
    };
  }, []);

  return (
    <MainLayout>
      <DetailMerchant merchantId={router?.query?.id} />
    </MainLayout>
  );
}

export default DetailExpertiseMerchant;
