import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { ISecReportTransaction, PayloadSearchIsecReportTrans } from 'models';
import Link from 'next/link';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

interface Props {
  data: ISecReportTransaction[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchIsecReportTrans;
    getList: (payload: PayloadSearchIsecReportTrans) => void;
  };
}

const DatatableIsecReportTransaction: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<ISecReportTransaction>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '100px',
        maxWidth: '100px',
        cell: (row) => {
          return <div>{row?.id || '-'}</div>;
        },
      },
      {
        name: t('Mã giao dịch'),
        minWidth: '110px',
        cell: (row) => {
          return (
            <Link href={`/vi-dien-tu/lich-su-giao-dich?search=${row?.bulkId}&typeId=transactionId`}>
              <div className='highlight-text'>{row?.bulkId || '-'}</div>
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
        name: t('Số lượng'),
        right: true,
        minWidth: '120px',
        cell: (row) => {
          return <div>{numeral(row?.quantity).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Tổng giá trị'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.totalAmount).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('TK tạo'),
        minWidth: '130px',
        cell: (row) => {
          return <div>{row?.phone || '-'}</div>;
        },
      },
      {
        name: t('TG tạo'),
        minWidth: '130px',
        maxWidth: '130px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
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

export default memo(DatatableIsecReportTransaction);
