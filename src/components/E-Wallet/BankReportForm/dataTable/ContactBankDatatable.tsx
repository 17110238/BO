import Datatable from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import { CoopBankDataType } from 'models';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';

import { useTranslation } from 'react-i18next';
interface Props {
  data: CoopBankDataType[];
}

const ContactBankDatatable: React.FC<Props> = ({ data, ...rest }) => {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const convertField = (data: string) => {
    return dayjs(data.split('/').reverse().join('-'));
  };

  const columns: TableColumn<CoopBankDataType>[] = useMemo(
    () => [
      {
        name: t('STT'),
        minWidth: '80px',
        maxWidth: '100px',
        cell: (row, index) => {
          return <div>{index + 1 || ''}</div>;
        },
      },
      {
        name: t('Tên ngân hàng'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.name || ''}</div>;
        },
      },
      {
        name: t('Ngày triển khai'),
        minWidth: '100px',
        maxWidth: '180px',
        cell: (row) => {
          return (
            <div>
              {row?.activeDate ? dayjs(convertField(row?.activeDate)).format('DD/MM/YYYY') : ''}
            </div>
          );
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
        className='border-table'
        hidePagination
        isShowDisplayRowOption={false}
        {...{ disableFixHeight: true }}></Datatable>
    </div>
  );
};

export default ContactBankDatatable;
