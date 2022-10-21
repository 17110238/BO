import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';
import ContainerWordFillter from 'components/WordFillter/ContainerWordFillter';

function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ContainerWordFillter />
    </MainLayout>
  );
}

export default index;