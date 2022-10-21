import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  handleGetEwalletServiceItemReport?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  loading: boolean;
  data: any;
}

const ReportEwalletServiceItemDatatable: FC<Props> = ({
  handleGetEwalletServiceItemReport,
  data,
  loading,
}) => {
  const { t } = useTranslation('common');

  const columns = useMemo(() => {
    const cl = [
      {
        name: 'Tên dịch vụ',
        sort: true,
        left: true,
        cell: (data: any) => {
          return <span>{data?.serviceName}</span>;
        },
      },
      {
        name: 'Số lượng giao dịch',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.totalTransaction)}</span>;
        },
      },
      {
        name: 'Tổng thanh toán',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.totalAmount)}</span>;
        },
      },
      {
        name: 'Phương thức thanh toán',
        left: true,
        sort: true,
        cell: (data: any) => {
          return <span>{data?.payment}</span>;
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
      isGetAllData
      getDataList={handleGetEwalletServiceItemReport}
      t={t}
    />
  );
};

export default ReportEwalletServiceItemDatatable;
