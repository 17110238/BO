import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { ActionLogAccMc, LogsType } from 'models';
import { AccountMerchant } from 'models/account/accountMerchant';
import dayjs from 'dayjs';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useSelector } from 'react-redux';

interface Props {
  t: (a: string) => string;
  // data: ActionLogAccMc[] | undefined[];
  data: Array<LogsType | undefined>;
  totalFilter?: number;
  onChangeRowsPerPage?: PaginationChangeRowsPerPage;
  onChangePage?: PaginationChangePage;
  getListLogs?: any;
  rest?: any;
}

const HistoryChangeAccountMc: React.FC<Props> = ({
  t,
  totalFilter,
  data,
  onChangeRowsPerPage,
  onChangePage,
  getListLogs,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const loading = useSelector<any, boolean>((state) => state?.AccountMerchant?.loading);
  const columns: TableColumn<LogsType>[] = useMemo(
    () => [
      {
        name: t('TG tạo'),
        minWidth: '150px',
        maxWidth: '180px',
        cell: (row, index) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '150px',
        maxWidth: '220px',
        cell: (row) => {
          return <span>{row?.userName}</span>;
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '180px',
        maxWidth: '300px',
        cell: (row) => {
          return <div>{row?.action}</div>;
        },
      },
      {
        name: t('Nội dung thay đổi'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{JSON.parse(row.jsonData ? row.jsonData : '').input.description}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <DataTableCustom
      isLoading={loading}
      className='data-table-custom my-5'
      columns={columns}
      dataList={data.length > 0 ? data : []}
      paginationTotalRows={totalFilter}
      getDataList={getListLogs}
      t={t}
      nameDataTable='colHistoryChangeAcMc'
      {...rest}
    />
  );
};

export default HistoryChangeAccountMc;
