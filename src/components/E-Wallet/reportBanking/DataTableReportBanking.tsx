import { EwalletTransactionBankReport, EwalletTransactionReportData } from 'models';
import React, { useMemo } from 'react';
import formatCurrency from 'utils/helpers/formatCurrency';
import LoadingInline from 'components/common/Loading/LoadingInline';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';
import { TableColumn } from 'react-data-table-component';
export interface TotalReportProps {
  totalDeposit: number;
  totalCountDeposit: number;
  totalWithdraw: number;
  totalCountWithdraw: number;

}

interface IProps {
  isLoading: boolean;
  data: EwalletTransactionReportData[];
  totalReport: TotalReportProps;
  getList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
}

export default function DataTableReportBanking({
  isLoading,
  data,
  totalReport,
  getList,
}: IProps) {
  const { t } = useTranslation('common');

  const columns: TableColumn<EwalletTransactionReportData>[] = useMemo(
    () => [
      {
        name: t('Mã ngân hàng'),
        cell: (row) => {
          return <div>{row.bankCode}</div>;
        },
        footer: <div className='font-weight-bold'>{t('TỔNG CỘNG:')}</div>,
      },
      {
        name: t('Cổng thanh toán'),
        maxWidth: '150px',
        cell: (row) => {
          return <div>{row?.supplierName || '-'}</div>;
        },
      },
      {
        name: t('Số lần nạp tiền'),
        right: true,
        cell: (row) => {
          return <div className='text-right w-100'>{formatCurrency(row?.countDeposit) ?? '-'}</div>;
        },
        footer: <div>{formatCurrency(totalReport?.totalCountDeposit)}</div>,
        footerName: t('Số lần nạp tiền'),
      },
      {
        name: t('Tổng nạp tiền'),
        right: true,
        cell: (row) => {
          return <div className='text-right w-100'>{`${formatCurrency(row?.totalDeposit)} đ` ?? '-'}</div>;
        },
        footer: <div>{formatCurrency(totalReport?.totalDeposit)} đ</div>,
        footerName: t('Tổng nạp tiền'),
      },
      {
        name: t('Số lần rút tiền'),
        right: true,
        cell: (row) => {
          return <div className='text-right w-100'>{formatCurrency(row?.countWithdraw) ?? '-'}</div>;
        },
        footer: <div>{formatCurrency(totalReport?.totalCountWithdraw)}</div>,
        footerName: t('Số lần rút tiền'),
      },
      {
        name: t('Tổng rút tiền'),
        right: true,
        cell: (row) => {
          return <div className='text-right w-100'>{`${formatCurrency(row?.totalWithdraw)} đ` ?? '-'}</div>;
        },
        footer: <div>{formatCurrency(totalReport?.totalWithdraw)} đ</div>,
        footerName: t('Tổng rút tiền'),
      },
    ],
    [t, totalReport]
  );

  return (
    <>
      <DataTableCustom
        hasFooter
        hidePagination
        isLoading={isLoading}
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom transaction-table'
        nameDataTable='colTransaction'
        getDataList={getList}
      />
    </>
  )
}