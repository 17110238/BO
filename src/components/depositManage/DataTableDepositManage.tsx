import React, { useMemo } from 'react';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { TableColumn } from 'react-data-table-component';
import numeral from 'numeral';
import { PayloadSearchDeposit, SettingDeposit } from 'models';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface Props {
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadSearchDeposit;
    getList: (payload: PayloadSearchDeposit) => void;
  };
  data: SettingDeposit[] | [];
  onClickRow: (data: SettingDeposit) => React.MouseEventHandler<HTMLDivElement>;
}

const DataTableDepositManage: React.FC<Props> = ({ onClickRow, getDataList, data, ...rest }) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<SettingDeposit>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '100px',
        maxWidth: '110px',
        cell: (row, index) => (
          <div className='highlight-text' onClick={onClickRow(row)}>
            {row?.id}
          </div>
        ),
      },
      {
        name: t('Tên đối tác'),
        minWidth: '80px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row?.merchantName}</div>;
        },
      },
      {
        name: t('Merchant ID'),
        minWidth: '100px',
        maxWidth: '110px',
        cell: (row) => {
          return <div>{row?.merchantId}</div>;
        },
      },
      {
        name: t('Số ngày tính doanh thu (Ngày)'),
        minWidth: '200px',
        maxWidth: '220px',
        right: true,
        cell: (row) => {
          return <div>{row?.sumBalanceDay || '-'}</div>;
        },
      },
      {
        name: t('Phần trăm tạm giữ (%)'),
        minWidth: '170px',
        maxWidth: '170px',
        right: true,
        cell: (row, index) => <div>{row?.minBalanceRate || '-'}</div>,
      },
      {
        name: t('Ký quỹ (VND)'),
        minWidth: '170px',
        maxWidth: '180px',
        right: true,
        cell: (row) => {
          return (
            <div>{row?.minBalanceAmount ? numeral(row?.minBalanceAmount).format('0,0') : '-'} </div>
          );
        },
      },
      {
        name: t('Diễn giải'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.description}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        className='data-table-custom deposit-manage__datatable'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
      />
    </div>
  );
};

export default DataTableDepositManage;
