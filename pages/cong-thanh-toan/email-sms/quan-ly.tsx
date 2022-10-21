import React from 'react';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import EmailSmsContainer from 'components/Email-sms/EmailSmsContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <EmailSmsContainer tabActive={0} />
    </MainLayout>
  );
}

export default index;
