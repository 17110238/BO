import dayjs from 'dayjs';
import { AccountMerchant, UpdateAccMcInput } from 'models/account/accountMerchant';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { formatPhone } from 'utils/helpers';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccountMc } from 'redux/actions';

interface DataTableAccountProps {
  t: (a: string) => string;
  data: AccountMerchant[] | undefined;
  totalFilter: number;
  onChangeRowsPerPage?: () => void;
  onChangePage?: () => void;
  handleToggleModalDetail?: () => void;
  rest?: any;
}
interface CheckUpdateInfo {
  accountId?: boolean;
  username?: boolean;
}

interface UpdateAccountMc {
  AccountMcUpdate?: UpdateAccMcInput;
}

export default function DataTableAccount({
  t,
  data,
  totalFilter,
  onChangeRowsPerPage,
  onChangePage,
  handleToggleModalDetail,
  ...rest
}: DataTableAccountProps) {
  const router = useRouter();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const dispatch = useDispatch();

  const [AccountMcUpdate, setAccountMcUpdate] = useState<UpdateAccMcInput>({
    accountId: null,
    password: null,
    fullname: null,
    phone: null,
    email: null,
    isActive: null,
    // role?: string
  });

  const columns: TableColumn<AccountMerchant>[] = useMemo(() => {
    return [
      {
        name: t('ID'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row, index) => {
          return <span>{row?.accountId}</span>;
        },
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '180px',
        cell: (row) => {
          return (
            <input
              type='text'
              defaultValue={row?.username}
              name='fullname'
              readOnly
              onChange={(e) => {
                const { name, value } = e.target;
                setAccountMcUpdate({
                  ...AccountMcUpdate,
                  [name]: value,
                });
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  //event.preventDefault()
                  // console.log('Account mc update', AccountMcUpdate);
                  alert('hello');
                  dispatch(
                    updateAccountMc(AccountMcUpdate, (status, res) => {
                      console.log('status', status);
                      console.log('res', res);
                    })
                  );
                }
              }}
              onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                target.removeAttribute('readonly');
              }}
            />
          );
        },
      },
      {
        name: t('Phone'),
        minWidth: '180px',
        cell: (row) => {
          return (
            <input
              type='text'
              defaultValue={formatPhone(row?.phone ?? '', '0')}
              readOnly
              // onChange={(e) => {

              // }}
              onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                target.removeAttribute('readonly');
              }}
            />
          );
        },
      },
      {
        name: t('Email'),
        minWidth: '250px',
        cell: (row) => {
          return (
            <input
              type='text'
              defaultValue={row?.email}
              readOnly
              // onChange={(e) => {

              // }}
              onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                target.removeAttribute('readonly');
              }}
            />
          );
        },
      },
      {
        name: t('Thông tin đinh danh'),
        minWidth: '180px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <input
              type='text'
              defaultValue={row?.merchantName}
              readOnly
              // onChange={(e) => {

              // }}
              onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                target.removeAttribute('readonly');
              }}
            />
          );
        },
      },
      {
        name: t('Thời gian tạo'),
        minWidth: '180px',
        maxWidth: '200px',

        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Thời gian đăng nhập'),
        minWidth: '180px',
        maxWidth: '200px',

        cell: (row) => {
          return <div>{dayjs(row?.lastedLoginAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Trạng thái'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row) => {
          return (
            <label className='switch'>
              <input
                type='checkbox'
                checked={row?.isActive}
                // onChange={(e) => {}}
              />
              <span className='slider around' />
            </label>
          );
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '130px',
        maxWidth: '130px',
        cell: (row) => {
          return (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  className={'p-0'}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                  }}
                  id='dropdown-button-drop-up'>
                  <div className='btn btn-dropdown  pr-0'>
                    <label>{t('Thao tác')}</label>
                    <div className=' ml-2'>
                      <i className='fas fa-caret-down'></i>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item>{t('Đổi mật khẩu')}</Dropdown.Item>
                  <Dropdown.Item>{t('Khoá mở tài khoản')}</Dropdown.Item>
                  <Dropdown.Item>{t('Mật khẩu tạm')}</Dropdown.Item>
                  <Dropdown.Item>{t('Cập nhập scope')}</Dropdown.Item>
                  <Dropdown.Item onClick={handleToggleModalDetail}>{t('Cập nhập')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          );
        },
      },
    ];
  }, [lang]);
  return (
    <DataTableCustom
      className='data-table-custom'
      columns={columns}
      dataList={data}
      paginationTotalRows={totalFilter}
      t={t}
      // onRowSelected={(row: MerchantAccount) => {
      //     router.push(`/ctt/merchants/${row.merchantId}`);
      // }}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      nameDataTable='colAccountMerchant'
      {...rest}
    />
  );
}
