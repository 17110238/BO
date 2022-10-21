// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { DetailRevenue, PayloadSearchMerchantRevenue, RevenueReport, SettingDeposit } from 'models';
import Link from 'next/link';
import numeral from 'numeral';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';

interface Props {
  t: (a: string) => string;
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

const DataTableDetailReportMerchant: React.FC<Props> = ({ onClickRow, t, getDataList, data, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<DetailRevenue>[] = useMemo(
    () => [
      {
        name: t('Phương thức thanh toán'),
        minWidth: '180px',
        maxWidth: '200px',
        cell: (row, index) => {
          return <div>{row?.method}</div>;
        },
      },
      {
        name: t('Số GD thành công'),
        minWidth: '80px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.succeededCount ? numeral(row?.succeededCount).format('0,0') : '-'}
            </div>
          );
        },
      },
      {
        name: t('Số GD hủy'),
        minWidth: '175px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.canceledCount ? numeral(row?.canceledCount).format('0,0') : '-'}
            </div>
          );
        },
      },
      {
        name: t('Số GD hoàn'),
        minWidth: '170px',
        cell: (row, index) => (
          <div className='text-right w-100'>
            {row?.refundedCount ? numeral(row?.refundedCount).format('0,0') : '-'}
          </div>
        ),
      },

      {
        name: t('Tổng tiền GD thành công (VND)'),
        minWidth: '230px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.succeededAmount ? numeral(row?.succeededAmount).format('0,0') : '-'}
            </div>
          );
        },
      },
      {
        name: t('Tổng tiền GD hủy (VND)'),
        minWidth: '180px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.canceledAmount ? numeral(row?.canceledAmount).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Tổng tiền GD hoàn (VND)'),
        minWidth: '190px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.refundedAmount ? numeral(row?.refundedAmount).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Phí GD (VND)'),
        minWidth: '150px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.fee ? numeral(row?.fee).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Tổng tiền MC thực nhận (VND)'),
        minWidth: '220px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.amount ? numeral(row?.amount).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Tổng đối soát (VND)'),
        minWidth: '170px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.crossCheckAmount ? numeral(row?.crossCheckAmount).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
      {
        name: t('Tổng GD đối soát'),
        minWidth: '170px',
        cell: (row, index) => {
          return (
            <div className='text-right w-100'>
              {row?.crossCheckCount ? numeral(row?.crossCheckCount).format('0,0') : '-'}{' '}
            </div>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
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

export default DataTableDetailReportMerchant;
