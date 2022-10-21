import Datatable from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { topCountAmountType } from 'models';
import numeral from 'numeral';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';

import { useTranslation } from 'react-i18next';
interface Props {
  data: topCountAmountType[];
}

const Top5MerchantValueTransactionDatatable: React.FC<Props> = ({ data, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const convertField = (data: string) => {
    return dayjs(data.split('/').reverse().join('-'));
  };

  const columns: TableColumn<topCountAmountType>[] = useMemo(
    () => [
      {
        name: t(''),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row, index) => {
          return <div>{index + 1 || ''}</div>;
        },
      },
      {
        name: t('Tên đơn vị'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.name || ''}</div>;
        },
      },
      {
        name: t('Lĩnh vực hoạt động'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.industryCode || ''}</div>;
        },
      },
      {
        name: t('Số ĐKKD'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.identifyCode || ''}</div>;
        },
      },
      {
        name: t('Số lượng giao dịch'),
        minWidth: '150px',
        right: true,
        cell: (row) => {
          return <div>{row?.count || ''}</div>;
        },
      },
      {
        name: t('Giá trị giao dịch'),
        minWidth: '150px',
        right: true,
        cell: (row) => {
          return <div>{numeral(row?.value).format('0,0') || ''}</div>;
        },
      },
    ],

    [lang]
  );

  return (
    <div className='w-100 '>
      <Datatable
        t={t}
        columns={columns}
        dataList={data || []}
        isSorting={true}
        fixedHeader={true}
        hidePagination
        className='border-table'
        isShowDisplayRowOption={false}
        {...{ disableFixHeight: true }}></Datatable>
    </div>
  );
};

export default Top5MerchantValueTransactionDatatable;
