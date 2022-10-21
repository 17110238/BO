import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataTableCustom from '../common/Datatable/DatatableCusTom';
import formatCurrency from 'utils/helpers/formatCurrency';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  loading: boolean;
  data: any;
  handleGetSalaryAdvance: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
}

const SalaryAdvanceListDatatable: FC<Props> = ({ data, loading, handleGetSalaryAdvance }) => {
  const { t } = useTranslation('common');

  const columns = useMemo(() => {
    const cl = [
      {
        name: 'Mã giao dịch',
        sort: true,
        cell: (data: any) => {
          return <span>{data?.transaction}</span>;
        },
      },
      {
        name: 'Tên nhân viên',
        sort: true,
        cell: (data: any) => {
          return <span>{data?.fullname}</span>;
        },
      },
      {
        name: 'Doanh nghiệp',
        sort: true,
        cell: (data: any) => {
          return <span>{data?.merchantName}</span>;
        },
      },
      {
        name: 'Hạn mức ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.maxAmount)}</span>;
        },
      },
      {
        name: 'Thời gian ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{dayjs(data?.createdAt).format('DD/MM/YYYY HH:mm')}</span>;
        },
      },
      {
        name: 'Số tiền đã ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.amount)}</span>;
        },
      },
      {
        name: 'Phí ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.fee)}</span>;
        },
      },
      {
        name: 'Số tiền chưa hoàn ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.unreimbursedAmount)}</span>;
        },
      },
    ];
    return cl;
  }, [t]);
  return (
    <DataTableCustom
      isLoading={loading}
      columns={columns}
      className='data-table-custom'
      dataList={data}
      getDataList={handleGetSalaryAdvance}
      isNotHaveTotalRows
      t={t}
    />
  );
};

export default SalaryAdvanceListDatatable;
