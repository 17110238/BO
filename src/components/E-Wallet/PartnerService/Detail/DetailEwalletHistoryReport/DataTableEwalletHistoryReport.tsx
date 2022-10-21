import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import formatCurrency from 'utils/helpers/formatCurrency';
import renderStatus from 'constants/Status';
import renderState from 'constants/State';
import useWindowDimensions from 'hook/useWindowDimension';
// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { formatPhone } from 'utils/helpers';
import {
  EWalletTransactionBO,
  SearchEWalletTransactionInput,
  SearchSupplierTransactionInput,
} from 'models';
dayjs.extend(utc);

interface Props {
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: SearchEWalletTransactionInput;
    getList: (payload: SearchEWalletTransactionInput) => void;
  };
  data?: EWalletTransactionBO[] | [];
  isLoading?: boolean;
}

const DataTableEwalletHistoryReport: React.FC<Props> = ({
  getDataList,
  data,
  isLoading,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { height: screenHeight } = useWindowDimensions();

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Mã GD'),
        minWidth: '100px',
        maxWidth: '180px',
        cell: (row, index) => <div>{row?.transactionId}</div>,
      },
      {
        name: t('Phone'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatPhone(row?.phone ?? '', '0')}</div>;
        },
        center: true,
      },
      {
        name: t('Giá trị GD'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatCurrency(row?.amount)} đ</div>;
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
        name: t('Giá Trị Sau Phí'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{formatCurrency(row.total)} đ</div>;
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
        name: t('TG Tạo'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
        center: true,
      },
      {
        name: t('TG Hoàn Thành'),
        minWidth: '200px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
        center: true,
      },
      {
        name: t('Nội Dung'),
        minWidth: '250px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{row.description}</div>;
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
        nameDataTable='colHistoryReport'
        getDataList={getDataList}
        isSorting={true}
        isLoading={isLoading}
        {...rest}
      />
    </>
  );
};

export default DataTableEwalletHistoryReport;
