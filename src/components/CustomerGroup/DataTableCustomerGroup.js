import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from '../common/Datatable/DatatableCusTom';
import { useTranslation } from 'react-i18next';

export default function DataTableCustomerGroup({
  isUpdateCustomerGroup,
  onEditCustomerGroup,
  dataCustomerGroup,
  paginationTotalRows,
  onChangeRowsPerPage,
  onChangePage,
  nameDataTable,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const columns = useMemo(() => {
    const cl = [
      {
        name: `${t('Customer Group Name')}`,
        cell: (data) => {
          return (
            <div className='customer-group__edit'>
              <span>{data.name}</span>
              <a
                href=''
                className='customer-group__edit--icon'
                onClick={(e) => {
                  e.preventDefault();
                  onEditCustomerGroup(data);
                }}>
                <img src='/assets/img/customer-group/combined-shape.svg' alt='' />
              </a>
            </div>
          );
        },
        sort: true,
        minWidth: '200px',
      },
      {
        name: `${t('Customer Number')}`,
        cell: (data) => data.customerQuantity,
        sort: true,
        minWidth: '200px',
      },
    ];
    return cl;
  }, [t, isUpdateCustomerGroup]);

  return (
    <DataTable
      columns={columns}
      className='data-table-custom customer-group__table'
      dataList={dataCustomerGroup}
      paginationTotalRows={paginationTotalRows}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      nameDataTable={nameDataTable}
      t={t}
      onRowClicked={onEditCustomerGroup}
    />
  );
}
