// import DataTableCustom from 'components/common/Datatable/DatatableCusTomFooter';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { PayloadSearchEwalletReportSocialPayment, ReportEWalletSocialPayment } from 'models';
import numeral from 'numeral';
import { totalmem } from 'os';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
interface Props {
  data: ReportEWalletSocialPayment[];
  total: ReportEWalletSocialPayment;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchEwalletReportSocialPayment;
    getList: (payload: PayloadSearchEwalletReportSocialPayment) => void;
  };
}

const DatatableReportSocial: React.FC<Props> = ({ data, total, getDataList, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const genderMoneyClass = (data?: number) => {
    return data && data < 0 ? 'text-danger' : '';
  };

  const columns: TableColumn<ReportEWalletSocialPayment>[] = useMemo(
    () => [
      {
        name: t('Phương thức TT '),
        minWidth: '130px',
        footer: t('Tổng'),
        cell: (row) => {
          return <div className='highlight-text'>{row?.paymentMethod || '-'}</div>;
        },
      },
      {
        name: t('Số lượng'),
        minWidth: '110px',
        footerName: 'Số lượng',
        right: true,
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(total?.numberPaymentMethod).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.numberPaymentMethod).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Giá trị GD (VND)'),
        right: true,
        minWidth: '160px',
        footerName: 'Giá trị GD (VND)',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.totalTransaction
            )}`}>
            {numeral(total.totalTransaction).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.totalTransaction).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Giá trị thực (VND)'),
        right: true,
        minWidth: '160px',
        footerName: 'Giá trị thực (VND)',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total?.totalReal
            )}`}>
            {numeral(total?.totalReal).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.totalReal).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Phí (VND)'),
        right: true,
        minWidth: '120px',
        footerName: 'Phí (VND)',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total?.totalFee
            )}`}>
            {numeral(total?.totalFee).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row) => {
          return <div>{numeral(row?.totalFee).format('0,0') || '-'}</div>;
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
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table mt-2'
        getDataList={getDataList}
        isSorting={true}
        fixedHeader={true}
        {...rest}
      />
    </div>
  );
};

export default memo(DatatableReportSocial);
