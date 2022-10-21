import StoreManageContainer from 'components/StoreManage/StoreManageContainer';
import MainLayout from 'layouts/MainLayout';
import React from 'react';

export default function StoreManage() {
  return (
    <MainLayout isFixedDatatable={true}>
      <StoreManageContainer />
    </MainLayout>
  );
}
