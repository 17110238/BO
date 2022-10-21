import { PayintType } from 'models/payint';
import React, { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import formatCurrency from 'utils/helpers/formatCurrency';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';

interface Props {
  data: object[];
  totalPayin: number;
  getDataList?: (start?: number, limit?: number, sort?: {}, campaign?: string) => {
    payload: any,
    getList: (payload: any) => void
  };
}

const DatatableTransfer: FC<Props> = ({ data, totalPayin, getDataList, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<PayintType>[] = useMemo(
    () => [
      {
        name: t('STT'),
        minWidth: '220px',
        cell: (row, index) => <div>{row.description}</div>,
      },
      {
        name: t('Tên người nhận'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{t(row.paymentMethod)}</div>;
        },
      },
      {
        name: t('Số tài khoản'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.amount)} đ</div>;
        },
      },
      {
        name: t('Nội dung'),
        cell: (row) => {
          return (
            <div>
              {row.state}
            </div>
          );
        },
      },
      {
        name: t('Trạng thái tài khoản'),
        cell: (row) => {
          return (
            <div>
              {row.state}
            </div>
          );
        },
      },
      {
        name: t('Số tiền'),
        right: true,
        cell: (row) => {
          return (
            <div>
              <span>{formatCurrency(100000000)} đ</span>
            </div>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <>
      <DataTableCustom
        className='datatable-transfer'
        isShowDisplayRowOption={false}
        paginationTotalRows={totalPayin}
        getDataList={getDataList}
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        {...rest}
      />
    </>
  );
};

export default DatatableTransfer;
