// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { PaginationChangePage } from 'react-data-table-component/dist/src/DataTable/types';
import { TableColumn } from 'react-data-table-component';
import { MccCodeListType } from 'models';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';

interface Props {
  data: MccCodeListType[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  handleClickRow?: (data: MccCodeListType) => React.MouseEventHandler<HTMLDivElement>;
}

const DatatableTransactionValue: React.FC<Props> = ({
  data,
  handleClickRow,
  getDataList,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<MccCodeListType>[] = useMemo(
    () => [
      {
        name: t('Mã MCC'),
        minWidth: '100px',
        maxWidth: '110px',
        cell: (row, index) => (
          <div className='id-transaction-value' onClick={handleClickRow && handleClickRow(row)}>
            {row?.code}
          </div>
        ),
      },
      {
        name: t('Tên hình thức KD'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.content}</div>;
        },
      },
      {
        name: t('Tên hình thức KD (EN)'),
        minWidth: '120px',
        cell: (row) => {
          return <div>{row?.contentEN}</div>;
        },
      },
      {
        name: t('Giá trị giao dịch tối đa (VND)'),
        minWidth: '150px',
        maxWidth: '250px',
        right: true,
        justifyContent: 'flex-end',
        cell: (row) => {
          return <div>{numeral(row?.maxAmountTransaction).format('0,0')}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        className='data-table-custom box-search-transaction-value__datatable'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
        {...{ fixedHeader: true, fixedHeaderScrollHeight: '50vh', disableFixHeight: true }}
      />
    </div>
  );
};

export default DatatableTransactionValue;
