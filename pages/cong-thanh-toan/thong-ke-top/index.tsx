import React from 'react';
import MainLayout from 'layouts/MainLayout';
import ReportTopPageContainer from 'components/reportTop/ReportTopPageContainer';
function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ReportTopPageContainer />
    </MainLayout>
  );
}

export default index;
