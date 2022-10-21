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
    t('Mã đơn hàng'),
    t('Mã thanh toán'),
    t('Partner Transaction ID'),
    t('Mã GD NCC'),
    t('Giá trị GD'),
    t('Phí đối soát'),
    t('Thực nhận'),
    t('PTTT'),
    t('Doanh nghiệp'),
    t('NCC'),
    t('NPH'),
    t('Loại GD'),
    t('TG tạo'),
    t('TG hoàn thành'),
    t('TG cập nhật'),
    t('Mã cửa hàng'),
    t('Tên cửa hàng'),
    t('TTTT'),
    t('Client IP'),
    t('Mô tả'),
    t('Hình thức'),
    t('Loại thẻ'),
    t('Mã số thẻ'),
    t('Trạng thái đối soát'),
    t('Mã GD đối soát'),
    t('Quốc gia'),
    t('Thao tác'),
  ];

  const columns: TableColumn<TransactionResponse>[] = useMemo(
    () => [
      {
        name: t('Mã đơn hàng'),
        minWidth: '135px',
        maxWidth: '145px',
        cell: (row) => <span>{row?.transactionId}</span>,
      },
      {
        name: t('Mã thanh toán'),
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
        name: t('Mã GD NCC'),
        cell: (row) => <span>{row?.supplierTransaction ? row?.supplierTransaction : '-'}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Giá trị GD'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.amount)} đ</span>,
        minWidth: '115px',
        maxWidth: '130px',
      },
      {
        name: t('Phí đối soát'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.fee)} đ</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Thực nhận'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.total)} đ</span>,
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
        name: t('Doanh nghiệp'),
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
        name: t('Loại GD'),
        cell: (row) => (
          <span>{row?.transactionType ? t('TRANSACTION_' + row?.transactionType) : '-'}</span>
        ),
        minWidth: '130px',
        maxWidth: '150px',
      },
      {
        name: t('TG tạo'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('TG hoàn thành'),
        cell: (row) => (
          <span>
            {row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
          </span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('TG cập nhật'),
        cell: (row) => (
          <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
        ),
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Mã cửa hàng'),
        cell: (row) => <span>{row?.storeId}</span>,
        minWidth: '120px',
      },
      {
        name: t('Tên cửa hàng'),
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
        name: t('Mô tả'),
        cell: (row) => <span>{row?.description}</span>,
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Hình thức'),
        cell: (row) => <span>{row?.paymentSubType ? t(`${row?.paymentSubType}`) : '-'}</span>,
        minWidth: changeWidthColumn,
        maxWidth: changeWidthColumn,
      },
      {
        name: t('Loại thẻ'),
        cell: (row) => <span>{row?.cardType ? row.cardType : '-'}</span>,
        minWidth: '120px',
      },
      {
        name: t('Mã số thẻ'),
        cell: (row) => <span>{row?.cardNumber ? row.cardNumber : '-'}</span>,
        minWidth: '120px',
      },
      {
        name: t('Trạng thái đối soát'),
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
              ? t('Chờ đối soát')
              : row?.crossCheckState === 'PAID'
              ? t('Đã đối soát')
              : t('Chưa đối soát')}
          </span>
        ),
        minWidth: '150px',
      },
      {
        name: t('Mã GD đối soát'),
        cell: (row) => <span>{row?.crossCheckId ? row.crossCheckId : '-'}</span>,
        minWidth: '120px',
        maxWidth: '135px',
      },
      {
        name: t('Quốc gia'),
        maxWidth: '100px',
        cell: (row) => <span>{row?.country ? row.country : '-'}</span>,
      },
      {
        name: t('Thao tác'),
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
                    {t('Xem chi tiết')}
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
                          {t('Hủy')}
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
