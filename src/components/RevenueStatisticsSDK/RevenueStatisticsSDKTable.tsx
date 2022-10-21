import React, { useMemo } from 'react';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';
import { TableColumn } from 'react-data-table-component';
import numeral from 'numeral';
import { RevenueStatisticDataType, RevenueStatisticSumType, SearchRevenuePayload } from 'models';

interface Props {
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: SearchRevenuePayload;
    getList: (payload: SearchRevenuePayload) => void;
  };
  data: RevenueStatisticDataType[] | [];
  sumData?: RevenueStatisticSumType;
}

const RevenueStatisticsSDKTable: React.FC<Props> = ({ data, sumData, getDataList, ...rest }) => {
  const { t } = useTranslation('common');

  const columns: TableColumn<RevenueStatisticDataType>[] = useMemo(
    () => [
      {
        name: t('Merchant ID'),
        footer: <div className='font-weight-bold'>Tổng</div>,
        cell: (row) => {
          return <div>{row?.merchantId}</div>;
        },
      },
      {
        name: t('Tên ứng dụng'),
        cell: (row) => {
          return <div className='text-info font-weight-bold'>{row?.appName || '-'}</div>;
        },
      },
      {
        name: t('Tổng thanh toán (VND)'),
        right: true,
        footer: (
          <div className='text-right w-100 font-weight-bold'>
            {numeral(sumData?.totalPayment).format('0,0') ?? '-'}
          </div>
        ),
        footerName: t('Tổng thanh toán (VND)'),
        cell: (row) => {
          return (
            <div className='text-right w-100'>
              {numeral(row?.totalPayment).format('0,0') ?? '-'}
            </div>
          );
        },
      },
      {
        name: t('Tổng phí (VND)'),
        footer: (
          <div className='text-right w-100 font-weight-bold'>
            {numeral(sumData?.fee).format('0,0') ?? '-'}
          </div>
        ),
        footerName: t('Tổng phí (VND)'),
        right: true,
        cell: (row) => <div className='text-right w-100'>{numeral(row?.fee).format('0,0')}</div>,
      },
      {
        name: t('Tổng số GD'),
        right: true,
        footer: (
          <div className='text-right w-100 font-weight-bold'>
            {numeral(sumData?.count).format('0,0') ?? '-'}
          </div>
        ),
        footerName: t('Tổng số GD'),
        cell: (row) => {
          return <div className='text-right w-100'>{row?.count ?? '-'}</div>;
        },
      },
      {
        name: t('Tổng đối soát (VND)'),
        right: true,
        footer: (
          <div className='text-right w-100 font-weight-bold'>
            {numeral(sumData?.crossCheckAmount).format('0,0') ?? '-'}
          </div>
        ),
        footerName: t('Tổng đối soát (VND)'),

        cell: (row) => {
          return (
            <div className='text-right w-100'>{numeral(row?.crossCheckAmount).format('0,0')}</div>
          );
        },
      },
      {
        name: t('Số GD đối soát'),
        right: true,
        footer: (
          <div className='text-right w-100 font-weight-bold'>
            {numeral(sumData?.crossCheckCount).format('0,0') ?? '-'}
          </div>
        ),
        footerName: t('Số GD đối soát'),
        cell: (row) => {
          return <div className='text-right w-100'>{row?.crossCheckCount ?? '-'}</div>;
        },
      }
    ],
    [sumData]
  );

  return (
    <DataTableCustom
      t={t}
      hasFooter
      columns={columns}
      dataList={data}
      nameDataTable='colMerchant'
      className='data-table-custom'
      getDataList={getDataList}
      isSorting={true}
      {...rest}
    />
  );
};

export default RevenueStatisticsSDKTable;
