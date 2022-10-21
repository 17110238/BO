import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import formatCurrency from 'utils/helpers/formatCurrency';
import renderStatus from 'constants/Status';
import renderState from 'constants/State';
import useWindowDimensions from 'hook/useWindowDimension';
// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { EstioBillObject, OCBBillObject, SearchSupplierTransactionInput } from 'models';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { formatPhone } from 'utils/helpers';
dayjs.extend(utc);

interface Props {
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: SearchSupplierTransactionInput;
    getList: (payload: SearchSupplierTransactionInput) => void;
  };
  data?: OCBBillObject[] | EstioBillObject[] | [];
  setSubmitForm?: (a: boolean) => void;
  isLoading?: boolean;
}

const DataTableEwalletServiceBillReport: React.FC<Props> = ({
  getDataList,
  data,
  setSubmitForm,
  isLoading,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { height: screenHeight } = useWindowDimensions();
  //const totalFixedHeightDatatable = heightBoxSearch && (screenHeight - heightBoxSearch - 243); // 243 is total header + footer

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '100px',
        maxWidth: '180px',
        cell: (row, index) => <div>{row?.id}</div>,
      },
      {
        name: t('Mã GD'),
        minWidth: '150px',
        maxWidth: '220px',
        cell: (row, index) => <div>{row?.transaction}</div>,
      },
      {
        name: t('Phone'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatPhone(row?.accountInfo?.phone ?? '', '0')}</div>;
        },
        center: true,
      },
      {
        name: t('Giá trị GD'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatCurrency(row?.total)} đ</div>;
        },
        right: true,
      },
      {
        name: t('Phí'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.fee)} đ</div>;
        },
        right: true,
      },
      {
        name: t('Trạng thái'),
        minWidth: '170px',
        maxWidth: '250px',
        cell: (row) => {
          return (
            <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
          );
        },
        center: true,
      },
      {
        name: t('Loại GD'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{row.typeTransaction}</div>;
        },
        center: true,
      },
      {
        name: t('Nội Dung'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{row.description}</div>;
        },
        center: true,
      },
      {
        name: t('Mã GD Ngân Hàng'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{row.bankTransaction}</div>;
        },
        right: true,
      },
      {
        name: t('Tên KH'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row.customerName}</div>;
        },
        center: true,
      },
      {
        name: t('ID KH'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <span>{row?.customerId}</span>;
        },
        center: true,
      },
      {
        name: t('Supplier Code'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row.supplierCode}</div>;
        },
        center: true,
      },
      {
        name: t('Supplier Name'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row.supplierName}</div>;
        },
        center: true,
      },
      {
        name: t('TG Tạo'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
        center: true,
      },
    ],
    [lang]
  );
  return (
    <>
      <DataTableCustom
        className='data-table-custom'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colBillServiceReport'
        getDataList={getDataList}
        isSorting={true}
        isLoading={isLoading}
        {...rest}
      />
    </>
  );
};

export default DataTableEwalletServiceBillReport;
