import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from '../common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';
import { logsDataInterface } from 'models/alertlogs/getLogs';
import dayjs from 'dayjs';

interface Props {
  handleGetAlertLogs?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  alertData: logsDataInterface[];
  isLoad: boolean;
}

const DataTableAlert: FC<Props> = ({ handleGetAlertLogs, alertData, isLoad }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const columns = useMemo(() => {
    const cl = [
      {
        name: 'ID',
        cell: (data: any) => {
          return (
            <div className='customer-edit'>
              <span>{data?.id}</span>
              <a href='' className='customer-edit__icon'>
                <img src='/assets/img/customer-group/combined-shape.svg' alt='' />
              </a>
            </div>
          );
        },
        sort: true,
      },
      {
        name: 'Câu cảnh báo',
        sort: true,
        width: '400px',
        cell: (data: any) => {
          return <span>{data?.message}</span>;
        },
      },
      {
        name: 'Tags',
        sort: true,

        cell: (data: any) => {
          return <span>{data?.tags}</span>;
        },
      },
      {
        name: 'Thời gian',
        sort: true,

        cell: (data: any) => {
          return <span>{dayjs(data?.createdAt).format('DD/MM/YYYY hh:mm:ss')}</span>;
        },
      },
      {
        name: 'Nguồn',
        sort: true,

        cell: (data: any) => {
          return <span>{data?.source}</span>;
        },
      },
      {
        name: 'Loại',
        sort: true,

        cell: (data: any) => {
          return <span>{t(data?.type)}</span>;
        },
      },
    ];
    return cl;
  }, [t]);
  return (
    <DataTable
      columns={columns}
      className='data-table-custom'
      dataList={alertData}
      getDataList={handleGetAlertLogs}
      isLoading={isLoad}
      t={t}
    />
  );
};

export default DataTableAlert;
