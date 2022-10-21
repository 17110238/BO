/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from "components/common/Datatable/DatatableCusTom";
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from "hook/useWindowDimension";
import { SearchBalanceMerchantResponsed, TransactionState } from 'models';
import Link from "next/link";
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';


interface DataTableAccountBalanceProps {
  t: (a: string) => string;
  data: SearchBalanceMerchantResponsed[] | undefined;
  totalFilter?: number;
  onRowSelected?: any,
  deleteDefault?: boolean,
  getDataList?: (start?: number, limit?: number, sort?: {}) => {
    payload: any,
    getList: (payload: any) => void
  };
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  rest?: any;
  isLoading: boolean;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}

export default function DataTableAccountBalance({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isLoading,
  ...rest
}: DataTableAccountBalanceProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { height: screenHeight } = useWindowDimensions();
  // amount: 19846 //phát sinh
  // balanceAfter: 897320620.4702 //dư cuối kỳ
  // balanceBefore: 897300774.4702 //soosd duh đầu
  // change: "+"
  // createdAt: "2022-05-25T03:07:54.118Z" //thoi gian
  // description: "Đơn hàng #V5IZA3NFS0TC giao dịch" // diễn giải
  // merchantId: 22 // mã mc
  // merchantName: "Tran Phi Vu" // tên mc
  // referTransaction: "" // mã tham chiếu
  // transactionId: "V5IZA3NFS0TC" // ma giao dịch
  // transactionType: "CROSS_CHECK" //loại giao dịch
  const columns: TableColumn<SearchBalanceMerchantResponsed>[] = useMemo(
    () => [
      {
        name: t('Thời Gian GD'),
        minWidth: '205px',
        cell: (row) => (<span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>)
      },
      {
        name: t('Mã GD'),
        minWidth: '190px',
        maxWidth: '200px',
        cell: (row) => (<span>{row?.transactionId}</span>)
      },
      {
        name: t('Mã MC'),
        right: true,
        minWidth: '100px',
        maxWidth: '110px',
        cell: (row) => (<span>{row?.merchantId} </span>),
      },
      {
        name: t('Tên MC'),
        minWidth: '200px',
        maxWidth: '230px',
        cell: (row) => (<Link href={`/cong-thanh-toan/quan-ly-mc/${row?.merchantId}`}><span className='text-link'> {row?.merchantName}</span></Link>),
      },
      {
        name: t('Loại GD'),
        minWidth: '125px',
        maxWidth: '130px',
        cell: (row) => (<span className='color-payme'>{row?.transactionType}</span>)
      },
      {
        name: t('Số dư đầu'),
        right: true,
        minWidth: '150px',
        cell: (row) => (<span> {formatCurrency(row?.balanceBefore)} đ</span>),
      },
      {
        name: t('Phát sinh'),
        right: true,
        minWidth: '150px',
        cell: (row) => (<span className={row.change === "+" ? "" : "text-danger"}>{`${row.change} ${formatCurrency(row?.amount)}`} đ </span>),
      },
      {
        name: t('Dư cuối kỳ'),
        right: true,
        minWidth: '150px',
        cell: (row) => (<span> {formatCurrency(row?.balanceAfter)} đ</span>),
      },
      {
        name: t('Diễn giải'),
        minWidth: '130px',
        maxWidth: '150px',
        cell: (row) => (<span> {row?.description}</span>),
      },
      {
        name: t('Mã tham chiếu'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => (<span>{row?.referTransaction || ''}</span>),
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        fixedHeader={true}
        columns={columns}
        dataList={data}
        className='data-table-custom transaction-table'
        paginationTotalRows={totalFilter}
        nameDataTable="colTransaction"
        getDataList={getDataList}
        {...rest}
      />
    </>
  );
}
