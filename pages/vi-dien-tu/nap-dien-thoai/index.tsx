import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import ContainerTopup from 'components/TopupPhone/ContainerTopup';

function index() {
  return (
    <MainLayout>
      <ContainerTopup />
    </MainLayout>
  );
}

export default index;