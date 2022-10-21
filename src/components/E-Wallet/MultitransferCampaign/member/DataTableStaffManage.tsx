/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import { TransactionResponse, TransactionState } from 'models';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DatatableStaffManageProps {
  t: (a: string) => string;
  data: TransactionResponse[] | undefined;
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
  onOpenModalUpdate: (a: boolean) => void;
  onOpenModalDelete: (a: boolean) => void;
  rest?: any;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}

export default function DatatableStaffManage({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  onOpenModalUpdate,
  onOpenModalDelete,
  isNotHaveTotalRow = false,
  ...rest
}: DatatableStaffManageProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, TransactionState>((state) => state?.transactions.loading);

  const columns: TableColumn<TransactionResponse>[] = useMemo(
    () => [
      {
        name: t('STT'),
        minWidth: '135px',
        maxWidth: '145px',
        cell: (row) => <span className='text-link'>{row?.transactionId}</span>,
      },
      {
        name: t('SĐT'),
        minWidth: '200px',
        maxWidth: '300px',
        cell: (row) => <span>{row?.orderId ? row?.orderId : '-'}</span>,
      },
      {
        name: t('Họ tên'),
        cell: (row) => <span>{row?.partnerTransaction}</span>,
        minWidth: '200px',
        maxWidth: '300px',
      },
      {
        name: t('Công ty'),
        cell: (row) => <span>{row?.supplierId}</span>,
        minWidth: '200px',
        maxWidth: '300px',
      },
      {
        name: t('Trạng thái tài khoản'),
        cell: (row) => (
          <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
        ),
        minWidth: '140px',
        maxWidth: '150px',
      },
      {
        name: t('TK ví công ty'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '200px',
        maxWidth: '300px',
      },
      {
        name: t('TG tạo'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='multitransfer-campaign-table-dropdown'>
                <Dropdown.Toggle
                  className='p-0 w-100'
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                  id='dropdown-button-drop-up'>
                  <div className='d-flex justify-content-center w-100'>
                    <i className='fas fa-th-large m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item
                    className='detail'
                    onClick={() => onOpenModalUpdate && onOpenModalUpdate(true)}>
                    <i className='fas fa-edit mr-2'></i>
                    {t('Cập nhật')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='cancel'
                    onClick={() => onOpenModalDelete && onOpenModalDelete(true)}>
                    <i className='fas fa-ban mr-2'></i>
                    {t('Xóa')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
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
