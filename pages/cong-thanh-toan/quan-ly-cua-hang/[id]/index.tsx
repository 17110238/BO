import StoreDetailsContainer from 'components/StoreManage/StoreDetails/StoreDetailsContainer';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function StoreDetail() {
  return (
    <MainLayout>
      <StoreDetailsContainer />
    </MainLayout>
  );
}
