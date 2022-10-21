import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import {
  BSWithdrawObject,
  EstioBillObject,
  NapasTransactionObject,
  OCBBillObject,
  PVCombankTransactionObject,
  SSCCBillObject,
} from 'models';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  t: (a: string) => string;
  data?: PVCombankTransactionObject[];
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  isLoading: boolean;
  rest?: any;
}

export default function PVCOMTable({ t, data, getDataList, isLoading, ...rest }: Props) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const router = useRouter();

  const columns: TableColumn<PVCombankTransactionObject>[] = useMemo(
    () => [
      {
        name: t('Mã GD'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
      },
      {
        name: t('Phone'),
        cell: (row) => <span>{row?.accountInfo ? row?.accountInfo?.phone : '-'}</span>,
        minWidth: '115px',
        maxWidth: '150px',
      },
      {
        name: t('Giá trị GD'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.total)} đ</span>,
        minWidth: '115px',
        maxWidth: '150px',
      },
      {
        name: t('Phí'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.fee)} đ</span>,
        minWidth: '115px',
        maxWidth: '150px',
      },
      {
        name: t('Trạng thái'),
        cell: (row) => (
          <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
        ),
        center: true,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Loại GD'),
        cell: (row) => <span>{row?.transType ? row?.transType : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('Nội dung'),
        cell: (row) => <span>{row?.content ? row?.content : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('Mã GD NCC'),
        cell: (row) => <span>{row?.supplierTransaction ? row?.supplierTransaction : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('TG GD'),
        cell: (row) => (
          <span>{row?.transTime ? dayjs(row?.transTime).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Tên ngân hàng'),
        cell: (row) => <span>{row?.bankInfo?.engName ? row?.bankInfo?.engName : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('Tài khoản ngân hàng'),
        cell: (row) => <span>{row?.bankAccount ? row?.bankAccount : '-'}</span>,
        minWidth: '160px',
      },
      {
        name: t('Mô tả'),
        cell: (row) => <span>{row?.description ? row?.description : '-'}</span>,
        minWidth: '115px',
      },
      // {
      //   name: t('Supplier response'),
      //   cell: (row) => <span>{row?.supplierResponse ? row?.supplierResponse.join() : '-'}</span>,
      //   minWidth: '115px',
      // },
      // {
      //   name: t('Supplier response'),
      //   cell: (row) => <span></span>,
      //   minWidth: '115px',
      // },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        columns={columns}
        dataList={data}
        getDataList={getDataList}
        className='data-table-custom multitransfer-campaign-table'
        nameDataTable='colGateCard'
        {...rest}
      />
    </>
  );
}
