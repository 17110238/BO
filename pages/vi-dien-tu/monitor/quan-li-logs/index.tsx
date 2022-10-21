import React from 'react';

import MainLayout from 'layouts/MainLayout';
import AlertLogsComponent from 'components/AlertLogs';

const AlertLogs = () => {
  return (
    <MainLayout isFixedDatatable={true}>
      <AlertLogsComponent />
    </MainLayout>
  );
};

export default AlertLogs;
