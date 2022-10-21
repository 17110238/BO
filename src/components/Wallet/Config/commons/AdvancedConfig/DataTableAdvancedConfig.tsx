import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { GetSettingWalletAdvancePayload, SettingWalletAdvanceType } from 'models';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { PaginationChangePage } from 'react-data-table-component/dist/src/DataTable/types';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

interface Props {
  t: (a: string) => string;
  data: SettingWalletAdvanceType[];
  totalFilter: number;
  onChangePage?: PaginationChangePage;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: GetSettingWalletAdvancePayload) => void;
  };
  handleClickRow?: (data: SettingWalletAdvanceType) => React.MouseEventHandler<HTMLDivElement>;
}

const DataTableAdvancedConfig: React.FC<Props> = ({
  t,
  data,
  totalFilter,
  onChangePage,
  handleClickRow,
  getDataList,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<SettingWalletAdvanceType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '60px',
        maxWidth: '100px',
        cell: (row, index) => (
          <div className='text-highlight' onClick={handleClickRow && handleClickRow(row)}>
            {row?.id}
          </div>
        ),
      },
      {
        name: t('App ID'),
        maxWidth: '120px',
        cell: (row) => {
          return <div>{row?.appId}</div>;
        },
      },
      {
        name: t('App name'),
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row?.appName}</div>;
        },
      },
      {
        name: t('Key'),
        minWidth: '240px',
        maxWidth: '250px',
        cell: (row) => {
          return <div>{row?.key}</div>;
        },
      },
      {
        name: t('Giá trị'),
        minWidth: '300px',
        cell: (row) => {
          return row?.type?.toLowerCase() === 'json' ? (
            <ReactJson
              collapsed
              displayDataTypes={false}
              name='value'
              src={JSON.parse(row?.value?.toString() || '{}')}></ReactJson>
          ) : (
            <div>{row?.value}</div>
          );
        },
      },
      {
        name: t('Mô tả'),
        minWidth: '250px',
        maxWidth: '300px',
        justifyContent: 'flex-end',
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
        className='data-table-custom advanced-config-container__datatable'
        columns={columns}
        dataList={data}
        paginationTotalRows={totalFilter}
        t={t}
        nameDataTable='colMerchant'
        getDataList={getDataList}
        isSorting={true}
        {...rest}
      />
    </div>
  );
};

export default DataTableAdvancedConfig;
