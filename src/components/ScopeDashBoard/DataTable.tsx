import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import _ from 'lodash';
import Link from 'next/link';
import { Scope } from 'models/scope';
import { Dropdown } from 'react-bootstrap';

interface Props {
  t: (a: string) => string;
  data: any[] | undefined;
  onRowSelected?: any;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  handleOpenModal: (a: string, scope: Scope) => void;
  listScopeGroup: Object[];
  rest?: any;
  isLoading: boolean;
}

const DataTable: React.FC<Props> = ({
  t,
  data,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  listScopeGroup,
  handleOpenModal,
  isLoading,
  ...rest
}) => {
  const lang: string = localStorage.getItem('NEXT_LOCALE') ?? 'vi';
  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer

  const defaultColumn = [t('Scope'), t('Group'), t('Service'), t('Description'), t('Thao tác')];

  const columns: TableColumn<Scope>[] = useMemo(
    () => [
      {
        name: t('Scope'),
        minWidth: '250px',
        maxWidth: '300px',
        cell: (row) => <span>{row?.scope}</span>,
      },
      {
        name: t('Group'),
        minWidth: '250px',
        maxWidth: '250px',
        cell: (row, index) => (
          <div>
            {row.group &&
              row.group.map((item, scopeIndex) => {
                let matchedRole = listScopeGroup.filter((role: any) => role.value === item);
                if (matchedRole.length > 0) {
                  return matchedRole.map((role: any, index) => {
                    if (role.value === item) {
                      return <p key={index}>{role.label}</p>;
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
        minWidth: '110px',
        maxWidth: '200px',
        cell: (row) => <span>{t(row?.service)}</span>,
      },
      {
        name: t('Description'),
        right: true,
        minWidth: '150px',
        maxWidth: '300px',
        cell: (row) => <span>{row?.description}</span>,
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '40px',
        cell: (row) => {
          return (
            <>
              <Dropdown className='transaction-table-dropdown'>
                <Dropdown.Toggle
                  className='p-0 w-100'
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                  id='dropdown-button-drop-up'>
                  <div className='d-flex justify-content-center w-100'>
                    <i className='fas fa-ellipsis-h m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  { }{' '}
                  <Dropdown.Item
                    className='refund'
                    onClick={() => {
                      handleOpenModal('UPDATE', row);
                    }}>
                    <i className='fas fa-edit fa-lg mr-2' />
                    {t('Cập nhật')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='danger'
                    onClick={() => {
                      handleOpenModal('DELETE', row);
                    }}>
                    <i className='fas fa-minus-circle fa-lg mr-2'></i>
                    {t('Remove')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [lang, listScopeGroup]
  );

  return (
    <>
      <DataTableCustom
        isLoading={isLoading}
        t={t}
        fixedHeader={true}
        fixedHeaderScrollHeight={`${totalFixedHeightDatatable}px`}
        columns={columns}
        dataList={data}
        className='data-table-custom cash-withdraw-table'
        nameDataTable='colTransaction'
        getDataList={getDataList}
        defaultColumn={defaultColumn}
        {...rest}
      />
    </>
  );
};

export default DataTable;
