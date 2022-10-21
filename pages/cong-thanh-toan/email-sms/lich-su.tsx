import React from 'react';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import EmailSmsContainer from 'components/Email-sms/EmailSmsContainer';


function index() {
  const router = useRouter();
  const props = router?.query;

  return (
    <MainLayout isFixedDatatable={true}>
      <EmailSmsContainer tabActive={2}/>
    </MainLayout>
  );
}

export default index;
