import ManageLoanPackage from 'components/E-Wallet/manageLoanPackage/ManageLoanPackage';
import MainLayout from 'layouts/MainLayout';
import React from 'react';

export default function LoanPackage() {
  return (
    <MainLayout isFixedDatatable={true}>
      <ManageLoanPackage />
    </MainLayout>
  );
}
