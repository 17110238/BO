import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { appHistoryData, appHistoryInput } from 'models/walletHistory/walletHistoryState';
import formatCurrency from 'utils/helpers/formatCurrency';
import numeral from 'numeral';

interface DataTableWalletHistoryProps {
  t: (a: string) => string;
  data: appHistoryData[];
  getDataList: (
    start?: number,
    limit?: number
  ) => {
    payload: appHistoryInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

function DataTableWalletHistory({
  t,
  data,
  getDataList,
  setSubmitForm,
  ...rest
}: DataTableWalletHistoryProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>((state) => state?.walletHistoryReducer.loading);

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.id}</div>;
        },
      },
      {
        name: t('Phone'),
        minWidth: '140px',
        cell: (row) => {
          return <div>{row?.phone}</div>;
        },
      },
      {
        name: t('UserID'),
        minWidth: '160px',
        cell: (row) => {
          return <div>{row?.accountId}</div>;
        },
      },
      {
        name: t('Số dư ban đầu'),
        minWidth: '200px',
        right: true,
        cell: (row) => {
          return (
            <div>
              {row?.balance?.before?.cash
                ? numeral(row?.balance?.before?.cash).format('0,0.[0000]')
                : '-'}
            </div>
          );
        },
      },
      {
        name: t('Số dư sau'),
        minWidth: '180px',
        right: true,
        cell: (row) => {
          return (
            <div>
              {row?.balance?.after?.cash
                ? numeral(row?.balance?.after?.cash).format('0,0.[0000]')
                : '-'}
            </div>
          );
        },
      },
      {
        name: t('Amount'),
        minWidth: '180px',
        right: true,
        cell: (row) => {
          return (
            <div
              className={`amount ${
                row?.amount === -1 ? '' : row?.change === '+' ? 'positive' : 'negative'
              }`}>
              {row?.amount === -1
                ? '******'
                : row?.change + numeral(row?.amount).format('0,0.[0000]')}
            </div>
          );
        },
      },
      {
        name: t('Description'),
        minWidth: '220px',
        cell: (row) => {
          return <div>{row?.description || '-'}</div>;
        },
      },
      {
        name: t('Thời gian giao dịch'),
        minWidth: '200px',
        cell: (row) => {
          return (
            <div>
              {row?.referData?.createdAt
                ? dayjs(row?.referData?.createdAt).format('HH:mm:ss DD/MM/YYYY')
                : '-'}
            </div>
          );
        },
      },
      {
        name: t('RefID'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.referData?.transaction || row?.referData?.transactionId}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        isLoading={isLoading}
        columns={columns}
        dataList={data}
        t={t}
        getDataList={getDataList}
        {...rest}
      />
    </div>
  );
}

export default DataTableWalletHistory;
