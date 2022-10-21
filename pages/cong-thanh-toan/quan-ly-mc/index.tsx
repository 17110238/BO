import React from 'react';
import MainLayout from 'layouts/MainLayout';
import ManagerMerchant from 'components/Merchant/managerMerchant/ManagerMerchantContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ManagerMerchant />
    </MainLayout>
  );
}

export default index;
