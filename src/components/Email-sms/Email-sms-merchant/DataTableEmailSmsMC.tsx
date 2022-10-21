import React, { useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useRouter } from 'next/router';
import { TableColumn } from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useTranslation } from 'react-i18next';
import { MerChantResponse } from 'models/emailSms/emailSms';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  dataEmailSmsMerchant?: MerChantResponse[],
  totalFilter: number;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
}

const data: [any] = [
  {
    merchant: 'Ivantime',
    email: 100,
    sms: 100,
    createdAt: '04/11/2021 02:24:57',
    updatedAt: '17/11/2021 02:01:05',
  },
];

const DataTableEmailSmsMC: React.FC<Props> = ({
  dataEmailSmsMerchant,
  getDataList,
  totalFilter
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Merchant'),
        minWidth: '200px',
        maxWidth: '450px',
        cell: (row, index) => <div>{row.merChantName}</div>,
      },
      {
        name: t('Số lượng Email'),
        minWidth: '130px',
        maxWidth: '100px',
        cell: (row, index) => <div>{formatCurrency(row.mail)}</div>,
        right : true
      },
      {
        name: t('Số lượng Sms'),
        minWidth: '130px',
        maxWidth: '100px',
        cell: (row) => {
          return <div>{formatCurrency(row.sms)}</div>;
        },
        right : true
      },
      {
        name: t('TG tạo'),
        minWidth: '200px',
        maxWidth: '400px',
        cell: (row) => {
          return <div>{row.createdAt}</div>;
        },
        center : true
      },
      {
        name: t('TG cập nhập'),
        minWidth: '200px',
        maxWidth: '400px',
        cell: (row) => {
          return <div>{row.updatedAt}</div>;
        },
        center : true
      }
    ],
    [lang]
  );

  return (
    <DataTableCustom
      className='data-table-custom'
      columns={columns}
      dataList={dataEmailSmsMerchant}
      paginationTotalRows={totalFilter}
      t={t}
      getDataList={getDataList}
      // onChangeRowsPerPage={onChangeRowsPerPage}
      // onChangePage={onChangePage}
      nameDataTable='colEmailSmsMC'
      // {...rest}
    />
  );
};

export default DataTableEmailSmsMC;
