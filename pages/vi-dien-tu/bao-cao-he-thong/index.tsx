import MainLayout from 'layouts/MainLayout';
import React from 'react';
import ReportDataContainer from 'components/E-Wallet/Report/Data/ReportDataContainer';

export default function index() {
  return (
    <MainLayout>
      <ReportDataContainer activeTab={0} />
    </MainLayout>
  );
}
