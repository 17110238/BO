import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { ReportMerchantEwalletData, ReportMerchantEwalletTotal } from 'models';
import numeral from 'numeral';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface Props {
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  data?: ReportMerchantEwalletData[];
  sumData?: ReportMerchantEwalletTotal;
  pageLoading? : boolean
}

const DatableReportEwalletMc: React.FC<Props> = ({ data, getDataList, sumData, pageLoading, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const genderMoneyClass = (data?: number) => {
    return data && data < 0 ? 'text-danger' : '';
  };

  const columns: TableColumn<ReportMerchantEwalletData>[] = useMemo(
    () => [
      {
        name: t('MCID'),
        minWidth: '100px',
        maxWidth: '110px',
        footer: <div className='font-weight-bold'>Tổng</div>,
        cell: (row, index) => {
          return <div className=''>{row?.merchantId}</div>;
        },
      },
      {
        name: t('Tên MC'),
        minWidth: '175px',
        maxWidth: '210px',
        right: true,
        footerName: 'Tổng MC',
        footer: '',
        cell: (row, index) => {
          return <div className='text-right w-100'>{row?.merchantName || '-'}</div>;
        },
      },
      {
        name: t('Số dư đầu kỳ (VND)'),
        right: true,
        minWidth: '170px',
        maxWidth: '200px',
        footerName: 'Tổng số dư đầu kỳ',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              sumData?.amountEwalletBefore
            )}`}>
            {numeral(sumData?.amountEwalletBefore).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => (
          <div className='text-right w-100'>
            {row?.amountEwalletBefore ? numeral(row?.amountEwalletBefore).format('0,0') : '-'}
          </div>
        ),
      },
      {
        name: t('Nhận đối soát (VND)'),
        right: true,
        minWidth: '140px',
        maxWidth: '180px',
        footerName: 'Tổng nhận đối soát',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumData?.crossCheck).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className={`text-right w-100 ${genderMoneyClass(row?.crossCheck)}`}>
              {row?.crossCheck ? numeral(row?.crossCheck).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Nạp (VND)'),
        right: true,
        minWidth: '120px',
        maxWidth: '250px',
        footerName: 'Tổng nạp',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              sumData?.topUp
            )}`}>
            {numeral(sumData?.topUp).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className={`text-right w-100 ${genderMoneyClass(row?.topUp)}`}>
              {row?.topUp ? numeral(row?.topUp).format('0,0') : '-'}
            </div>
          );
        },
      },
      {
        name: t('Rút (VND)'),
        right: true,
        minWidth: '150px',
        maxWidth: '200px',
        footerName: 'Tổng rút',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumData?.withdraw).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className={`text-right w-100 ${genderMoneyClass(row?.withdraw)}`}>
              {row?.withdraw ? numeral(row?.withdraw).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Chuyển (VND)'),
        right: true,
        minWidth: '150px',
        maxWidth: '200px',
        footerName: 'Tổng chuyển',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumData?.pobo).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className={`text-right w-100 ${genderMoneyClass(row?.pobo)}`}>
              {row?.pobo ? numeral(row?.pobo).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Phí chi hộ (VND)'),
        right: true,
        minWidth: '150px',
        maxWidth: '200px',
        footerName: 'Tổng phí chi hộ',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumData?.feePobo).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className={`text-right w-100 ${genderMoneyClass(row?.feePobo)}`}>
              {row?.feePobo ? numeral(row?.feePobo).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Số dư cuối kỳ (VND)'),
        right: true,
        minWidth: '150px',
        maxWidth: '200px',
        footerName: 'Tổng số dư cuối kỳ',
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold`}>
            {numeral(sumData?.wallet).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className={`text-right w-100 ${genderMoneyClass(row?.wallet)}`}>
              {row?.wallet ? numeral(row?.wallet).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
    ],
    [sumData]
  );
  return (
    <>
      <DataTableCustom
        hasFooter
        className='data-table-custom'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
        isLoading={pageLoading}
      />
    </>
  );
};

export default DatableReportEwalletMc;
