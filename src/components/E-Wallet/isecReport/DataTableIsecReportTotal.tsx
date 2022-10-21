// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import _ from 'lodash';
import { EWalletISecReportAccount, PayloadSearchEWalletIsecReportAccount } from 'models';
import Link from 'next/link';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

interface Props {
  data: EWalletISecReportAccount[];
  total: EWalletISecReportAccount;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchEWalletIsecReportAccount;
    getList: (payload: PayloadSearchEWalletIsecReportAccount) => void;
  };
}

const DataTableIsecReportTotal: React.FC<Props> = ({ data, getDataList, total, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<EWalletISecReportAccount>[] = useMemo(
    () => [
      {
        name: t('Mệnh giá'),
        minWidth: '160px',
        selector: (row) => row?.amount!,
        sortable: true,
        footer: 'Tổng',
        cell: (row) => {
          return <div>{numeral(row?.amount).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng tạo'),
        right: true,
        selector: (row) => row?.quantityCreated!,
        minWidth: '160px',
        footerName: 'Số lượng tạo',
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.quantityCreated).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.quantityCreated).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị tạo (VND)'),
        right: true,
        selector: (row) => row?.quantityCreated!,
        minWidth: '200px',
        footerName: t('Tổng giá trị tạo (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.amountCreated).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.amountCreated).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng được tặng'),
        right: true,
        selector: (row) => row?.quantityCreated!,
        minWidth: '160px',
        footerName: t('Số lượng được tặng'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.quantityReceived).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.quantityReceived).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị được tặng (VND)'),
        right: true,
        selector: (row) => row?.amountReceived!,
        minWidth: '230px',
        footerName: t('Tổng giá trị được tặng (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.amountReceived).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.amountReceived).format('0,0') || '-'}</div>;
        },
      },

      {
        name: t('Số lượng gạch'),
        right: true,
        selector: (row) => row?.quantityUsed!,
        minWidth: '160px',
        footerName: t('Số lượng gạch'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.quantityUsed).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.quantityUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị gạch (VND)'),
        right: true,
        selector: (row) => row?.amountUsed!,
        minWidth: '200px',
        footerName: t('Tổng giá trị gạch (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.amountUsed).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.amountUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Phí gạch (VND)'),
        right: true,
        selector: (row) => row?.feeUsed!,
        minWidth: '200px',
        footerName: t('Phí gạch (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.feeUsed).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.feeUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng tặng'),
        right: true,
        selector: (row) => row?.quantityTransfer!,
        minWidth: '160px',
        footerName: t('Số lượng tặng'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.quantityTransfer).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.quantityTransfer).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị tặng (VND)'),
        right: true,
        selector: (row) => row?.amountTransfer!,
        minWidth: '200px',
        footerName: t('Tổng giá trị tặng (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.amountTransfer).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.amountTransfer).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Phí tặng (VND)'),
        right: true,
        selector: (row) => row?.feeTransfer!,
        minWidth: '200px',
        footerName: t('Phí tặng (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.feeTransfer).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.feeTransfer).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị tồn (VND)'),
        right: true,
        selector: (row) => row?.amountResidual!,
        minWidth: '200px',
        footerName: t('Tổng giá trị tồn (VND)'),
        footer: (
          <p className='mb-0 text-right w-100 font-weight-bold'>
            {numeral(total?.amountResidual).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.amountResidual).format('0,0') || '-'}</div>;
        },
      },
    ],

    [lang, total]
  );

  return (
    <div>
      <DataTableCustom
        hasFooter
        dataList={data}
        columns={columns}
        t={t}
        hidePagination
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DataTableIsecReportTotal);
