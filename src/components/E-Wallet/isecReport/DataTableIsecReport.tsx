// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { EWalletISecReportAccount, PayloadSearchEWalletIsecReportAccount } from 'models';
import Link from 'next/link';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

interface Props {
  data: EWalletISecReportAccount[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchEWalletIsecReportAccount;
    getList: (payload: PayloadSearchEWalletIsecReportAccount) => void;
  };
}

const DataTableIsecReport: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<EWalletISecReportAccount>[] = useMemo(
    () => [
      {
        name: t('Mã người dùng'),
        minWidth: '130px',
        maxWidth: '130px',
        cell: (row) => {
          return <div>{row?.accountId || '-'}</div>;
        },
      },
      {
        name: t('Số điện thoại'),
        minWidth: '150px',
        cell: (row) => {
          return (
            <Link
              href={`/vi-dien-tu/thong-tin-khach-hang?searchValue=${row?.phone}&searchType=PHONE`}>
              <div className='highlight-text'>{row?.phone || '-'}</div>
            </Link>
          );
        },
      },
      {
        name: t('Mệnh giá'),
        right: true,
        minWidth: '160px',
        cell: (row) => {
          return <div>{numeral(row?.amount).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng tạo'),
        right: true,
        minWidth: '160px',
        cell: (row) => {
          return <div>{numeral(row?.quantityCreated).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị tạo (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.amountCreated).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng được tặng'),
        right: true,
        minWidth: '160px',
        cell: (row) => {
          return <div>{numeral(row?.quantityReceived).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị được tặng (VND)'),
        right: true,
        minWidth: '230px',
        cell: (row) => {
          return <div>{numeral(row?.amountReceived).format('0,0') || '-'}</div>;
        },
      },

      {
        name: t('Số lượng gạch'),
        right: true,
        minWidth: '160px',
        cell: (row) => {
          return <div>{numeral(row?.quantityUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị gạch (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.amountUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Phí gạch (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.feeUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng tặng'),
        right: true,
        minWidth: '160px',
        cell: (row) => {
          return <div>{numeral(row?.quantityTransfer).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị tặng (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.amountTransfer).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Phí tặng (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.feeTransfer).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị tồn (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.amountResidual).format('0,0') || '-'}</div>;
        },
      },
    ],

    [lang]
  );

  return (
    <div>
      <DataTableCustom
        dataList={data}
        columns={columns}
        t={t}
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DataTableIsecReport);
