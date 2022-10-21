import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { EWalletSocialPay, PayloadSearchEwalletReportSocialPayment } from 'models';
import Link from 'next/link';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
interface Props {
  data: EWalletSocialPay[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchEwalletReportSocialPayment;
    getList: (payload: PayloadSearchEwalletReportSocialPayment) => void;
  };
}

const DatatableApprovalMerchant: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const generateState = (state?: string) => {
    if (!state) return '';

    switch (state) {
      case 'PENDING':
        return 'state-refunded';
      case 'CANCELED':
      case 'EXPIRED':
      case 'FAILED':
        return 'state-cancel';
      case 'SUCCEEDED':
      case 'RECEIVED':
      case 'USED':
        return 'state-success';
      default:
        break;
    }
  };

  const columns: TableColumn<EWalletSocialPay>[] = useMemo(
    () => [
      {
        name: t('Mã GD'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <Link
              href={`/vi-dien-tu/lich-su-giao-dich?search=${row?.transactionId}&typeId=transactionId`}>
              <div className='highlight-text'>{row?.transactionId || '-'}</div>
            </Link>
          );
        },
      },
      {
        name: t('Token link'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.tokenLink || '-'}</div>;
        },
      },
      {
        name: t('Loại'),
        minWidth: '130px',
        cell: (row) => {
          return <div>{t(`SOCIAL_${row?.type}`) || '-'}</div>;
        },
      },
      {
        name: t('Từ ID'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.fromUserId || '-'}</div>;
        },
      },
      {
        name: t('Đến ID'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.toUserId || '-'}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '150px',
        cell: (row) => {
          return (
            <div className={generateState(row?.state)}>{row?.state ? t(row?.state!) : '-'}</div>
          );
        },
      },
      {
        name: t('TG tạo'),
        minWidth: '100px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Giá trị GD (VND)'),
        minWidth: '150px',
        right: true,
        cell: (row) => {
          return <div>{numeral(row?.amount).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Nội dung GD'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.description || '-'}</div>;
        },
      },

      {
        name: t('Phương thức TT'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.paymentMethod || '-'}</div>;
        },
      },
      {
        name: t('NPH'),
        minWidth: '100px',
        cell: (row) => {
          return <div>{row?.publisher || '-'}</div>;
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
        className='approval-merchant-table mt-1'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DatatableApprovalMerchant);
