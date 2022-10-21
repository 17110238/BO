import React, { useMemo } from 'react';
// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';
import { TableColumn } from 'react-data-table-component';
import dayjs from 'dayjs';
import { LogKYCWallet, PayloadLogKYCWallet } from 'models';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
interface Props {
  data: LogKYCWallet[];
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: PayloadLogKYCWallet;
    getList: (payload: PayloadLogKYCWallet) => void;
  };
}

const DatatableHistoryKYC: React.FC<Props> = ({ data, getDataList, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<LogKYCWallet>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '100px',
        maxWidth: '120px',
        cell: (row) => {
          return <div className='highlight-text'>{row?.internalAccountId || '-'}</div>;
        },
      },
      {
        name: t('Thời gian'),
        minWidth: '100px',
        maxWidth: '110px',
        cell: (row) => {
          return (
            <div>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Hành động'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{row?.action || '-'}</div>;
        },
      },
      {
        name: t('Admin'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => {
          return <div>{row?.fullName || '-'}</div>;
        },
      },
      {
        name: t('Mô tả'),
        minWidth: '300px',
        cell: (row) => {
          // try {
          //   return (
          //     <ReactJson
          //       collapsed
          //       displayDataTypes={false}
          //       name='value'
          //       src={JSON.parse(row?.jsonData || '{}')}></ReactJson>
          //   );
          // } catch (error) {
          //   return <div>{row?.jsonData}</div>;
          // }
          return row?.jsonData && <div dangerouslySetInnerHTML={{ __html: row?.jsonData }}></div>;
        },
      },
    ],

    [lang]
  );

  return (
    <div>
      <DataTableCustom
        dataList={data}
        columns={columns}
        t={t}
        nameDataTable='colApprovalMerchant'
        className='approval-merchant-table'
        getDataList={getDataList}
        isSorting
        fixedHeader
        {...rest}
      />
    </div>
  );
};

export default DatatableHistoryKYC;
