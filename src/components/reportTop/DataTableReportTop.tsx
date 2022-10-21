/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from "components/common/Datatable/DatatableCusTom";
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from "hook/useWindowDimension";
import { SearchBalanceMerchantResponsed, TransactionState } from 'models';
import { ReportTopTransactionResponsed, ReportTopTransactionType } from "models/report-bill";
import Link from "next/link";
import numeral from "numeral";
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';


interface DataTableAccountBalanceProps {
  t: (a: string) => string;
  data: ReportTopTransactionType[] | undefined;
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

export default function DataTableReportTop({
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
  // merchantId
  //               accountId
  //               merchantName
  //               username
  //               brandName
  //               website
  //               industryCategory
  //               representative
  //               phone
  //               merchantType
  //               email
  //               createdAt
  //               approvedAt
  //               state
  //               count
  //               value
  const columns: TableColumn<ReportTopTransactionType>[] = useMemo(
    () => [
      {
        name: 'MC ID',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.merchantId} </span>),
      },
      {
        name: 'ID tài khoản',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.accountId} </span>),
      },
      {
        name: 'Tên Merchant',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.merchantName} </span>),
      },
      {
        name: 'Tên đăng nhập',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.username} </span>),
      },
      {
        name: 'Tên hiển thị khi giao dịch',
        minWidth: '190px',
        cell: (row) => (
          <span >{row?.brandName} </span>),
      },
      {
        name: 'Website',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.website} </span>),
      },
      {
        name: 'Lĩnh vực kinh doanh',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.industryCategory} </span>),
      },
      {
        name: 'Người đại diện',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.representative} </span>),
      },
      {
        name: 'Số điện thoại',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.phone} </span>),
      },
      {
        name: 'Loại MC',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.merchantType} </span>),
      },
      {
        name: 'Email',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.email} </span>),
      },
      {
        name: 'TG tạo',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.createdAt  ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'} </span>),
      },
      {
        name: 'TG duyệt',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.approvedAt ? dayjs(row?.approvedAt).format('HH:mm:ss DD/MM/YYYY') : '-'} </span>),
      },
      {
        name: 'Tình trạng',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.state} </span>),
      },
      {
        name: 'Số GD',
        minWidth: '165px',
        cell: (row) => (
          <span >{row?.count} </span>),
      },
      {
        name: t('Giá trị'),
        right: true,
        minWidth: '150px',
        cell: (row) => (
          <span>
            {numeral(row?.value).format('0,0') || '-'}
          </span>
        ),

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
