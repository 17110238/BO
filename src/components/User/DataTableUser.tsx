import dayjs from 'dayjs';
import { AccountMerchant } from 'models/account/accountMerchant';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatPhone } from 'utils/helpers';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { deleteUser } from 'redux/actions';
interface DataTableAccountProps {
  t: (a: string) => string;
  data: AccountMerchant[];
  totalFilter: number;
  loading: boolean;
  onRowSelected?: () => void;
  deleteDefault?: boolean;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onChangeActiveUser: (e: any, data: any) => void;
  handleDeleteUser?: (id : number) => void
  rest?: any;
}
interface FormLoginSubmit {
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role: string[];
  group?: string[] | any;
  scope: string[];
}
interface Role {
  key?: string;
  name?: string;
}
[];
export default function DataTableAccount({
  t,
  data,
  totalFilter,
  onChangeActiveUser,
  getDataList,
  loading,
  handleDeleteUser,
  ...rest
}: DataTableAccountProps) {
  const router = useRouter();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [checkIsActive, setCheckIsActive] = useState<Boolean>(false);
  const ListRole = useSelector<any, Role[]>((state) => state.authReducers?.listRole) || [];
  const handChange = () => {
    setCheckIsActive(!checkIsActive);
  };
  let object: any = {};
  useEffect(() => {
    ListRole.map((obj: any, index) => {
      object[obj?.key] = obj;
    });
  }, []);

  let objectFormat = useMemo(() => {
    return object;
  }, [ListRole]);

  const columns: TableColumn<AccountMerchant>[] = useMemo(
    () => [
      // {
      //   name: t('ID'),
      //   minWidth: '50px',
      //   maxWidth: '120px',
      //   cell: (row, index) => <div className='position-relative w-100'>{index}</div>,
      // },
      {
        name: t('Họ tên'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.fullname}</div>;
        },
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.username}</div>;
        },
      },

      {
        name: t('Email'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.email}</div>;
        },
      },
      {
        name: t('Số điện thoại'),
        minWidth: '110px',
        cell: (row) => {
          return <div>{formatPhone(row?.phone ?? '', '0')}</div>;
        },
      },
      {
        name: t('Chức vụ'),
        minWidth: '110px',
        cell: (row) => {
          let index: string = row.group[0];
          return <div>{objectFormat?.[index]?.description || ''} </div>;
        },
      },

      {
        name: t('Ngày tạo'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      // {
      //   name: t('Bảo mật số liệu'),
      //   minWidth: '120px',
      //   maxWidth: '150px',

      //   cell: (row) => {
      //     return <div>{''}</div>;
      //   },
      // },
      // {
      //   name: t('Linked'),
      //   minWidth: '120px',
      //   maxWidth: '150px',

      //   cell: (row) => {
      //     return <div>{''}</div>;
      //   },
      // },
      // {
      //   name: t('Xác thực OTP'),
      //   minWidth: '120px',
      //   maxWidth: '150px',

      //   cell: (row) => {
      //     return <div>{''}</div>;
      //   },
      // },
      {
        name: t('Trạng thái'),
        minWidth: '100px',
        maxWidth: '130px',
        center: true,
        cell: (row) => {
          return (
            <div className='form-group form-input-checkbox' style={{ margin: '0px' }}>
              <input placeholder='checkbox' hidden />
              <label className='switch' style={{ margin: '0px' }}>
                <input
                  type='checkbox'
                  name='isActive'
                  onChange={(e) => onChangeActiveUser(e, row.id)}
                  defaultChecked={row?.isActive}
                />
                <span className='slider around' />
              </label>
            </div>
          );
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '80px',
        maxWidth: '100px',
        center: true,
        cell: (row) => {
          return (
            // <>
            //   {row.group?.length == 1 && row?.group[0] ? (
            //     <Link href={`/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat/${row?.id}`} passHref>
            //       <div className='d-flex justify-content-center w-100 edit__comtent'>
            //         <button className=''>
            //           <i className='fas fa-edit fa-lg edit__icon text-muted'></i>
            //         </button>
            //       </div>
            //     </Link>
            //   ) : (
            //     <Link href={`/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat-theo-quyen/${row?.id}`} passHref>
            //       <div className='d-flex justify-content-center w-100 edit__comtent'>
            //         <button className=''>
            //           <i className='fas fa-edit fa-lg edit__icon text-muted'></i>
            //         </button>
            //       </div>
            //     </Link>
            //   )}
            // </>
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
                {row.group?.length == 1 && row?.group[0] ? (
                  <Link href={`/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat/${row?.id}`} passHref>
                    <div className='edit__comtent'>
                      <button className=''>
                        <i className='fas fa-edit fa-lg edit__icon text-muted mr-2'></i>
                        <span>{t('Cập nhật')}</span>
                      </button>
                    </div>
                  </Link>
                ) : (
                  <Link href={`/cong-thanh-toan/quan-ly-nguoi-dung/cap-nhat-theo-quyen/${row?.id}`} passHref>
                    <div className='edit__comtent'>
                      <button className=''>
                        <i className='fas fa-edit fa-lg edit__icon text-muted mr-2'></i>
                        <span>{t('Cập nhật')}</span>
                      </button>
                    </div>
                  </Link>
                )}
                <Dropdown.Item className='danger' onClick={() => handleDeleteUser && handleDeleteUser(+row?.id!)}>
                  <i className='fa fa-trash mr-2' aria-hidden='true'></i> {t('Remove')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [lang, data]
  );
  return (
    <DataTableCustom
      className='data-table-custom'
      columns={columns}
      dataList={data}
      paginationTotalRows={totalFilter}
      t={t}
      fixedHeader
      fixedHeaderScrollHeight='1000px'
      nameDataTable='colAccountMerchant'
      getDataList={getDataList}
      isLoading={loading}
      {...rest}
    />
  );
}
