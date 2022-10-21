import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import { MismatchTransaction, SearchMismatchTransactionInput } from 'models/transfer';
import React, { useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import ModalUpdateTransaction from './Modal/UpdateTransaction';
import numeral from 'numeral';

interface DataTableProps {
  t: (a: string) => string;
  data: MismatchTransaction[];
  totalFilter?: number;
  getDataList: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: SearchMismatchTransactionInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  convertState: (state: string) => string;
  rest?: any;
}

function DataTable({ t, data, getDataList, setSubmitForm, convertState, ...rest }: DataTableProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>((state) => state?.transferReducer.loading);
  const [isShowUpdateTransactionModal, setShowUpdateTransactionModal] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string>();
  const [supplierTransaction, setSupplierTransaction] = useState<string>();
  const [actions, setActions] = useState<string[]>([]);

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Mã NCC'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.supplierTransaction || '-'}</div>;
        },
      },
      {
        name: t('Mã thanh toán'),
        minWidth: '150px',
        cell: (row) => {
          return <div>{row?.paymentId || '-'}</div>;
        },
      },
      {
        name: t('Số tiền (VND)'),
        right: true,
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.amount ? numeral(row?.amount).format('0,0.[0000]') : '-'}</div>;
        },
      },
      {
        name: t('Nội dung'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.description || '-'}</div>;
        },
      },
      {
        name: t('Số tài khoản'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.cardNumber || '-'}</div>;
        },
      },
      {
        name: t('Tên MC'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.merchantName || '-'}</div>;
        },
      },
      {
        name: t('Tên hiển thị'),
        minWidth: '250px',
        cell: (row) => {
          return <div>{row?.brandName || '-'}</div>;
        },
      },
      {
        name: t('Người gửi'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.sender || '-'}</div>;
        },
      },
      {
        name: t('Trạng thái ngân hàng'),
        center: true,
        minWidth: '180px',
        cell: (row) => {
          return (
            <div className={`state ${row?.supplierState?.toLowerCase()}`}>
              {row?.supplierState ? convertState(row?.supplierState) : ''}
            </div>
          );
        },
      },
      {
        name: t('Trạng thái CTT'),
        center: true,
        minWidth: '180px',
        cell: (row) => {
          return (
            <div className={`state ${row?.paymentState?.toLowerCase()}`}>
              {row?.paymentState ? convertState(row?.paymentState) : ''}
            </div>
          );
        },
      },
      {
        name: t('Trạng thái GD'),
        center: true,
        minWidth: '180px',
        cell: (row) => {
          return (
            <span
              className={`${
                row?.isMatch
                  ? 'state-success-modal'
                  : row?.supplierState === 'SUCCESS' && row?.paymentState === 'PENDING'
                  ? 'state-pending-modal'
                  : ''
              }`}>
              {row?.isMatch
                ? t('Đã khớp')
                : row?.supplierState === 'SUCCESS' && row?.paymentState === 'PENDING'
                ? t('Chưa khớp')
                : ''}
            </span>
          );
        },
      },
      {
        name: t('Thời gian'),
        minWidth: '150px',
        cell: (row) => {
          return (
            <div>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</div>
          );
        },
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
        cell: (row) => {
          return (
            <div className={`update-icon ${row?.actions?.length > 0 ? '' : 'disabled'}`}>
              <i
                className={`fas fa-edit fa-lg update-icon text-muted ${
                  row?.actions?.length > 0 ? '' : 'disabled'
                }`}
                onClick={() => {
                  if (row?.actions?.length > 0) {
                    setPaymentId(row?.paymentId);
                    setSupplierTransaction(row?.supplierTransaction);
                    setActions(row?.actions);
                    setShowUpdateTransactionModal(true);
                  }
                }}
              />
            </div>
          );
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        isLoading={isLoading}
        className='data-table-custom transfer-manage-table'
        columns={columns}
        dataList={data}
        t={t}
        nameDataTable='colProcessingList'
        getDataList={getDataList}
        {...rest}
      />
      <ModalUpdateTransaction
        t={t}
        show={isShowUpdateTransactionModal}
        paymentId={paymentId}
        supplierTransaction={supplierTransaction}
        actions={actions}
        handleClose={() => setShowUpdateTransactionModal(false)}
        setSubmitForm={setSubmitForm}
      />
    </div>
  );
}

export default DataTable;
