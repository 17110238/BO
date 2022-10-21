import React, { useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { TableColumn } from 'react-data-table-component';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import { useTranslation } from 'react-i18next';
import { Scope } from 'models/scope';

interface DataTableScopeProps {
  data: Scope[];
  totalFilter: number;
  onChangeRowsPerPage?: PaginationChangeRowsPerPage;
  onChangePage?: PaginationChangePage;
  rest?: any;
  showDeleteModal: (scope: Scope) => void;
  handleGetScopeList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  showUpdateModal: (scope: Scope) => void;
  listRole: Object[];
  isLoad: boolean;
}

function DataTableScope({
  data,
  totalFilter,
  onChangeRowsPerPage,
  onChangePage,
  showDeleteModal,
  showUpdateModal,
  listRole,
  handleGetScopeList,
  isLoad,
  ...rest
}: DataTableScopeProps) {
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<Scope>[] = useMemo(
    () => [
      {
        name: t('Scope'),
        minWidth: '100px',
        maxWidth: '220px',

        cell: (row, index) => <div>{row.scope}</div>,
      },
      {
        name: t('Group'),
        minWidth: '100px',
        maxWidth: '220px',

        cell: (row, index) => (
          <div>
            {row.group &&
              row.group.map((item, scopeIndex) => {
                let matchedRole = listRole.filter((role: any) => role.key === item);
                if (matchedRole.length > 0) {
                  return matchedRole.map((role: any, index) => {
                    if (role.key === item) {
                      return <p key={index}>{t(role.description)}</p>;
                    }
                  });
                } else {
                  return <p key={scopeIndex}>{item}</p>;
                }
              })}
          </div>
        ),
      },
      {
        name: t('Service'),
        maxWidth: '100px',
        cell: (row) => {
          return <div>{row.service}</div>;
        },
      },
      {
        name: t('Description'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row.description}</div>;
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '130px',
        maxWidth: '130px',
        center: true,
        cell: (row) => {
          // return <Link className="idPayment" href='/insight/manager-merchant/detail-merchant'>Chi tiết</Link>;
          return (
            <Dropdown className='transaction-table-dropdown'>
              <Dropdown.Toggle
                className='w-100'
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)',
                }}
                id='dropdown-button-drop-up'>
                <div className='d-flex justify-content-center w-100'>
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item className='detail' onClick={() => showUpdateModal(row)}>
                  <i className='fa fa-pencil mr-2'></i>
                  {t('Cập nhật')}
                </Dropdown.Item>
                <Dropdown.Item className='danger' onClick={() => showDeleteModal(row)}>
                  <i className='fa fa-trash mr-2' aria-hidden='true'></i> {t('Remove')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [lang, listRole]
  );
  return (
    <div>
      {listRole.length > 0 && (
        <DataTableCustom
          className='data-table-custom'
          columns={columns}
          dataList={data}
          t={t}
          onChangeRowsPerPage={onChangeRowsPerPage}
          onChangePage={onChangePage}
          getDataList={handleGetScopeList}
          isLoading={isLoad}
          nameDataTable='colMerchant'
          {...rest}
        />
      )}
    </div>
  );
}

export default DataTableScope;
