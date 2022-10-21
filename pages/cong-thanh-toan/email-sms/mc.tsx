import React from 'react';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import EmailSmsContainer from 'components/Email-sms/EmailSmsContainer';

function index() {
  const router = useRouter();
  const merchantId = router?.query?.merchantId;

  return (
    <MainLayout isFixedDatatable={true}>
      <EmailSmsContainer merchantId={merchantId} tabActive={1}/>
    </MainLayout>
  );
}

export default index;