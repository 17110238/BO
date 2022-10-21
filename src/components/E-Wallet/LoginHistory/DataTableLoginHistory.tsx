/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';

interface DataTableLoginHistory {
  t: (a: string) => string;
  data?: any;
  totalFilter?: number;
  onRowSelected?: any;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  isNotHaveTotalRow?: boolean;
  rest?: any;
}

export default function DataTableTransaction({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isNotHaveTotalRow = false,
  ...rest
}: DataTableLoginHistory) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const loading = useSelector<any | boolean>((state) => state?.eWalletHistoryLoginReducer?.loading);
  const router = useRouter();

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Id'),
        minWidth: '105px',
        maxWidth: '105px',
        cell: (row) => <span onClick={() => {}}>{row?.id}</span>,
      },
      {
        name: t('Mã người dùng'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => (
          <span
            className='text-link'
            onClick={() => {
              router.push(
                `/vi-dien-tu/thong-tin-khach-hang?searchValue=${row?.userId}&searchType=ACCOUNT_ID`
              );
            }}>
            {row?.userId ? row?.userId : '-'}
          </span>
        ),
      },
      {
        name: t('AppName'),
        cell: (row) => <span>{row?.appName ? row?.appName : '-'}</span>,
        minWidth: '155px',
        maxWidth: '155px',
      },
      {
        name: t('Id khách hàng'),
        cell: (row) => <span>{row?.clientId}</span>,
        minWidth: '205px',
        maxWidth: '240px',
      },
      {
        name: t('UserAgent'),
        cell: (row) => <span>{row?.userAgent}</span>,
        minWidth: '350px',
        maxWidth: '300px',
      },
      {
        name: t('Client Version'),
        center: true,
        cell: (row) => <span className='color-payme'>{row?.clientVersion}</span>,
        minWidth: '140px',
        maxWidth: '150px',
      },
      {
        name: t('Thời gian đăng nhập'),

        cell: (row) => <span>{dayjs(row?.loginTime).format('HH:mm:ss DD/MM/YYYY')}</span>,
        minWidth: '165px',
        maxWidth: '166px',
      },
      {
        name: t('Thời gian đăng xuất'),

        cell: (row) => (
          <span>
            {' '}
            {row?.logoutTime ? dayjs(row?.logoutTime).format('HH:mm:ss DD/MM/YYYY') : '-'}
          </span>
        ),
        minWidth: '165px',
        maxWidth: '165px',
      },
      {
        name: t('Địa chỉ  IP'),

        cell: (row) => <span>{row?.ip}</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('OS'),
        cell: (row) => <span>{row?.os}</span>,
        minWidth: '130px',
        maxWidth: '150px',
      },
      {
        name: t('Client Channel'),
        cell: (row) => <span>{row?.clientChannel ? row?.clientChannel : '-'}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isLoading={loading}
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom login-history-table'
        paginationTotalRows={totalFilter}
        nameDataTable='loginHistoryTable'
        getDataList={getDataList}
        {...rest}
      />
    </>
  );
}
