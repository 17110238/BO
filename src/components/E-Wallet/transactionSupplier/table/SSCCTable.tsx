import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import { OCBBillObject, SSCCBillObject } from 'models';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  t: (a: string) => string;
  data?: SSCCBillObject[];
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

export default function SSCCTable({ t, data, getDataList, isLoading, ...rest }: Props) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const router = useRouter();

  const columns: TableColumn<SSCCBillObject>[] = useMemo(
    () => [
      {
        name: t('SSCC ID'),
        minWidth: '60px',
        maxWidth: '90px',
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
        name: t('Học sinh'),
        minWidth: '125px',
        cell: (row) => <span>{row?.customerName ? row?.customerName : '-'}</span>,
      },
      {
        name: t('Lớp'),
        minWidth: '125px',
        cell: (row) => <span>{row?.customerClass ? row?.customerClass : '-'}</span>,
      },
      {
        name: t('Trường'),
        minWidth: '125px',
        cell: (row) => <span>{row?.customerSchool ? row?.customerSchool : '-'}</span>,
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
