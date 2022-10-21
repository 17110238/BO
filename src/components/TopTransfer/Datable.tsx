import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import DataTableCustom from '../common/Datatable/DatatableCusTom';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  loading: boolean;
  data: any[];
}

const TopTransferDatatable: FC<Props> = ({ data, loading }) => {
  const { t } = useTranslation('common');

  const columns = useMemo(() => {
    const cl = [
      {
        name: 'Tên đối tác',
        cell: (data: any) => {
          return <span>{data?.title}</span>;
        },
        sort: true,
      },
      {
        name: 'Ngành nghề',
        sort: true,
        cell: (data: any) => {
          return <span>{data?.category}</span>;
        },
      },
      {
        name: 'Số GD',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.count)}</span>;
        },
      },
      {
        name: 'Giá trị',
        sort: true,
        right: true,
        cell: (data: any) => {
          return <span>{formatCurrency(data?.amount)}</span>;
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
      isNotHaveTotalRows={true}
      isGetAllData
      isShowDisplayRowOption={false}
      t={t}
    />
  );
};

export default TopTransferDatatable;
