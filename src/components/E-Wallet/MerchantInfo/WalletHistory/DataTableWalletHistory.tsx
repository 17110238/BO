import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { appHistoryData, appHistoryInput } from 'models/walletHistory/walletHistoryState';
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
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer?.loadingWalletHistory
  );

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('TransId'),
        minWidth: '80px',
        maxWidth: '140px',
        cell: (row) => {
          return <div>{row?.id}</div>;
        },
      },
      {
        name: t('Số dư ban đầu'),
        minWidth: '140px',
        right: true,
        cell: (row) => {
          return row?.balance?.before?.cash !== -1 ? (
            <div>{numeral(row?.balance?.before?.cash).format('0,0.[0000]')}</div>
          ) : (
            <div>******</div>
          );
        },
      },
      {
        name: t('Số dư sau'),
        minWidth: '140px',
        right: true,
        cell: (row) => {
          return row?.balance?.after?.cash !== -1 ? (
            <div>{numeral(row?.balance?.after?.cash).format('0,0.[0000]')}</div>
          ) : (
            <div>******</div>
          );
        },
      },
      {
        name: t('Amount'),
        minWidth: '140px',
        right: true,
        cell: (row) => {
          return row?.amount !== -1 ? (
            <div className={`amount ${row?.change === '+' ? 'positive' : 'negative'}`}>
              {row?.change + numeral(row?.amount).format('0,0.[0000]')}
            </div>
          ) : (
            <div>******</div>
          );
        },
      },
      {
        name: t('Mô tả'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.description}</div>;
        },
      },
      {
        name: t('Thời gian giao dịch'),
        minWidth: '180px',
        maxWidth: '260px',
        cell: (row) => {
          return <div>{dayjs(row?.referData?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('ReferTransId'),
        minWidth: '120px',
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
