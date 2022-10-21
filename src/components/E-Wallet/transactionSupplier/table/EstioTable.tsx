import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import { EstioBillObject, OCBBillObject, SSCCBillObject } from 'models';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  t: (a: string) => string;
  data?: EstioBillObject[];
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

export default function EstioTable({ t, data, getDataList, isLoading, ...rest }: Props) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const router = useRouter();

  const columns: TableColumn<EstioBillObject>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '80px',
        maxWidth: '120px',
        cell: (row) => <span>{row?.id}</span>,
      },
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
        cell: (row) => <span>{row?.typeTransaction ? row?.typeTransaction : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('Nội dung'),
        cell: (row) => <span>{row?.description ? row?.description : '-'}</span>,
        minWidth: '115px',
      },
      {
        name: t('Mã GD ngân hàng'),
        cell: (row) => <span>{row?.bankTransaction ? row?.bankTransaction : '-'}</span>,
        minWidth: '160px',
      },
      {
        name: t('Tên KH'),
        minWidth: '125px',
        cell: (row) => <span>{row?.customerName ? row?.customerName : '-'}</span>,
      },
      {
        name: t('ID KH'),
        minWidth: '125px',
        cell: (row) => <span>{row?.customerId ? row?.customerId : '-'}</span>,
      },
      {
        name: t('Mã NCC'),
        minWidth: '125px',
        cell: (row) => <span>{row?.supplierCode ? row?.supplierCode : '-'}</span>,
      },
      {
        name: t('Tên NCC'),
        minWidth: '125px',
        cell: (row) => <span>{row?.supplierName ? row?.supplierName : '-'}</span>,
      },
      {
        name: t('TG Tạo'),
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
