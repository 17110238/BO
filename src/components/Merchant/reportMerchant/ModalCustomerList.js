import React, { useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';

import formatCurrency from 'utils/helpers/formatCurrency';
import ReactTooltip from 'react-tooltip';
import Link from 'next/link';
export default function ModalAccountList({
  show,
  toggleModalCustomerList,
  t,
  listCustomer,


}) {
  const columns = useMemo(() => {
    const arr = [
      {
        name: t('MC ID'),
        minWidth: '100px',
        cell: (row, index) => <div className='position-relative w-100'>{row?.mcId}</div>,
      },
      {
        name: t('Tên MC'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.fullname}</div>;
        },
      },
      {
        name: t('Tổng Doanh thu'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.phone}</div>;
        },
      },
      {
        name: t('Tổng Phí'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{row?.email}</div>;
        },
      },
      {
        name: t('Tổng tiền MC thực nhận'),
        minWidth: '180px',
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('Tổng GD thanh công'),
        minWidth: '180px',
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('Tổng GD hủy'),
        minWidth: '180px',
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('Tổng GD hoàn'),
        minWidth: '180px',
        cell: (row) => {
          return <div>0</div>;
        },
      },
      {
        name: t('Thao tác'),
        minWidth: '180px',
        cell: (row) => {
          return <Link className="idPayment" href='/transaction/report'>{t('Chi tiết báo cáo')}</Link>;
        },
      },

     
     
    ];

    return arr;
  }, [t]);
 
   
  return (
    // <Modal show={show} onHide={toggleModalCustomerList} className='modal-receiver-list'>
    <div>

   
    <Modal.Header >
    <Modal.Title>
      <div className='title'>{t('Danh sách Doanh thu Merchant')}</div>
    </Modal.Title>
    </Modal.Header>
    <DataTableCustom
          className='data-table-custom'
          noHeader
          columns={columns}
          dataList={listCustomer}
          t={t}
          isNotPaginationServer={true}
          isShowDisplayRowOption={false}
          pagination={false}
        />
    
  </div>
  );
}
