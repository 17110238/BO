import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { GetLogInput, GetLogType, NotifyState } from 'models';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

interface DataTableHistoryProps {
  t: (a: string) => string;
  data: GetLogType[];
  getDataList: (
    start?: number,
    limit?: number
  ) => {
    payload: GetLogInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  showHistory: boolean;
  rest?: any;
}

function DataTableHistory({
  t,
  data,
  getDataList,
  setSubmitForm,
  showHistory,
  ...rest
}: DataTableHistoryProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, NotifyState>((state) => state?.notifyReducer.loading);

  const convertState = (_state: string) => {
    const state = _state?.toLowerCase();
    switch (state) {
      case 'success':
        return 'Thành công';
      case 'fail':
        return 'Thất bại';

      default:
        return state ? state.charAt(0).toUpperCase() + state?.slice(1) : state;
    }
  };

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Thời gian'),
        minWidth: '180px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Số điện thoại'),
        minWidth: '140px',
        cell: (row) => {
          return <div>{row?.phone || '-'}</div>;
        },
      },
      {
        name: t('Email'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.email || '-'}</div>;
        },
      },
      {
        name: t('Chiến dịch'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.campaign || '-'}</div>;
        },
      },
      {
        name: t('Nội dung'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.content || '-'}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        center: true,
        minWidth: '180px',
        cell: (row) => {
          return (
            <div className={row?.state === 'FAIL' ? 'state-cancel' : 'state-success'}>
              {convertState(row?.state)}
            </div>
          );
        },
      },
      {
        name: t('Ghi chú'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.description || '-'}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <>
      {showHistory && (
        <DataTableCustom
          className={`data-table-custom notify-history-table`}
          isLoading={isLoading}
          columns={columns}
          dataList={data}
          t={t}
          getDataList={getDataList}
          {...rest}
        />
      )}
    </>
  );
}

export default DataTableHistory;
