import React from 'react';
import MainLayout from 'layouts/MainLayout';
import DepositManageContainer from 'components/depositManage/DepositManageContainer';
function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <DepositManageContainer  />
    </MainLayout>
  );
}

export default index;
