// import DataTableCustom from 'components/common/Datatable/DatatableCusTomv2';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { DelegatesType } from 'models';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Collapse } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';

interface DataTableMerchantProps {
  t: (a: string) => string;
  data?: any;
  collapse?: boolean;
  onCloseMerchant?: React.ChangeEventHandler<HTMLInputElement>;
}

function DataTableMerchantEmployee({
  t,
  collapse,
  data,
  onCloseMerchant,
  ...rest
}: DataTableMerchantProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');

  const columns: TableColumn<DelegatesType>[] = useMemo(
    () => [
      {
        name: t('STT'),
        minWidth: '50px',
        maxWidth: '80px',

        cell: (row: any, index: number) => (
          <div className='position-relative w-100'>{index + 1}</div>
        ),
      },

      {
        name: t('ID Nhân viên'),
        minWidth: '150px',
        maxWidth: '200px',
        cell: (row) => {
          return (
            <Link href={`/cong-thanh-toan/tai-khoan?id=${row?.accountId}`}>
              <a>{row?.accountId}</a>
            </Link>
          );
        },
      },
      {
        name: t('Tên nhân viên'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.fullname}</div>;
        },
      },
      {
        name: t('Tên đăng nhập'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.username}</div>;
        },
      },

      {
        name: t('Số điện thoại'),
        minWidth: '180px',
        maxWidth: '200px',

        cell: (row) => {
          return <div>{row?.phone}</div>;
        },
      },
      {
        name: t('Loại tài khoản'),
        minWidth: '180px',
        maxWidth: '200px',

        cell: (row) => {
          const labelRole = row?.role?.startsWith('mc.')
            ? row?.role?.split('.')[1]?.toUpperCase()
            : row?.role;
          return <div style={{ textTransform: 'uppercase' }}>{t(labelRole || '')}</div>;
        },
      },
      // {
      //   name: t('Trạng thái'),
      //   minWidth: '100px',
      //   maxWidth: '100px',
      //   cell: (row) => {
      //     return (
      //       <label className='switch'>
      //         <input
      //           type='checkbox'
      //           data-index={row?.accountId}
      //           checked={row?.isActive}
      //           onChange={onCloseMerchant}
      //         />
      //         <span className='slider around' />
      //       </label>
      //     );
      //   },
      // },
      // {
      //   name: t('Thao tác'),
      //   minWidth: '130px',
      //   maxWidth: '130px',
      //   cell: (row) => {
      //     return (
      //       <>
      //         <Dropdown className='employee-table-dropdown'>
      //           <Dropdown.Toggle
      //             className='p-0 w-100'
      //             style={{
      //               backgroundColor: 'rgba(0,0,0,0)',
      //               borderColor: 'rgba(0,0,0,0)',
      //             }}
      //             id='dropdown-menu-align-end'>
      //             <div className='d-flex justify-content-center w-100'>
      //               <i className='fas fa-th-large m-0 text-muted'></i>
      //             </div>
      //           </Dropdown.Toggle>
      //           <Dropdown.Menu style={{ borderRadius: '12px' }}>
      //             {/* <Dropdown.Item onClick={handleShowModal(row?.accountId, 'CHANGE_PASSWORD')}>
      //               <i className='fas fa-key fa-lg mr-2' />
      //               {t('Đổi mật khẩu')}
      //             </Dropdown.Item> */}
      //             <Dropdown.Item onClick={handleShowModal(row?.accountId, 'PASSWORD_TEMP')}>
      //               <i className='fas fa-unlock-alt fa-lg mr-2' />
      //               {t('Mật khẩu tạm')}
      //             </Dropdown.Item>
      //             {/* <Dropdown.Item>
      //               <i className='fas fa-info-circle fa-lg mr-2' />
      //               {t('Mở khóa login')}
      //             </Dropdown.Item>
      //             <Dropdown.Item>
      //               <i className='fas fa-info-circle fa-lg mr-2' />
      //               {t('Cập nhật Scope')}
      //             </Dropdown.Item>
      //             <Dropdown.Item>
      //               <i className='fas fa-info-circle fa-lg mr-2' />
      //               {t('Tạo giao dịch')}
      //             </Dropdown.Item>
      //             <Dropdown.Item>
      //               <i className='fas fa-info-circle fa-lg mr-2' />
      //               {t('Hủy/Hoàn giao dịch')}
      //             </Dropdown.Item>
      //             <Dropdown.Item>
      //               <i className='fas fa-info-circle fa-lg mr-2' />
      //               {t('Xem thống kê')}
      //             </Dropdown.Item>
      //             <Dropdown.Item>
      //               <i className='fas fa-window-close fa-lg mr-2'></i>
      //               {t('Hủy')}
      //             </Dropdown.Item> */}
      //           </Dropdown.Menu>
      //         </Dropdown>
      //       </>
      //     );
      //   },
      // },
    ],
    [lang, t]
  );

  return (
    <>
      <Collapse in={collapse || false} className='data-merchant-employee'>
        <DataTableCustom
          className='data-table-custom'
          columns={columns}
          dataList={data}
          t={t}
          nameDataTable='colMerchantEmployee'
          {...rest}
          {...{
            fixedHeader: true,
            fixedHeaderScrollHeight: '30vh',
            disableFixHeight: true,
          }}
        />
      </Collapse>
    </>
  );
}

export default DataTableMerchantEmployee;
