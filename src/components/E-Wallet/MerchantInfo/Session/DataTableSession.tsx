import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  EwalletSessionType,
  MerchantInfoState,
  SearchEwalletAccountInput,
} from 'models/merchantInfo/merchantInfoState';

interface DataTableSessionProps {
  t: (a: string) => string;
  data: EwalletSessionType[];
  getDataList: (
    start?: number,
    limit?: number
  ) => {
    payload: SearchEwalletAccountInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

function DataTableSession({ t, data, getDataList, setSubmitForm, ...rest }: DataTableSessionProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loadingSession);

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: 'ID',
        minWidth: '80px',
        cell: (row) => {
          return <div>{row?.id}</div>;
        },
      },
      {
        name: 'IP',
        minWidth: '140px',
        cell: (row) => {
          return <div>{row?.ip}</div>;
        },
      },
      {
        name: 'ID khách hàng',
        minWidth: '130px',
        cell: (row) => {
          return <div>{row?.accountId}</div>;
        },
      },
      {
        name: 'Thời gian đăng nhập',
        minWidth: '160px',
        cell: (row) => {
          return (
            <div>{row?.loginTime ? dayjs(row?.loginTime).format('HH:mm:ss DD/MM/YYYY') : null}</div>
          );
        },
      },
      {
        name: 'Thời gian đăng xuất',
        minWidth: '160px',
        cell: (row) => {
          return (
            <div>
              {row?.logoutTime ? dayjs(row?.logoutTime).format('HH:mm:ss DD/MM/YYYY') : null}
            </div>
          );
        },
      },
      {
        name: 'Nền tảng',
        minWidth: '140px',
        cell: (row) => {
          return <div>{row?.platform}</div>;
        },
      },
      {
        name: 'Client version',
        minWidth: '130px',
        cell: (row) => {
          return <div>{row?.version}</div>;
        },
      },
      {
        name: 'Client channel',
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.clientChannel}</div>;
        },
      },
      {
        name: 'Thông tin thiết bị',
        minWidth: '500px',
        cell: (row) => {
          return <div>{row?.deviceInfo}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        t={t}
        isLoading={isLoading}
        columns={columns}
        dataList={data}
        getDataList={getDataList}
        {...rest}
      />
    </div>
  );
}

export default DataTableSession;
