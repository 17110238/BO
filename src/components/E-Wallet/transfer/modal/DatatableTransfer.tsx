import { PayintType } from 'models/payint';
import React, { FC, useMemo, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import formatCurrency from 'utils/helpers/formatCurrency';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import renderStatus from 'constants/Status';
import renderState from 'constants/State';
import { EwalletPaymeTransferLogResponse } from 'models';

interface Props {
  isLoading: boolean;
  data: object[];
  getDataList?: (start?: number, limit?: number, sort?: {}, campaign?: string) => {
    payload: any,
    getList: (payload: any) => void
  };
}

const DatatableTransfer: FC<Props> = ({ 
  isLoading,
  data, 
  getDataList, 
  ...rest
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<EwalletPaymeTransferLogResponse>[] = useMemo(
    () => [
      {
        name: t('Số tài khoản'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{t(row.receiver)}</div>;
        },
      },
      {
        name: t('Nội dung'),
        cell: (row) => {
          return (
            <div>{row.description}</div>
          );
        },
      },
      {
        name: t('Trạng thái tài khoản'),
        center: true,
        cell: (row) => {
          return (
            <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
          )
        },
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Số tiền'),
        right: true,
        cell: (row) => {
          return (
            <div>
              <span>{formatCurrency(row.amount)} đ</span>
            </div>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isIndex
        isLoading={isLoading}
        className='datatable-transfer'
        getDataList={getDataList}
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        {...rest}
      />
    </>
  );
};

export default DatatableTransfer;
