import StoreUpdateContainer from 'components/StoreManage/StoreDetails/StoreUpdateContainer';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function StoreUpdateComponent() {
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
      <StoreUpdateContainer />
    </MainLayout>
  );
}
