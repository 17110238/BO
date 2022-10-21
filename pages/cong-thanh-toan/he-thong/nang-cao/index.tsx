import React from 'react';
import MainLayout from 'layouts/MainLayout';
import AdvancedConfigContainer from 'components/systemConfig/AdvancedConfigContainer';
function index() {
  return (
    <MainLayout>
      <AdvancedConfigContainer />
    </MainLayout>
  );
}

export default index;
