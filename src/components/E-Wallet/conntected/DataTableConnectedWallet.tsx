/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { ConnectedUserType, TransactionResponse, TransactionState } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';

interface IProps {
  t: (a: string) => string;
  data?: ConnectedUserType[];
  totalFilter?: number;
  onRowSelected?: any;
  deleteDefault?: boolean;
  isLoading: boolean;
  setIdDetail: (a: string) => void;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onOpenDeleteModal: () => void;
  setSubmitForm?: (a: boolean) => void;
  rest?: any;
}

export default function DataTableConnectedWallet({
  t,
  data,
  isLoading,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  onOpenDeleteModal,
  setIdDetail,
  ...rest
}: IProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const router = useRouter();

  const columns: TableColumn<ConnectedUserType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '135px',
        maxWidth: '145px',
        cell: (row) => <span>{row?.id}</span>,
      },
      {
        name: t('Mã tài khoản'),
        minWidth: '180px',
        cell: (row) => <span>{row?.accountId ? row?.accountId : '-'}</span>,
      },
      {
        name: t('Số điện thoại'),
        cell: (row) => <span>{row?.phone ? row?.phone : '-'}</span>,
        minWidth: '180px',
      },
      {
        name: t('Mã người dùng'),
        cell: (row) => <span>{row?.userId ? row?.userId : '-'}</span>,
        minWidth: '200px',
      },
      {
        name: t('Mã ứng dụng '),
        cell: (row) => <span>{row?.appId ? row?.appId : '-'}</span>,
        minWidth: '180px',
      },
      {
        name: t('Tên ứng dụng'),
        cell: (row) => <span>{row?.appName ? row?.appName : '-'}</span>,
        minWidth: '200px',
      },
      {
        name: t('Tên doanh nghiệp'),
        cell: (row) => <span>{row?.merchantName ? row?.merchantName : '-'}</span>,
        minWidth: '200px',
      },
      {
        name: t('Thời gian tạo'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        center: true,
        minWidth: '180px',
        maxWidth: '230px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <div className='update-icon'>
              <i
                className='fas fa-trash fa-lg update-icon text-muted'
                onClick={() => {
                  onOpenDeleteModal();
                  setIdDetail(String(row?.id));
                }}></i>
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
        isLoading={isLoading}
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom multitransfer-campaign-table'
        paginationTotalRows={totalFilter}
        nameDataTable='colTransaction'
        getDataList={getDataList}
        {...rest}
      />
    </>
  );
}
