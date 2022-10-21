import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import {
  BSWithdrawObject,
  EstioBillObject,
  NapasTransactionObject,
  OCBBankTransactionObject,
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
  data?: OCBBankTransactionObject[];
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

  const columns: TableColumn<OCBBankTransactionObject>[] = useMemo(
    () => [
      {
        name: t('Mã GD'),
        minWidth: '125px',
        maxWidth: '140px',
        cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
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
        name: t('Tổng'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
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
        name: t('Nội dung'),
        cell: (row) => <span>{row?.description ? row?.description : '-'}</span>,
        minWidth: '115px',
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
        name: t('Mã GD NH'),
        cell: (row) => <span>{row?.supplierTransaction ? row?.supplierTransaction : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('TG tạo'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
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
