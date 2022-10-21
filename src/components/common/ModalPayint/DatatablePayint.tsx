import { PayintType } from 'models/payint';
import React, { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import formatCurrency from 'utils/helpers/formatCurrency';
import DataTableCustom from '../Datatable/DatatableCusTom';

interface Props {
  data: object[];
  totalPayin:number;
  getDataList?: (start?: number, limit?: number, sort?:{}, campaign?: string) => {
    payload: any,
    getList: (payload: any) => void
  };
}

const DatatablePayint: FC<Props> = ({ data,totalPayin,getDataList, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<PayintType>[] = useMemo(
    () => [
      {
        name: t('Mô tả'),
        minWidth: '220px',
        left: true,
        cell: (row, index) => <div>{row.description}</div>,
      },
      {
        name: t('Phương thức'),
        minWidth: '120px',
        center: true,
        cell: (row) => {
          return <div>{t(row.paymentMethod)}</div>;
        },
      },
      {
        name: t('Số tiền'),
        right:true ,
        minWidth: '120px',
        cell: (row) => {
          return <div>{formatCurrency(row.amount)} đ</div>;
        },
      },
      {
        name: t('Trạng thái'),
        center: true,
        cell: (row) => {
          return (
            <div>
              {row.state}
            </div>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        className='data-table-custom'
        isShowDisplayRowOption={false}
        paginationTotalRows={totalPayin}
        getDataList={getDataList}
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        {...rest}
      />
    </div>
  );
};

export default DatatablePayint;
