/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import {
  EwalletPaymeLogTransferDataApi,
  EwalletPaymeTransferLogInput,
  TransactionResponse,
  TransactionState,
} from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DataTableMultitransferCampaignProps {
  t: (a: string) => string;
  detailId?: string | string[];
  data: TransactionResponse[] | undefined;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm?: (a: boolean) => void;
  isLoading: boolean;
  rest?: any;
}

export default function DatatableDetailTransfer({
  t,
  isLoading,
  data,
  getDataList,
  setSubmitForm,
  detailId,
  ...rest
}: DataTableMultitransferCampaignProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<EwalletPaymeLogTransferDataApi>[] = useMemo(
    () => [
      {
        name: t('TK Chuyển'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => <span>{row?.sender ? row?.sender : '-'}</span>,
      },
      {
        name: t('TK Nhận'),
        cell: (row) => <span>{row?.phone}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },
      {
        name: t('Tên người nhận'),
        cell: (row) => <span>{row?.fullname ? row?.fullname : '-'}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },
      {
        name: t('Số tiền'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Số tiền hợp lệ'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amountTrans)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('TG chuyển'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Nội dung'),
        cell: (row) => <span>{row?.description ? row.description : '-'}</span>,
        minWidth: '132px',
      },
      {
        name: t('Trạng thái'),
        cell: (row) => (
          <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
        ),
        center: true,
        minWidth: '160px',
        maxWidth: '160px',
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isIndex
        isLoading={isLoading}
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom multitransfer-campaign-table'
        nameDataTable='colTransaction'
        getDataList={getDataList}
        {...rest}
      />
    </>
  );
}
