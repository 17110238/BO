import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import formatCurrency from 'utils/helpers/formatCurrency';
import _ from 'lodash';
import Link from 'next/link';
import { EwalletPaymentType } from 'models';
import TransactionUpdateModal from './Modal/Update';

interface Props {
  t: (a: string) => string;
  data: EwalletPaymentType[] | undefined;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  setSubmitForm?: (a: boolean) => void;
  isLoading: boolean;
}

const DataTable: React.FC<Props> = ({
  t,
  data,
  getDataList,
  setSubmitForm,
  isLoading,
  ...rest
}) => {
  const lang: string = localStorage.getItem('NEXT_LOCALE') ?? 'vi';
  const [isShowTransactionUpdateModal, setIsShowTransactionUpdateModal] = useState<boolean>(false);
  const [bankTransaction, setBankTransaction] = useState<string>('');
  const [transaction, setTransaction] = useState<string>('');
  const updateState = 'PENDING';

  const handleClickUpdateButton = (
    bankTransaction: string | undefined,
    transaction: string | undefined
  ) => {
    setIsShowTransactionUpdateModal(true);
    bankTransaction && setBankTransaction(bankTransaction);
    transaction && setTransaction(transaction);
  };

  const handleClose = () => {
    setIsShowTransactionUpdateModal(false);
  };

  const columns: TableColumn<EwalletPaymentType>[] = useMemo(
    () => [
      {
        name: t('ID'),
        minWidth: '80px',
        maxWidth: '120px',
        cell: (row) => <span>{row?.id}</span>,
      },
      {
        name: t('Mã giao dịch'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => (
          <Link
            href={`/vi-dien-tu/lich-su-giao-dich?searchValue=${row?.transaction}&type=transaction`}>
            <a className='text-color'>{row?.transaction}</a>
          </Link>
        ),
      },
      {
        name: t('Số điện thoại'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => (
          <Link
            href={`/vi-dien-tu/thong-tin-khach-hang?searchValue=${row?.username}&searchType=PHONE`}>
            <a className='text-color'>{row?.username}</a>
          </Link>
        ),
      },
      {
        name: t('Giá trị GD'),
        right: true,
        minWidth: '150px',
        maxWidth: '300px',
        cell: (row) => <span>{formatCurrency(row?.total)} đ</span>,
      },
      {
        name: t('TK NH Nhận'),
        right: true,
        cell: (row) => <span>{row?.account} </span>,
        minWidth: '300px',
        maxWidth: '450px',
      },
      {
        name: t('Ngân hàng'),
        cell: (row) => <span>{row?.bankName}</span>,
        minWidth: '200px',
        maxWidth: '350px',
        right: true,
      },
      {
        name: t('Nội Dung CK'),
        cell: (row) => <span>{row?.description}</span>,
        minWidth: '240px',
        maxWidth: '350px',
      },
      {
        name: t('bankTransaction'),
        cell: (row) => <span>{row?.bankTransaction}</span>,
        minWidth: '240px',
        maxWidth: '350px',
      },
      {
        name: t('Reason'),
        cell: (row) => <span>{row?.reason}</span>,
        minWidth: '150px',
        maxWidth: '250px',
      },
      {
        name: t('Trạng thái'),
        cell: (row) => (
          <span
            className={`${
              row?.state === 'PROCESSING'
                ? 'state-refunded-modal'
                : row?.state === 'EXPIRED'
                ? 'state-cancel-payment-modal'
                : row?.state === 'SUCCEEDED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED' || row?.state === 'FAILED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(`${row?.state}`)}
          </span>
        ),
        minWidth: '150px',
        maxWidth: '250px',
      },
      {
        name: t('Thời gian'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '80px',
        cell: (row) => {
          return (
            <>
              {row?.state === updateState && (
                <div className='d-flex justify-content-center w-100 edit__comtent'>
                  <button
                    onClick={() => handleClickUpdateButton(row?.bankTransaction, row?.transaction)}>
                    <i className='fas fa-edit fa-lg edit__icon text-muted' />
                  </button>
                </div>
              )}
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
        columns={columns}
        dataList={data}
        className='data-table-custom cash-withdraw-table'
        nameDataTable='colTransaction'
        getDataList={getDataList}
        {...rest}
      />
      <TransactionUpdateModal
        t={t}
        show={isShowTransactionUpdateModal}
        handleClose={handleClose}
        bankTransaction={bankTransaction}
        transaction={transaction}
        handleRecall={setSubmitForm}
      />
    </>
  );
};

export default DataTable;
