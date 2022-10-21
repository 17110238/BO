import MainLayout from 'layouts/MainLayout';
import React from 'react';
import WebBLockContainer from 'components/ListUserBlock';

export default function HistoryLoginComponent() {
  return (
    <MainLayout isFixedDatatable={true}>
      <WebBLockContainer />
    </MainLayout>
  );
}
