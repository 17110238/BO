import React, { useEffect } from 'react';
import MainLayout from 'layouts/MainLayout';

import LoginHistoryContainer from 'components/E-Wallet/LoginHistory/LoginHistoryContainer';

function LoginHistory() {
  return (
    <MainLayout isFixedDatatable={true}>
      <LoginHistoryContainer />
    </MainLayout>
  );
}

export default LoginHistory;
