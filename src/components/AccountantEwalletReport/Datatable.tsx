import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from '../common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';
import { logsDataInterface } from 'models/alertlogs/getLogs';
import dayjs from 'dayjs';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  data: any;
  isLoad?: boolean;
}

const DataTableEwalletReport: FC<Props> = ({ data, isLoad }) => {
  const { t } = useTranslation('common');
  const columns = useMemo(() => {
    const cl = [
      {
        name: 'Số dư đầu',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.beforeBalance)}</div>;
        },
        sort: true,
      },
      {
        name: 'Nạp',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.deposit)}</div>;
        },
        sort: true,
      },
      {
        name: 'Rút',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.withdraw)}</div>;
        },
        sort: true,
      },
      {
        name: 'Rút (Link)',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.withdrawSocial)}</div>;
        },
        sort: true,
      },
      {
        name: 'Sử dụng',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.payment)}</div>;
        },
        sort: true,
      },
      {
        name: 'Tặng',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.transfer)}</div>;
        },
        sort: true,
      },
      {
        name: 'Nhận',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.receive)}</div>;
        },
        sort: true,
      },
      {
        name: 'Số dư cuối',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.afterBalance)}</div>;
        },
        sort: true,
      },
      {
        name: 'Check',
        right: true,
        cell: (data: any) => {
          return <div>{formatCurrency(data.checkSum)}</div>;
        },
        sort: true,
      },
    ];
    return cl;
  }, [t]);

  return (
    <DataTable
      columns={columns}
      className='data-table-custom'
      dataList={Object.keys(data).length > 0 ? [data] : []}
      isLoading={isLoad}
      isGetAllData
      t={t}
    />
  );
};

export default DataTableEwalletReport;
