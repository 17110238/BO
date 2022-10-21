import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from '../common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
export default function DataTableCustomer({
  onEditCustomer,
  onDeleteCustomer,
  dataCustomer,
  paginationTotalRows,
  onChangeRowsPerPage,
  onChangePage,
  nameDataTable,
  isUpdateCustomer,
  updateStatusCustomer,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const columns = useMemo(() => {
    const cl = [
      {
        name: `${t('Customer Index')}`,
        cell: (data) => {
          return (
            <div className='customer-edit'>
              <span>{data.index > 9 ? data.index : `0${data.index}`}</span>
              <a
                href=''
                className='customer-edit__icon'
                onClick={(e) => {
                  if (isUpdateCustomer) {
                    e.preventDefault();
                    onEditCustomer(data);
                  }
                }}>
                <img src='/assets/img/customer-group/combined-shape.svg' alt='' />
              </a>
            </div>
          );
        },
        sort: true,
        width: '100px',
      },
      {
        name: `${t('Customer Id')}`,
        sort: true,
        width: '130px',
        cell: (data) => {
          return <span>{data?.id}</span>;
        },
      },
      {
        name: `${t('Customer Name')}`,
        cell: (data) => data?.name,
        sort: true,
        minWidth: '200px',
      },
      {
        name: `${t('Email')}`,
        cell: (data) => data?.email,
        sort: true,
        minWidth: '200px',
      },
      {
        name: `${t('Contact Number')}`,
        cell: (data) => data?.number,
        sort: true,
        minWidth: '150px',
      },
      {
        name: `${t('Shipping address')}`,
        cell: (data) => data?.location,
        sort: true,
        minWidth: '250px',
      },
      {
        name: `${t('Customer Group')}`,
        cell: (data) => (data?.customerGroupName ? data.customerGroupName : ''),
        sort: true,
        minWidth: '250px',
      },
      {
        name: `${t('Customer Status')}`,
        cell: (data) => {
          return (
            <div className='customer-status'>
              <label className='customer-switch'>
                <input
                  type='checkbox'
                  defaultChecked={data.isActive}
                  onClick={() => {
                    updateStatusCustomer(data);
                  }}
                />
                <span className='customer-switch__slider round'></span>
              </label>
            </div>
          );
        },
        sort: true,
        maxWidth: '100px',
      },
    ];
    return cl;
  }, [t, isUpdateCustomer]);
  return (
    <DataTable
      columns={columns}
      className='data-table-custom'
      dataList={dataCustomer}
      paginationTotalRows={paginationTotalRows}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      nameDataTable={nameDataTable}
      onRowClicked={(data) => {
        if (isUpdateCustomer) {
          onEditCustomer(data);
        }
      }}
      t={t}
    />
  );
}
