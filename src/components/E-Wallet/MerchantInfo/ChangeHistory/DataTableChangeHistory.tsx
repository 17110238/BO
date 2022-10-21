import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { GetLogInput, GetLogType, NotifyState } from 'models';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { GetAccountMerchantLogInput, LogsType } from 'models/merchantInfo/merchantInfoState';

interface DataTableChangeHistoryProps {
  t: (a: string) => string;
  data: LogsType[];
  getDataList: (
    start?: number,
    limit?: number
  ) => {
    payload: GetAccountMerchantLogInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

function DataTableChangeHistory({
  t,
  data,
  getDataList,
  setSubmitForm,
  ...rest
}: DataTableChangeHistoryProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingChangeHistory
  );

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Thời gian'),
        minWidth: '180px',
        maxWidth: '280px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Người tác động'),
        minWidth: '140px',
        maxWidth: '280px',
        cell: (row) => {
          return <div>{row?.fullName}</div>;
        },
      },
      {
        name: t('Hành động'),
        minWidth: '200px',
        maxWidth: '280px',
        cell: (row) => {
          return <div>{row?.action}</div>;
        },
      },
      {
        name: t('Nội dung thay đổi'),
        minWidth: '180px',
        cell: (row) => {
          // return <div>{`{"avatar":"/2020/09/25/Kp-qoFV0w.jpg"}`}</div>;
          return (
            row?.jsonData && (
              <div
             
                dangerouslySetInnerHTML={{ __html: row?.jsonData }}></div>
            )
          );
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        isLoading={isLoading}
        columns={columns}
        dataList={data}
        t={t}
        getDataList={getDataList}
        {...rest}
      />
    </div>
  );
}

export default DataTableChangeHistory;
