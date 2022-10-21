import MainLayout from 'layouts/MainLayout';
import React from 'react';
import LoginHistoryContainer from 'components/PaymentGate/LoginHistory/LoginHistoryContainer';

export default function HistoryLoginComponent() {
  return (
    <MainLayout isFixedDatatable={true}>
      <LoginHistoryContainer />
    </MainLayout>
  );
}
