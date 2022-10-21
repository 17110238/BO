// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { EWalletIsecReport, FilterSearchIsecManage } from 'models';
import numeral from 'numeral';
import React, { memo, useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
interface Props {
  data: EWalletIsecReport[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: FilterSearchIsecManage;
    getList: (payload: FilterSearchIsecManage) => void;
  };
}

const DatatableIsecReport: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<EWalletIsecReport>[] = useMemo(
    () => [
      {
        name: t('Ngày'),
        minWidth: '130px',
        cell: (row) => {
          return (
            <div>{row?.fullDate ? dayjs(row?.fullDate).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Giá trị tạo mới (VND)'),
        right: true,
        minWidth: '180px',
        cell: (row) => {
          return <div>{numeral(row?.totalNew).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Giá trị sử dụng (VND)'),
        right: true,

        minWidth: '180px',
        cell: (row) => {
          return <div>{numeral(row?.totalUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        right: true,
        name: t('Giá trị cuối ngày (VND)'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{numeral(row?.totalISec).format('0,0') || '-'}</div>;
        },
      },
      {
        right: true,
        name: t('Giá trị khóa (VND)'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.totalLock).format('0,0') || '-'}</div>;
        },
      },
      {
        right: true,
        name: t('Số lượng tạo mới'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{numeral(row?.countNew).format('0,0') || '-'}</div>;
        },
      },
      {
        right: true,
        name: t('Số lượng sử dụng'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{numeral(row?.countUsed).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số lượng cuối ngày'),
        right: true,
        minWidth: '180px',
        cell: (row) => {
          return <div>{numeral(row?.countISec).format('0,0') || '-'}</div>;
        },
      },
      {
        right: true,
        name: t('Số lượng Khóa'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{numeral(row?.countLock).format('0,0') || '-'}</div>;
        },
      },

      {
        right: true,
        name: t('Phí (VND)'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.feeISec).format('0,0') || '-'}</div>;
        },
      },
      {
        name: t('Số GD tính hoa hồng'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.countCashback).format('0,0') || '-'}</div>;
        },
      },
      {
        right: true,
        name: t('Hoa hồng (VND)'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{numeral(row?.totalCashback).format('0,0') || '-'}</div>;
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
        hidePagination
        {...rest}
      />
    </div>
  );
};

export default memo(DatatableIsecReport);
