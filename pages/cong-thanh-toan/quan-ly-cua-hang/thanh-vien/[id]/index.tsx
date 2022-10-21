import StoreMemberContainer from 'components/StoreManage/StoreDetails/StoreMemberContainer';
import MainLayout from 'layouts/MainLayout';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function StoreMember() {
  return (
    <MainLayout>
      <StoreMemberContainer />
    </MainLayout>
  );
}
