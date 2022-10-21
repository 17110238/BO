import React, { useMemo } from 'react';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { formatPhone } from 'utils/helpers';
import { GateCardObject, GateTopUpObject, SearchSupplierTransactionInput } from 'models';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from 'hook/useWindowDimension';
import formatCurrency from 'utils/helpers/formatCurrency';
import { TableColumn } from 'react-data-table-component';
import renderStatus from 'constants/Status';
import renderState from 'constants/State';
// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
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
  data?: GateTopUpObject[] | GateCardObject[] | [];
  isLoading?: boolean;
}

const DataTableEwalletGateReport: React.FC<Props> = ({ getDataList, data, isLoading, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { height: screenHeight } = useWindowDimensions();

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
        name: t('Discount'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row?.discount)} đ</div>;
        },
        right: true,
      },
      {
        name: t('Cashback'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row) => {
          return <div>{formatCurrency(row?.Cashback)} đ</div>;
        },
        right: true,
      },
      {
        name: t('Trạng Thái'),
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
        name: t('Nhà Cung Cấp'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row.supplier}</div>;
        },
        center: true,
      },
      {
        name: t('Nội dung'),
        minWidth: '250px',
        maxWidth: '300px',
        cell: (row) => {
          return <div>{row.description}</div>;
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
        nameDataTable='colGateReport'
        getDataList={getDataList}
        isSorting={true}
        isLoading={isLoading}
        {...rest}
      />
    </>
  );
};

export default DataTableEwalletGateReport;
