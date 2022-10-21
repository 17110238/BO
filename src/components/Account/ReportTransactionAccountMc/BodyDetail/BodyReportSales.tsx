import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { Collapse } from 'react-bootstrap';
import { ReportMerchantResponse } from 'models/account/accountMerchant';
import ReportTransactionAccountMc from '../DataTableReportTransaction';
import DataTableReportSales from '../DataTableDetail/DataTableReportSales';

interface Props {
  reportTransactionDetail?: ReportMerchantResponse;
  collapse?: boolean;
}

const BodyReportSales: React.FC<Props> = ({ reportTransactionDetail, collapse }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  return (
    <Collapse in={collapse || false}>
      <DataTableReportSales t={t} totalFilter={0} />
    </Collapse>
  );
};

export default BodyReportSales;
