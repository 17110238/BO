import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { LoginHistoryTypes } from 'models';
import { Fragment, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';

interface PropsComponent {
  t: (str: string) => string;
  totalRow: number;
  data: any;
  getDataList: any;
}

export default function LoginHistoryDatatable({
  t,
  totalRow,
  data,
  getDataList,
  ...rest
}: PropsComponent) {
  const loading = useSelector((state: any) => state.loginHistoryReducer?.loading);
  const columns: TableColumn<LoginHistoryTypes>[] = useMemo(
    () => [
      {
        name: t('Mã đăng nhập'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{row?.id}</span>
            </>
          );
        },
      },
      {
        name: t('Mã người dùng'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{row?.accountId}</span>
            </>
          );
        },
      },
      {
        name: t('Tên người dùng'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{row?.username}</span>
            </>
          );
        },
      },
      {
        name: t('Tên ứng dụng'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{row?.appId}</span>
            </>
          );
        },
      },
      {
        name: t('Mã khách hàng'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{row?.clientInfo?.deviceId}</span>
            </>
          );
        },
      },
      {
        name: t('UserAgent'),
        minWidth: '300px',
        maxWidth: '400px',
        cell: (row) => {
          return (
            <>
              <span>{row?.clientInfo?.userAgent}</span>
            </>
          );
        },
      },
      {
        name: t('Phiên bản khách hàng'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return (
            <>
              <span>{row?.clientInfo?.version}</span>
            </>
          );
        },
      },
      {
        name: t('TG Đăng nhập'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{dayjs(row?.lastLoginTime).format('H:m:s DD/MM/YYYY')}</span>
            </>
          );
        },
      },
      {
        name: t('TG Đăng xuất'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{dayjs(row?.lastLogoutTime).format('H:m:s DD/MM/YYYY')}</span>
            </>
          );
        },
      },
      {
        name: t('IP'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row) => {
          return (
            <>
              <span>{row?.ip}</span>
            </>
          );
        },
      },
      {
        name: t('Hệ điều hành'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <>
              <span>{row?.clientInfo?.platform}</span>
            </>
          );
        },
      },
      {
        name: t('Kênh'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return (
            <>
              <span>{row?.clientInfo?.channel}</span>
            </>
          );
        },
      },
    ],
    []
  );
  return (
    <Fragment>
      <DataTableCustom
        dataList={data}
        paginationTotalRows={totalRow}
        columns={columns}
        t={t}
        isLoading={loading}
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </Fragment>
  );
}
