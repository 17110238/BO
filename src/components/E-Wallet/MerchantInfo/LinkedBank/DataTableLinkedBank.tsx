import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { BankLinkedInput, BankLinkedObject } from 'models/merchantInfo/merchantInfoState';

interface DataTableLinkedBankProps {
  t: (a: string) => string;
  data: BankLinkedObject[];
  getDataList: (
    start?: number,
    limit?: number
  ) => {
    payload: BankLinkedInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

function DataTableLinkedBank({
  t,
  data,
  getDataList,
  setSubmitForm,
  ...rest
}: DataTableLinkedBankProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingLinkedBank
  );

  const convertState = (_state: string) => {
    const state = _state?.toLowerCase();
    switch (state) {
      case 'new':
        return 'Mới';
      case 'linked':
        return 'Đã liên kết';
      case 'locked':
        return 'Đã khóa';
      case 'unlink':
        return 'Hủy liên kết';
      case 'failed':
        return 'Thất bại';

      default:
        return state ? state.charAt(0).toUpperCase() + state?.slice(1) : state;
    }
  };

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Mã liên kết'),
        minWidth: '140px',
        maxWidth: '280px',
        cell: (row) => {
          return <div>{row?.id}</div>;
        },
      },
      {
        name: t('Ngân hàng'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.cardInfo?.bankName}</div>;
        },
      },
      {
        name: t('Số TK'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.cardInfo?.cardNumber}</div>;
        },
      },
      {
        name: t('Tên TK'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.cardInfo?.cardHolder}</div>;
        },
      },
      {
        name: t('Loại'),
        minWidth: '140px',
        cell: (row) => {
          return <div>{row?.type}</div>;
        },
      },
      {
        name: t('TG liên kết'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{dayjs(row?.linkedAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('TG GD gần nhất'),
        minWidth: '150px',
        cell: (row) => {
          return <div></div>;
        },
      },
      {
        name: t('Tổng nạp'),
        minWidth: '90px',
        right: true,
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('SL nạp'),
        minWidth: '90px',
        right: true,
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('Tổng rút'),
        minWidth: '90px',
        right: true,
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('SL rút'),
        minWidth: '90px',
        right: true,
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('Trạng thái'),
        center: true,
        minWidth: '150px',
        cell: (row) => {
          return (
            <div className={`state ${row?.state?.toLowerCase()}`}>{convertState(row?.state)}</div>
          );
        },
      },
      {
        name: t('TG yêu cầu'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{dayjs(row?.linkedAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
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

export default DataTableLinkedBank;
