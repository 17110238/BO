import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import useWindowDimensions from 'hook/useWindowDimension';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { convertEnumtoArray } from 'utils/helpers/convertEnumtoArray';
import { EwalletAccount } from 'models';
import UpdateAlias from '../Modal/UpdateAlias';
import ConfirmAliasName from '../Modal/ConfirmAliasName';
import dayjs from 'dayjs';

interface Props {
  t: (a: string) => string;
  data: EwalletAccount[] | undefined;
  totalFilter?: number;
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
  setSubmitForm: (a: boolean) => void;
  heightBoxSearch?: number;
  rest?: any;
  isLoading: boolean;
}

const AliasName: React.FC<Props> = ({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isLoading,
  ...rest
}) => {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const changeWidthColumn = lang === 'vi' ? '200px' : '220px';

  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer
  const [showUpdateAliasModal, setShowUpdateAliasModal] = useState<boolean>(false);
  const [showRefuseModal, setShowRefuseModal] = useState<boolean>(false);

  const handleCloseRefuse = () => {
    setShowRefuseModal(false);
  };

  const handleCloseUpdate = () => {
    setShowUpdateAliasModal(false);
  };

  const UPDATE = 'UPDATE';
  const REJECT = 'REJECT';

  const [action, setAction] = useState<string>(UPDATE);
  const [aliasName, setAliasName] = useState<string>('');
  const [profiledAliasId, setProfiledAliasId] = useState<number>(0);

  const handleUpdate = (name: string | undefined, id: number | undefined) => {
    setAction(UPDATE);
    setShowUpdateAliasModal(true);
    setAliasName(name ? name : '');
    setProfiledAliasId(id ? id : 0);
  };

  const handleRefuse = (aliasName: string | undefined, id: number | undefined) => {
    setAction(REJECT);
    setShowRefuseModal(true);
    setProfiledAliasId(id ? id : 0);
    setAliasName(aliasName ? aliasName : '');
  };

  const defaultColumn = [
    t('Account ID'),
    t('App Name'),
    'Aliasname',
    t('Thời gian cập nhật'),
    t('Thao tác'),
  ];

  const columns: TableColumn<EwalletAccount>[] = useMemo(
    () => [
      {
        name: t('Account ID'),
        minWidth: '120px',
        maxWidth: '200px',
        cell: (row) => <span>{row?.id}</span>,
      },
      {
        name: t('App Name'),
        minWidth: '350px',
        maxWidth: '400px',
        cell: (row) => <span>{row?.appName || '-'}</span>,
      },
      {
        name: 'Aliasname',
        minWidth: '240px',
        maxWidth: '350px',
        cell: (row) => <span>{row?.aliasProfile?.alias || '-'}</span>,
      },
      {
        name: t('Thời gian cập nhật'),
        cell: (row) => (
          <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '280px',
        maxWidth: '280px',
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
                  {}{' '}
                  <Dropdown.Item
                    className='detail'
                    onClick={() => {
                      handleUpdate(row?.aliasProfile?.alias, row?.aliasProfile?.id);
                    }}>
                    <i className='fas fa-edit fa-lg mr-2' />
                    {t('Cập nhật')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='refund'
                    onClick={() => {
                      handleRefuse(row?.aliasProfile?.alias, row?.aliasProfile?.id);
                    }}>
                    <i className='fas fa-minus-circle fa-lg mr-2'></i>
                    {t('Từ chối AliasName')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ],
    [lang]
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
        paginationTotalRows={totalFilter}
        nameDataTable='colTransaction'
        getDataList={getDataList}
        defaultColumn={defaultColumn}
        {...rest}
      />

      <UpdateAlias
        t={t}
        show={showUpdateAliasModal}
        handleClose={handleCloseUpdate}
        action={action}
        aliasName={aliasName}
        profiledAliasId={profiledAliasId}
        handleRecall={setSubmitForm}
      />

      <ConfirmAliasName
        t={t}
        show={showRefuseModal}
        handleClose={handleCloseRefuse}
        action={action}
        aliasName={aliasName}
        profiledAliasId={profiledAliasId}
        handleRecall={setSubmitForm}
      />
    </>
  );
};

export default AliasName;
