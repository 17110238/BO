import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import DataTableCustom from '../common/Datatable/DatatableCusTom';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  loading: boolean;
  data: any;
  handleGetReportSalaryAdvance: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
}

const SalaryAdvanceReportDatatable: FC<Props> = ({
  data,
  loading,
  handleGetReportSalaryAdvance,
}) => {
  const { t } = useTranslation('common');

  const columns = useMemo(() => {
    const cl = [
      // {
      //   name: 'STT',
      //   center: true,
      //   cell: (data: any) => {
      //     return <span>{data?.id}</span>;
      //   },
      //   sort: true,
      // },
      {
        name: 'Tên doanh nghiệp',
        sort: true,
        cell: (data: any) => {
          return <span>{data?.merchantName}</span>;
        },
      },
      {
        name: 'Số nhân viên ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.advanceSalaryStaffNumber)}</span>;
        },
      },
      {
        name: 'Số nhân viên chưa hoàn ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{data?.unreimbursedStaffNumber}</span>;
        },
      },
      {
        name: 'Số tiền đã ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.amountTotal)}</span>;
        },
      },
      {
        name: 'Số tiền hoàn ứng',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.reimbursedAmount)}</span>;
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
      getDataList={handleGetReportSalaryAdvance}
      dataList={data}
      isNotHaveTotalRows={true}
      t={t}
    />
  );
};

export default SalaryAdvanceReportDatatable;
