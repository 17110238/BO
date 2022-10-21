// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { PaginationChangePage } from 'react-data-table-component/dist/src/DataTable/types';
import { TableColumn } from 'react-data-table-component';
import { SupplierListType } from 'models';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface Props {
  data: SupplierListType[];
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onShowUpdateSupplier: (data: SupplierListType) => void;
}

const DataTableSupplierList: React.FC<Props> = ({
  data,
  getDataList,
  onShowUpdateSupplier,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const { t } = useTranslation('common');

  const columns: TableColumn<SupplierListType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        width: '80px',
        cell: (row) => <div>{row.id}</div>,
      },
      {
        name: t('Tên ngắn'),
        cell: (row) => <div>{row.shortName}</div>,
      },
      {
        name: t('Tên nhà cung cấp'),
        cell: (row) => <div>{row.name}</div>,
      },
      {
        name: t('Tên hiển thị'),
        cell: (row) => <div>{row.showName}</div>,
      },
      {
        name: t('Dịch vụ'),
        width: '250px',
        cell: (row) => {
          let services = row.service as string;
          return (
            <div>
              {services
                .split(',')
                .filter((item) => !!item)
                .map((item) => (
                  <span key={item} className='atbd-tag tag-info tag-transparented font-weight-bold'>
                    {item}
                  </span>
                ))}
            </div>
          );
        },
      },
      {
        name: t('Nhà phát hành'),
        width: '250px',
        cell: (row) => {
          const NPHs = row.NPH as string;
          return (
            <div>
              {NPHs.split(',')
                .filter((item) => !!item)
                .map((item) => (
                  <span
                    key={item}
                    className='atbd-tag tag-success tag-transparented font-weight-bold'>
                    {item}
                  </span>
                ))}
            </div>
          );
        },
      },
      {
        name: t('Trạng thái'),
        width: '150px',
        cell: (row) => (
          <div className=''>
            {row.isActive ? (
              <span className='issuer__status issuer__status--active'>{t('Hoạt động')}</span>
            ) : (
              <span className='issuer__status issuer__status--nonactive'>
                {t('Ngưng hoạt động')}
              </span>
            )}
          </div>
        ),
      },
      {
        name: t('Mô tả'),
        cell: (row) => <div className='bank-gateway'>{row.description}</div>,
      },
      {
        name: t('Cấu hình'),
        cell: (row) => <div className='bank-gateway'>{row.configs}</div>,
      },
      {
        name: t('TG tạo'),
        cell: (row) => (
          <div className='bank-gateway'>{dayjs(row.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>
        ),
      },
      {
        name: t('TG cập nhật'),
        cell: (row) => (
          <div className='bank-gateway'>{dayjs(row.updatedAt).format('HH:mm:ss DD/MM/YYYY')}</div>
        ),
      },
      {
        name: '',
        width: '50px',
        cell: (row) => (
          <div>
            <button className='btn' onClick={() => onShowUpdateSupplier(row)}>
              <i className='fas fa-edit' />
            </button>
          </div>
        ),
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        t={t}
        columns={columns}
        dataList={data}
        className='data-table-custom table-issuer-list'
        nameDataTable='colMerchant'
        isSorting
        getDataList={getDataList}
        {...rest}
        {...{ fixedHeader: true, fixedHeaderScrollHeight: '70vh', disableFixHeight: true }}
      />
    </div>
  );
};

export default DataTableSupplierList;
