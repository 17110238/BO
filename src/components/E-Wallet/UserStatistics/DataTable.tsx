import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import _ from 'lodash';
import { DataReportUser, ReportUserInput } from 'models';
import { getStatisticEwalletReportUser } from 'redux/actions';
import { useDispatch } from 'react-redux';
interface Props {
  t: (a: string) => string;
  data: DataReportUser[] | undefined;
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
  heightBoxSearch?: number;
  rest?: any;
  submitForm: boolean;
  isLoading: boolean;
  filter: any;
  totalApp: number;
  totalUser: number;
}

const DataTable: React.FC<Props> = ({
  t,
  data,
  deleteDefault,
  getDataList,
  heightBoxSearch,
  filter,
  submitForm,
  isLoading,
  totalApp,
  totalUser,
  ...rest
}) => {
  const lang: string = localStorage.getItem('NEXT_LOCALE') ?? 'vi';
  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer
  const dispatch = useDispatch();
  const columns: TableColumn<DataReportUser>[] = useMemo(
    () => [
      {
        name: t('UserID'),
        minWidth: '120px',
        maxWidth: '200px',
        footer: t('Tổng'),
        cell: (row) => <span>{row?.accountId}</span>,
      },
      {
        name: t('Họ và tên'),
        left: true,
        minWidth: '180px',
        footerName: t('Họ và tên'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>{totalUser}</p>,
        maxWidth: '200px',
        cell: (row) => <span>{row?.fullname || '-'}</span>,
      },
      {
        name: t('Số điện thoại'),
        minWidth: '130px',
        maxWidth: '200px',
        footerName: t('Số điện thoại'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => <span>{row?.phone || '-'}</span>,
      },
      {
        name: t('KYC Status'),
        minWidth: '150px',
        maxWidth: '300px',
        footerName: t('KYC Status'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => (
          <span
            className={`${
              row?.kycState === 'APPROVED'
                ? 'state-success-modal'
                : row?.kycState === 'PENDING'
                ? 'state-pending-modal'
                : row?.kycState === 'CANCELED' ||
                  row?.kycState === 'BANNED' ||
                  row?.kycState === 'REJECTED'
                ? 'state-cancel-modal'
                : ''
            } `}>
            {row?.kycState === 'APPROVED'
              ? t('Đã duyệt')
              : row?.kycState === 'PENDING'
              ? t('Chờ duyệt')
              : row?.kycState === 'CANCELED'
              ? t('Hủy')
              : row?.kycState === 'BANNED'
              ? t('Bị khóa')
              : row?.kycState === 'REJECTED'
              ? t('Từ chối')
              : '-'}
          </span>
        ),
      },
      {
        name: t('Aplications'),
        cell: (row) => <span>{row?.appName || '-'} </span>,
        footerName: t('Aplications'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>{totalApp}</p>,
        minWidth: '250px',
        maxWidth: '300px',
      },
      {
        left: true,
        name: t('Ngày sinh'),
        footerName: t('Ngày sinh'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => (
          <span>{row?.birthday ? dayjs(row?.birthday).format('DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '130px',
        maxWidth: '130px',
      },
      {
        name: t('Tuổi'),
        footerName: t('Tuổi'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => <span>{row?.age || '-'}</span>,
        minWidth: '55px',
        maxWidth: '60px',
      },
      {
        name: t('Giới tính'),
        footerName: t('Giới tính'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => <span>{row?.gender ? t(row?.gender) : '-'}</span>,
        minWidth: '80px',
        maxWidth: '100px',
      },
      {
        name: t('Địa chỉ'),
        footerName: t('Địa chỉ'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => <span>{row?.address || '-'}</span>,
        minWidth: '250px',
        maxWidth: '300px',
      },

      {
        name: t('Trạng thái'),
        footerName: t('Trạng thái'),
        footer: <p className={`mb-0 text-right w-100 font-weight-bold`}>-</p>,
        cell: (row) => (
          <span
            className={`${
              row?.status === 'OPENED'
                ? 'state-success-modal'
                : row?.status === 'TEMPORARY_LOCKED'
                ? 'state-pending-modal'
                : row?.status === 'LOCKED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(`${row?.status}`)}
          </span>
        ),
        minWidth: '150px',
        maxWidth: '250px',
      },
    ],
    [lang, totalUser, totalApp]
  );

  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        fixedHeader={true}
        fixedHeaderScrollHeight={`${totalFixedHeightDatatable}px`}
        columns={columns}
        dataList={data}
        className='data-table-custom cash-withdraw-table'
        nameDataTable='colTransaction'
        getDataList={getDataList}
        hasFooter
        {...rest}
      />
    </>
  );
};

export default DataTable;
