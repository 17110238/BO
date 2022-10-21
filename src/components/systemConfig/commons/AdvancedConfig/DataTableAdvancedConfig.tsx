// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { PayloadGetSettingSystem, SettingSystemType } from 'models';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

interface Props {
  data: SettingSystemType[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: PayloadGetSettingSystem) => void;
  };
  handleClickRow?: (data: SettingSystemType) => React.MouseEventHandler<HTMLDivElement>;
}

const DataTableAdvancedConfig: React.FC<Props> = ({
  data,
  handleClickRow,
  getDataList,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');
  const columns: TableColumn<SettingSystemType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '60px',
        maxWidth: '70px',
        cell: (row, index) => (
          <div className='text-highlight' onClick={handleClickRow && handleClickRow(row)}>
            {row?.id}
          </div>
        ),
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
              src={JSON.parse(row?.value || '{}')}></ReactJson>
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
