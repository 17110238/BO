/* eslint-disable react-hooks/exhaustive-deps */
import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import renderStatus from 'constants/Status';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import { TransactionResponse, TransactionState } from 'models';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import ModalCancel from './cancel/ModalCancel';
import ModalRefund from './refunds/ModalRefund';
import checkPermisson from 'utils/helpers/checkPermission';
interface DataTableTransactionProps {
  t: (a: string) => string;
  data: TransactionResponse[] | undefined;
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
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  isNotHaveTotalRow?: boolean;
  rest?: any;
}
interface TransactionInfo {
  transactionId?: string;
  partnerId?: string;
}

export interface scopeUserProps {
  scope: string[];
  link: string;
  refcode: string;
}

export default function DataTableTransaction({
  t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isNotHaveTotalRow = false,
  ...rest
}: DataTableTransactionProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);
  const [isShowModalCancel, setShowModalCancel] = useState<boolean>(false);
  const isLoading = useSelector<any, TransactionState>((state) => state?.transactions.loading);
  const changeWidthColumn = lang === 'vi' ? '130px' : '200px';
  const [detailType, setDetailType] = useState<string | undefined>('');
  const [idDetail, setIdDetail] = useState<string>('');
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({
    transactionId: '',
    partnerId: '',
  });
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const checkPermissionRefund = !accountInfo?.scope.includes('bo.transaction.viewOnly');

  const openDrawerDetail = (itemId: number | string | undefined, type: string | undefined) => {
    setDetailType(type);
    itemId && setIdDetail(String(itemId));
  };

  const defaultColumn = [
    t('M?? ????n h??ng'),
    t('M?? thanh to??n'),
    t('Partner Transaction ID'),
    t('M?? GD NCC'),
    t('Gi?? tr??? GD'),
    t('Ph?? ?????i so??t'),
    t('Th???c nh???n'),
    t('PTTT'),
    t('Doanh nghi???p'),
    t('NCC'),
    t('NPH'),
    t('Lo???i GD'),
    t('TG t???o'),
    t('TG ho??n th??nh'),
    t('TG c???p nh???t'),
    t('M?? c???a h??ng'),
    t('T??n c???a h??ng'),
    t('TTTT'),
    t('Client IP'),
    t('M?? t???'),
    t('H??nh th???c'),
    t('Lo???i th???'),
    t('M?? s??? th???'),
    t('Tr???ng th??i ?????i so??t'),
    t('M?? GD ?????i so??t'),
    t('Qu???c gia'),
    t('Thao t??c'),
  ];

  const columns: TableColumn<TransactionResponse>[] = useMemo(
    () => [
      {
        name: t('M?? ????n h??ng'),
        minWidth: '135px',
        maxWidth: '145px',
        cell: (row) => <span>{row?.transactionId}</span>,
      },
      {
        name: t('M?? thanh to??n'),
        cell: (row) => (
          <span
            className='text-link'
            onClick={() => {
              openDrawerDetail(row?.paymentId, 'TRANSACTION');
            }}>
            {row?.paymentId}
          </span>
        ),
        minWidth: '140px',
        maxWidth: '150px',
      },
      {
        name: t('Partner Transaction ID'),
        cell: (row) => <span>{row?.partnerTransaction}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('M?? GD NCC'),
        cell: (row) => <span>{row?.supplierTransaction ? row?.supplierTransaction : '-'}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Gi?? tr??? GD'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} ??</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Ph?? ?????i so??t'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.fee)} ??</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Th???c nh???n'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.total)} ??</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('PTTT'),
        cell: (row) => <span>{t(`${row?.method}`)}</span>,
        minWidth: '130px',
        maxWidth: '150px',
      },
      {
        name: t('Doanh nghi???p'),
        cell: (row) => <span>{row?.merchantName ? row?.merchantName : '-'}</span>,
        minWidth: '125px',
        maxWidth: '140px',
      },
      {
        name: t('NCC'),
        cell: (row) => <span>{row?.supplierName ? row?.supplierName : '-'}</span>,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('NPH'),
        cell: (row) => <span>{row?.issuerName ? row?.issuerName : '-'}</span>,
        minWidth: '130px',
        maxWidth: '200px',
      },
      {
        name: t('Lo???i GD'),
        cell: (row) => (
          <span>{row?.transactionType ? t('TRANSACTION_' + row?.transactionType) : '-'}</span>
        ),
        minWidth: '130px',
        maxWidth: '150px',
      },
      {
        name: t('TG t???o'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('TG ho??n th??nh'),
        cell: (row) => (
          <span>
            {row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
          </span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('TG c???p nh???t'),
        cell: (row) => (
          <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('M?? c???a h??ng'),
        cell: (row) => <span>{row?.storeId}</span>,
        minWidth: '120px',
      },
      {
        name: t('T??n c???a h??ng'),
        cell: (row) => <span>{row?.storeName ? row?.storeName : '-'}</span>,
        minWidth: '120px',
      },
      {
        name: t('TTTT'),
        cell: (row) => (
          <span className={`${renderStatus(row?.state)}`}>{t(renderState(row?.state))}</span>
        ),
        center: true,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Client IP'),
        cell: (row) => <span>{row?.clientIp ? row.clientIp : '-'}</span>,
        minWidth: '132px',
        maxWidth: '140px',
      },
      {
        name: t('M?? t???'),
        cell: (row) => <span>{row?.description}</span>,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('H??nh th???c'),
        cell: (row) => <span>{row?.paymentSubType ? t(`${row?.paymentSubType}`) : '-'}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Lo???i th???'),
        cell: (row) => <span>{row?.cardType ? row.cardType : '-'}</span>,
        minWidth: '120px',
      },
      {
        name: t('M?? s??? th???'),
        cell: (row) => <span>{row?.cardNumber ? row.cardNumber : '-'}</span>,
        minWidth: '120px',
      },
      {
        name: t('Tr???ng th??i ?????i so??t'),
        cell: (row) => (
          <span
            className={`${
              row?.crossCheckState === 'PAID'
                ? 'state-success-modal'
                : row?.crossCheckState === 'PENDING'
                ? 'state-pending-modal'
                : 'state-cancel-modal'
            }`}>
            {row?.crossCheckState === 'PENDING'
              ? t('Ch??? ?????i so??t')
              : row?.crossCheckState === 'PAID'
              ? t('???? ?????i so??t')
              : t('Ch??a ?????i so??t')}
          </span>
        ),
        minWidth: '150px',
      },
      {
        name: t('M?? GD ?????i so??t'),
        cell: (row) => <span>{row?.crossCheckId ? row.crossCheckId : '-'}</span>,
        minWidth: '120px',
        maxWidth: '135px',
      },
      {
        name: t('Qu???c gia'),
        maxWidth: '100px',
        cell: (row) => <span>{row?.country ? row.country : '-'}</span>,
      },
      {
        name: t('Thao t??c'),
        center: true,
        minWidth: '80px',
        maxWidth: '80px',
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
                    {/* <i className='fas fa-th-large m-0 text-muted'></i> */}
                    <i style={{ fontSize: '20px' }} className='fas fa-ellipsis-h m-0 text-muted' />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item
                    className='detail'
                    onClick={() => {
                      openDrawerDetail(row.paymentId, 'TRANSACTION');
                    }}>
                    <i className='fas fa-info-circle fa-lg mr-2' />
                    {t('Xem chi ti???t')}
                  </Dropdown.Item>
                  {checkPermissionRefund! && (
                    <>
                      {row?.state === 'SUCCEEDED' && (
                        <Dropdown.Item
                          className='refund'
                          onClick={() => {
                            setShowModalRefund(true);
                            setTransactionInfo({
                              ...transactionInfo,
                              transactionId: row.transactionId,
                              partnerId: row.partnerTransaction,
                            });
                          }}>
                          {/* <RefundIcon className="refund-icon mr-1" /> */}
                          <i className='fas fa-undo-alt fa-lg mr-2'></i>
                          {t('Refund')}
                        </Dropdown.Item>
                      )}
                      {row?.state === 'SUCCEEDED' && (
                        <Dropdown.Item
                          className='cancel'
                          onClick={() => {
                            setShowModalCancel(true);
                            setTransactionInfo({
                              ...transactionInfo,
                              transactionId: row.transactionId,
                              partnerId: row.partnerTransaction,
                            });
                          }}>
                          <i className='fas fa-window-close fa-lg mr-2'></i>
                          {t('H???y')}
                        </Dropdown.Item>
                      )}
                    </>
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
        columns={columns}
        dataList={data}
        className='transaction-table'
        paginationTotalRows={totalFilter}
        nameDataTable='colTransaction'
        getDataList={getDataList}
        defaultColumn={defaultColumn}
        {...rest}
      />
      <DetailTransDrawer
        type={detailType}
        idDetail={idDetail}
        closeDrawerDetail={() => {
          setDetailType('');
          setIdDetail('');
        }}
        showOtherDetail={(type, itemId) => {
          setDetailType(type);
          setIdDetail(String(itemId));
        }}
        handleRecall={setSubmitForm}
        t={t}
      />
      <ModalRefund
        t={t}
        show={isShowModalRefund}
        handleClose={() => setShowModalRefund(false)}
        transactionInfo={transactionInfo}
        handleRecall={setSubmitForm}
      />
      <ModalCancel
        t={t}
        show={isShowModalCancel}
        handleClose={() => setShowModalCancel(false)}
        transactionInfo={transactionInfo}
        handleRecall={setSubmitForm}
      />
    </>
  );
}
