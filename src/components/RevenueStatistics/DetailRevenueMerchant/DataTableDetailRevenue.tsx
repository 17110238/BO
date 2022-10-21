// import DataTableCustom from 'components/common/Datatable/DatatableCusTomFooter';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { DetailRevenue, PayloadSearchMerchantRevenue, RevenueReport } from 'models';
import numeral from 'numeral';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';

interface Props {
  total: DetailRevenue;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchMerchantRevenue;
    getList: (payload: PayloadSearchMerchantRevenue) => void;
  };
  data: RevenueReport[] | [];
  onClickRow?: (data: RevenueReport) => React.MouseEventHandler<HTMLDivElement>;
}

const DataTableDetailRevenue: React.FC<Props> = ({
  onClickRow,
  getDataList,
  total,
  data,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');

  const genderMoneyClass = (data?: number) => {
    return data && data < 0 ? 'text-danger' : '';
  };

  const columns: TableColumn<DetailRevenue>[] = useMemo(
    () => [
      {
        name: t('Phương thức thanh toán'),
        minWidth: '180px',
        maxWidth: '200px',
        footer: t('Tổng'),
        cell: (row, index) => {
          return <div>{row?.method}</div>;
        },
      },
      {
        name: t('Số GD thành công'),
        minWidth: '80px',
        footerName: 'Số GD thành công',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.succeededCount
            )}`}>
            {numeral(total.succeededCount).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.succeededCount ? numeral(row?.succeededCount).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Số GD hủy'),
        minWidth: '175px',
        footerName: 'Số GD hủy',
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.canceledCount
            )}`}>
            {numeral(total.canceledCount).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.canceledCount ? numeral(row?.canceledCount).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Số GD hoàn'),
        minWidth: '170px',
        footerName: t('Số GD hoàn'),
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total?.refundedCount
            )}`}>
            {numeral(total?.refundedCount).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => (
          <div className='text-right w-100'>
            {row?.refundedCount ? numeral(row?.refundedCount).format('0,0') : '0'}
          </div>
        ),
      },

      {
        name: t('Tổng tiền GD thành công (VND)'),
        minWidth: '230px',
        footerName: t('Tổng tiền GD thành công (VND)'),
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.succeededTotal
            )}`}>
            {numeral(total.succeededTotal).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.succeededTotal ? numeral(row?.succeededTotal).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng tiền GD hủy (VND)'),
        minWidth: '180px',
        footerName: t('Tổng tiền GD hủy'),
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.canceledTotal
            )}`}>
            {numeral(total.canceledTotal).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.canceledTotal ? numeral(row?.canceledTotal).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng tiền GD hoàn (VND)'),
        minWidth: '190px',
        footerName: t('Tổng tiền GD hoàn'),
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.refundedTotal
            )}`}>
            {numeral(total.refundedTotal).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.refundedTotal ? numeral(row?.refundedTotal).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Phí GD (VND)'),
        minWidth: '150px',
        footerName: t('Phí GD'),
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(total.fee)}`}>
            {numeral(total.fee).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.fee ? numeral(row?.fee).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng tiền MC thực nhận (VND)'),
        minWidth: '220px',
        footerName: t('Tổng tiền MC thực nhận'),
        footer: (
          <p className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(total.amount)}`}>
            {numeral(total.amount).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.amount ? numeral(row?.amount).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng đối soát (VND)'),
        minWidth: '170px',
        footerName: t('Tổng đối soát'),
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.crossCheckTotal
            )}`}>
            {numeral(total.crossCheckTotal).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.crossCheckTotal ? numeral(row?.crossCheckTotal).format('0,0') : '0'}
            </div>
          );
        },
      },
      {
        name: t('Tổng GD đối soát'),
        minWidth: '170px',
        footerName: t('Tổng GD đối soát'),
        footer: (
          <p
            className={`mb-0 text-right w-100 font-weight-bold ${genderMoneyClass(
              total.crossCheckCount
            )}`}>
            {numeral(total.crossCheckCount).format('0,0') || '[ - ]'}
          </p>
        ),
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.crossCheckCount ? numeral(row?.crossCheckCount).format('0,0') : '0'}
            </div>
          );
        },
      },
    ],
    [lang, total]
  );

  return (
    <div>
      <DataTableCustom
        hasFooter
        className='data-table-custom revenue-statistics__datatable'
        columns={columns}
        dataList={data}
        paginationTotalRows={20}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
      />
    </div>
  );
};

export default DataTableDetailRevenue;
