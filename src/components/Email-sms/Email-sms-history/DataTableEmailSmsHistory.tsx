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
import { HistorySMSMerchantReposone } from 'models/emailSms/emailSms';
import useWindowDimensions from 'hook/useWindowDimension';
import renderStatus from 'constants/Status';
import renderState from 'constants/State';
import formatCurrency from 'utils/helpers/formatCurrency';

interface Props {
  dataEmailSmsHistory? : HistorySMSMerchantReposone[],
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  },
  totalFilter: number;
  heightBoxSearch?: number;
}

const DataTableEmailSmsHistory: React.FC<Props> = ({
  dataEmailSmsHistory,
  getDataList,
  totalFilter,
  heightBoxSearch
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && (screenHeight - heightBoxSearch - 243); // 243 is total header + footer

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('TG GD'),
        minWidth: '100px',
        maxWidth: '180px',

        cell: (row, index) => <div>{row?.createdAt}</div>,
      },
      {
        name: t('Mã GD'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row, index) => <div>{row?.transactionId}</div>,
      },
      {
        name: t('Mã MC'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{row?.merchantId}</div>;
        },
      },
      {
        name: t('Tên MC'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row.merChantName}</div>;
        },
      },
      {
        name: t('Email Đầu Kỳ'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.quantityEmailBefore)}</div>;
        },
        right : true
      },
      {
        name: t('Số lượng Email'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.quantityEmail)}</div>;
        },
        right : true
      },
      {
        name: t('Email cuối kỳ'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.quantityEmailAfter)}</div>;
        },
        right : true
      },
      {
        name: t('SMS Đầu Kỳ'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.quantitySMSBefore)}</div>;
        },
        right : true
      },
      {
        name: t('Số lượng SMS'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.quantitySMS)}</div>;
        },
        right : true
      },
      {
        name: t('SMS Cuối Kỳ'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.quantitySMSAfter)}</div>;
        },
        right : true
      },
      {
        name: t('Trạng thái'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <span className={`${renderStatus(row?.state)}`}>
          {t(renderState(row?.state))}
        </span>;
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
      getDataList={getDataList}
      dataList={dataEmailSmsHistory}
      paginationTotalRows={totalFilter}
      t={t}
      fixedHeader={true}
      fixedHeaderScrollHeight={`${totalFixedHeightDatatable}px`}
      nameDataTable='colEmailSmsHistory'
      // {...rest}
    />
  );
};

export default DataTableEmailSmsHistory;
