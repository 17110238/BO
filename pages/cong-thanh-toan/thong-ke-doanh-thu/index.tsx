import React from 'react';
import MainLayout from 'layouts/MainLayout';
import RevenueStatisticsContainer from 'components/RevenueStatistics/RevenueStatisticsContainer';
function index() {
  return (
    <MainLayout isFixedDatatable={true}>
      <RevenueStatisticsContainer />
    </MainLayout>
  );
}

export default index;
