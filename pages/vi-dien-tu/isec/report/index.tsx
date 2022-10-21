import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import IsecContainer from 'components/E-Wallet/Isec/IsecContainer';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <IsecContainer activeTab={1} />
    </MainLayout>
  );
}

export default index;
