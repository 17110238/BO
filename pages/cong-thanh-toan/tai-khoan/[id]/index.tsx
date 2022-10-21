import MainLayout from 'layouts/MainLayout';
import React, { useEffect } from 'react';
import AccountsContainer from 'components/Account/AccountsContainer';
import { useRouter } from 'next/router';

function index() {
  const router = useRouter();
  const idMC = router?.query?.id || '';
  useEffect(() => {
    window.addEventListener('popstate', (event) => {
      router.push(`/${window.location.pathname}${window.location.search}`);
    });
    return () => {
      window.removeEventListener('popstate', (e) => {});
    };
  }, []);
  return (
    <MainLayout>
      <AccountsContainer idMC={idMC} />
    </MainLayout>
  );
}

export default index;
