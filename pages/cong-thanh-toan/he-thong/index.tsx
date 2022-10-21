import React from 'react';
import MainLayout from 'layouts/MainLayout';
import SystemConfigContainer from 'components/systemConfig/SystemConfigContainer';

function index() {
  return (
    <MainLayout>
      <SystemConfigContainer />
    </MainLayout>
  );
}

export default index;
