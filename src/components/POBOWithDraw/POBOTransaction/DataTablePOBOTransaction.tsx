/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import renderState from 'constants/State';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import { PoboOrderList } from 'models/pobo/poboState';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import formatCurrency from 'utils/helpers/formatCurrency';
import _ from 'lodash';
import ModalChange from './Modal/ChangePOBO';
import Link from 'next/link';
import ModalViewBankState from '../Modal/ViewBankState';
interface Props {
  t: (a: string) => string;
  data: PoboOrderList[] | undefined;
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
  rest?: any;
  isLoading: boolean;
}

const DataTablePOBOTransaction: React.FC<Props> = ({
  t,
  data,
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

  const [transactionId, setTransactionId] = useState<string>('');
  const [showModalChange, setShowModalChange] = useState<boolean>(false);
  const [showTransactionBankStateModal, setShowTransactinoBankStateModal] =
    useState<boolean>(false);

  const handleUpdateTransactionState = (itemId: string | undefined, type: string | undefined) => {
    itemId && setTransactionId(itemId);
    itemId && setShowModalChange(true);
  };

  const viewTransactionBankState = (transactionId: string | undefined) => {
    transactionId && setTransactionId(transactionId);
    transactionId && setShowTransactinoBankStateModal(true);
  };

  const handleCloseViewBankStateModal = () => {
    setShowTransactinoBankStateModal(false);
  };

  const defaultColumn = [
    t('MC Id'),
    t('Mã giao dịch'),
    t('Partner Transaction ID'),
    t('bulkTransactionId'),
    t('Doanh nghiệp'),
    t('typePOBO'),
    t('POBO_Method'),
    t('Số tiền chi'),
    t('Phí'),
    t('Tổng tiền thực chi'),
    t('Số tài khoản'),
    t('Tên tài khoản'),
    t('Mã GD ngân hàng'),
    t('Ngân hàng'),
    t('Thời gian tạo'),
    t('Trạng thái'),
    t('Thao tác'),
  ];

  const columns: TableColumn<PoboOrderList>[] = useMemo(
    () => [
      {
        name: t('MC Id'),
        minWidth: '120px',
        maxWidth: '200px',
        cell: (row) => (
          <Link href={`/cong-thanh-toan/quan-ly-mc/${row?.merchantId}`}>
            <a>{row?.merchantId}</a>
          </Link>
        ),
      },
      {
        name: t('Mã giao dịch'),
        minWidth: '220px',
        maxWidth: '240px',
        cell: (row) => <span>{row?.transactionId ?? '-'}</span>,
      },
      {
        name: t('Partner Transaction ID'),
        minWidth: '240px',
        maxWidth: '350px',
        cell: (row) => <span>{row?.partnerTransaction ?? '-'}</span>,
      },
      {
        name: t('bulkTransactionId'),
        cell: (row) => <span>{row?.bulkTransactionId ?? '-'}</span>,
        minWidth: '220px',
        maxWidth: '320px',
      },
      {
        name: t('Doanh nghiệp'),
        cell: (row) => (
          <Link href={`/cong-thanh-toan/quan-ly-mc/${row?.merchantId ?? ''}`}>
            <a>{row?.merchantName ?? '-'} </a>
          </Link>
        ),
        minWidth: '180px',
        maxWidth: '350px',
      },
      {
        name: t('typePOBO'),
        cell: (row) => <span className='color-payme'>{row?.type ?? '-'}</span>,
        minWidth: '140px',
        maxWidth: '150px',
      },
      {
        name: t('POBO_Method'),
        cell: (row) => (
          <span className='color-payme'>
            {_.isEmpty(row?.destination?.wallet) ? t(`BANK`) : t(`WALLET`)}
          </span>
        ),
        minWidth: '120px',
        maxWidth: '150px',
      },
      {
        name: t('Số tiền chi'),
        right: true,
        cell: (row) => (
          <span>
            {row?.amount === 0 || row?.amount
              ? row?.amount === -1
                ? '******'
                : `${formatCurrency(row?.amount)} đ`
              : '-'}
          </span>
        ),
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Phí'),
        right: true,
        cell: (row) => (
          <span>
            {row?.amount === 0 || row?.amount
              ? row?.amount === -1
                ? '******'
                : row?.fee === 0 || row?.fee
                ? `${formatCurrency(row?.fee)} đ`
                : '-'
              : '-'}
          </span>
        ),
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Tổng tiền thực chi'),
        right: true,
        cell: (row) => (
          <span>
            {row?.amount === 0 || row?.amount
              ? row?.amount === -1
                ? '******'
                : row?.total === 0 || row?.total
                ? `${formatCurrency(row.total)} đ`
                : '-'
              : '-'}
          </span>
        ),
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Số tài khoản'),
        cell: (row) => (
          <span>
            {row?.destination?.bankAccount?.accountNumber || row?.destination?.wallet?.phone}
          </span>
        ),
        minWidth: '180px',
        maxWidth: '240px',
      },
      {
        name: t('Tên tài khoản'),
        cell: (row) => (
          <span>
            {row?.destination?.bankAccount?.accountName || row?.destination?.wallet?.fullname}
          </span>
        ),
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Mã GD ngân hàng'),
        cell: (row) => <span>{row?.bankTransaction ?? '-'}</span>,
        minWidth: '160px',
        maxWidth: '200px',
      },
      {
        name: t('Ngân hàng'),
        cell: (row) => <span>{row?.bankName ?? '-'}</span>,
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Ngân hàng chuyển'),
        cell: (row) => <span>{row?.supplier ?? '-'}</span>,
        minWidth: '180px',
        maxWidth: '200px',
      },
      {
        name: t('Thời gian tạo'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Trạng thái'),
        cell: (row) => (
          <span
            className={`${
              row?.state === 'REVIEW'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED' || row?.state === 'FAILED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(renderState(row?.state))}
          </span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Thao tác'),
        center: true,
        minWidth: '120px',
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
                    <i className='fas fa-ellipsis-h m-0 text-muted m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item
                    className='detail'
                    onClick={() => {
                      viewTransactionBankState(row?.transactionId);
                    }}>
                    <i className='fas fa-edit fa-lg mr-2'></i>
                    {t('view bank status')}
                  </Dropdown.Item>

                  {row?.state === 'REVIEW' && (
                    <Dropdown.Item
                      onClick={() => {
                        handleUpdateTransactionState(row?.transactionId, 'REVIEW');
                      }}>
                      <i className='fas fa-history fa-lg mr-2'></i>
                      {t('REVIEW')}
                    </Dropdown.Item>
                  )}
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
        nameDataTable='colTransaction'
        getDataList={getDataList}
        defaultColumn={defaultColumn}
        {...rest}
      />

      <ModalChange
        t={t}
        transactionId={transactionId}
        handleClose={() => setShowModalChange(false)}
        show={showModalChange}
        handleRecall={setSubmitForm}
      />
      <ModalViewBankState
        transactionId={transactionId}
        handleClose={handleCloseViewBankStateModal}
        t={t}
        show={showTransactionBankStateModal}
      />
    </>
  );
};

export default DataTablePOBOTransaction;
