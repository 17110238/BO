import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import DetailTransDrawer from 'components/common/DetailTransDrawer/DetailTransDrawer';
import renderState from 'constants/State';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DataTableSupplierProps {
  data?: [] | undefined | any;
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
  rest?: any;
  filter: any;
  supplierId?: number | any;
  loading?: any;
}
interface SupplierInfo {
  searchText?: string;
  searchType?: string | any;
}
const DataTableSupplier = ({
  // t,
  data,
  totalFilter,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  filter,
  supplierId,
  loading,
  ...rest
}: DataTableSupplierProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);
  const [isShowModalCancel, setShowModalCancel] = useState<boolean>(false);
  const [idDetail, setIdDetail] = useState<any>(0);
  const [supplierInfo, setSupplierInfo] = useState<any>({});
  const [column, setColumn] = useState<any>('');
  const dispatch = useDispatch();
  const filterPayload: any = useSelector<any>((state) => state?.supplierManageReducers?.filter);
  const [detailType, setDetailType] = useState<string | undefined>('');
  const [row, setRow] = useState<any>({});

  const openDrawerDetail = async (type: string | undefined, paymentId: string) => {
    setIdDetail(paymentId);
    setDetailType(type);
  };

  const columns2: TableColumn<any>[] = [
    {
      name: t('Id'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.id}
        </span>
      ),
    },

    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '155px',
      maxWidth: '150px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },
    {
      name: t('Mã GD nhà cung cấp'),
      cell: (row) => <span>{row?.supplierTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },
    {
      name: t('Biểu Phí'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.fee)} đ`}</span>,
      minWidth: '100px',
    },
    {
      name: t('Tổng giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.total)} đ`} </span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Liên kết thẻ'),
      cell: (row) => <span>{row?.saveCard ? 'true' : 'false'}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Loại thẻ'),
      cell: (row) => <span>{row?.cardType ? row?.cardType : '-'}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Trong nước/Quốc tế'),
      cell: (row) => <span>{row?.isNational ? 'Trong Nước' : 'Quốc Tế'}</span>,
      minWidth: '135px',
      maxWidth: '150px',
    },
    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
                {row?.state === 'SUCCEEDED' && (
                  <Dropdown.Item
                    className='refund'
                    onClick={() => {
                      setShowModalRefund(true);
                      setSupplierInfo({
                        ...supplierInfo,
                        searchText: row.paymentId,
                        // searchType: query?.searchType,
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
                      setSupplierInfo({
                        ...supplierInfo,
                        searchText: row.paymentId,
                        // searchType: query?.searchType,
                      });
                    }}>
                    <i className='fas fa-window-close fa-lg mr-2'></i>
                    {t('Hủy')}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];

  const columnsEbuy: TableColumn<any>[] = [
    {
      name: t('Id'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.id}
        </span>
      ),
    },

    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '155px',
      maxWidth: '150px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },
    {
      name: t('Mã GD nhà cung cấp'),
      cell: (row) => <span>{row?.supplierTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },
    {
      name: t('Biểu Phí'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.fee)} đ`}</span>,
      minWidth: '100px',
    },
    {
      name: t('Tổng giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.total)} đ`} </span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Tiền tệ'),
      right: true,
      cell: (row) => <span>{row?.currency} </span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
                {row?.state === 'SUCCEEDED' && (
                  <Dropdown.Item
                    className='refund'
                    onClick={() => {
                      setShowModalRefund(true);
                      setSupplierInfo({
                        ...supplierInfo,
                        searchText: row.paymentId,
                        // searchType: query?.searchType,
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
                      setSupplierInfo({
                        ...supplierInfo,
                        searchText: row.paymentId,
                        // searchType: query?.searchType,
                      });
                    }}>
                    <i className='fas fa-window-close fa-lg mr-2'></i>
                    {t('Hủy')}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];
  const columns: TableColumn<any>[] = [
    {
      name: t('Id'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.id}
        </span>
      ),
    },

    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '150px',
      maxWidth: '155px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },
    {
      name: t('Mã GD nhà cung cấp'),
      cell: (row) => <span>{row?.supplierTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '135px',
      maxWidth: '135px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },
    {
      name: t('Phí GD'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.fee)} đ`}</span>,
      minWidth: '100px',
    },

    {
      name: t('Tổng tiền GD'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row.total)} đ`}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Phí Thanh Toán'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.feeUser)} đ`}</span>,
      minWidth: '150px',
    },
    {
      name: t('Tổng tiền thanh toán'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.totalUser)} đ`} </span>,
      minWidth: '155px',
      maxWidth: '150px',
    },
    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Liên kết thẻ'),
      cell: (row) => <span>{row?.saveCard ? 'true' : 'false'}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Loại thẻ'),
      cell: (row) => <span>{row?.cardType ? row?.cardType : '-'}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Trong nước/Quốc tế'),
      cell: (row) => <span>{row?.isNational ? 'Trong Nước' : 'Quốc Tế'}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];

  const columnsPayme: TableColumn<any>[] = [
    {
      name: t('Id'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.id}
        </span>
      ),
    },
    {
      name: t('iSec ID'),
      minWidth: '125px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.iSecId ? row?.iSecId : '-'}</span>,
    },
    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '145px',
      maxWidth: '150px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },
    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },
    {
      name: t('Biểu phí'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.fee)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },

    {
      name: t('Tổng giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row.total)} đ`}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Chi tiết iSec'),
      // right: true,
      cell: (row) => (
        <span>
          {' '}
          {row?.iSecInfo?.amount ? `Giá trị: ${formatCurrency(row?.iSecInfo?.amount)} đ` : ''}
          {row?.iSecInfo?.total
            ? <br /> + `Tổng tiền GD: ${formatCurrency(row?.iSecInfo?.total)} đ`
            : ''}
          {row?.iSecInfo?.fee ? <br /> + `Phí GD: ${formatCurrency(row?.iSecInfo?.fee)} đ` : ''}
        </span>
      ),
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];

  const columnsAlipay: TableColumn<any>[] = [
    {
      name: t('Id'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.id}
        </span>
      ),
    },

    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '155px',
      maxWidth: '155px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },
    {
      name: t('Mã GD nhà cung cấp'),
      cell: (row) => <span>{row?.supplierTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Cửa hàng'),
      cell: (row) => <span className='color-payme'>{row?.storeName ? row?.storeName : '-'}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },
    {
      name: t('Biểu phí'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.fee)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },

    {
      name: t('Tổng giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.total)} đ`} </span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
                {row?.state === 'SUCCEEDED' && (
                  <Dropdown.Item
                    className='refund'
                    onClick={() => {
                      setShowModalRefund(true);
                      setSupplierInfo({
                        ...supplierInfo,
                        searchText: row.paymentId,
                        // searchType: query?.searchType,
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
                      setSupplierInfo({
                        ...supplierInfo,
                        searchText: row.paymentId,
                        // searchType: query?.searchType,
                      });
                    }}>
                    <i className='fas fa-window-close fa-lg mr-2'></i>
                    {t('Hủy')}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];

  const columnsWooriBank: TableColumn<any>[] = [
    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '145px',
      maxWidth: '150px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },

    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '155px',
      maxWidth: '155px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },

    {
      name: t('Tài khoản thụ hưởng'),
      cell: (row) => {
        let tkth;
        if (row?.method && row?.method === 'MANUAL_BANK') {
          tkth = row?.accountNumber;
        }
        if (row?.method && row?.method === 'ATM') {
          tkth = row?.bankInfo?.cardNumber;
        }
        return <span>{tkth ? tkth : '-'}</span>;
      },
      minWidth: '155px',
      maxWidth: '150px',
    },
    {
      name: t('Ngân hàng'),
      cell: (row) => {
        // accountNumber
        //   bankName
        //   content
        let tkth;
        if (row?.method && row?.method === 'MANUAL_BANK') {
          tkth = row?.bankName;
        }
        return <span>{tkth ? tkth : '-'}</span>;
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Nội dung chuyển khoản'),
      cell: (row) => <span>{row?.content}</span>,
      minWidth: '175px',
      maxWidth: '175px',
    },

    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Mã giao dịch ngân hàng'),
      cell: (row) => <span>{row?.supplierTransaction}</span>,
      minWidth: '180px',
      maxWidth: '180px',
    },
    {
      name: t('Phương thức'),
      cell: (row) => <span>{row?.method}</span>,
      minWidth: '130px',
      maxWidth: '130px',
    },
    {
      name: t('Ghi chú'),
      cell: (row) => <span>{row?.description}</span>,
      minWidth: '160px',
      maxWidth: '160px',
    },
    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];

  const columnsNapas: TableColumn<any>[] = [
    {
      name: t('Id'),
      minWidth: '105px',
      maxWidth: '130px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.id}
        </span>
      ),
    },

    {
      name: t('Mã đơn hàng'),
      minWidth: '140px',
      maxWidth: '140px',
      cell: (row) => <span>{row?.transaction ? row?.transaction : '-'}</span>,
    },
    {
      name: t('Mã Thanh Toán'),
      minWidth: '155px',
      maxWidth: '150px',
      cell: (row) => (
        <span
          className='text-link'
          onClick={() => {
            openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
          }}>
          {row?.paymentId}
        </span>
      ),
    },

    {
      name: t('Mã GD đối tác'),
      cell: (row) => <span>{row?.partnerTransaction}</span>,
      minWidth: '155px',
      maxWidth: '150px',
    },
    {
      name: t('Giá trị'),
      right: true,
      cell: (row) => <span>{`${formatCurrency(row?.amount)} đ`}</span>,
      minWidth: '140px',
      maxWidth: '150px',
    },
    {
      name: t('Doanh nghiệp'),
      cell: (row) => (
        <span
          onClick={() => {
            router.replace(
              `/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`,
              undefined,
              { shallow: true }
            );
            // router.push(`/cong-thanh-toan/quan-ly-mc/thong-tin-mc/${row?.merchantId}`);
          }}
          className='color-payme text-link'>
          {row?.merchantName ? row?.merchantName : '-'}
        </span>
      ),
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Tài khoản thụ hưởng'),
      cell: (row) => (
        <span>
          {row?.bankInfo?.cardNumber}
          <br />({row?.bankInfo?.cardHolder})
        </span>
      ),
      minWidth: '165px',
      maxWidth: '200px',
    },
    {
      name: t('Ngân hàng'),
      cell: (row) => <span>{row?.bankInfo?.shortName}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },
    {
      name: t('Mô tả'),
      cell: (row) => <span>{row?.description}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Trạng thái'),
      // cell: (row) => <span>{row?.state}</span>,
      cell: (row) => (
        <div className='col-right text-right'>
          <span
            className={`${
              row?.state === 'REFUNDED'
                ? 'state-refunded-modal'
                : row?.state === 'SUCCEEDED' ||
                  row?.state === 'RECEIVED' ||
                  row?.state === 'USED' ||
                  row?.state === 'CLAIMED' ||
                  row?.state === 'AUTHORIZED'
                ? 'state-success-modal'
                : row?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.state === 'CANCELED_SUCCEEDED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(row?.state)}
          </span>
        </div>
      ),
      minWidth: '155px',
      maxWidth: '160px',
    },
    {
      name: t('Client IP'),
      cell: (row) => <span>{row?.clientIp}</span>,
      minWidth: '115px',
      maxWidth: '130px',
    },

    {
      name: t('Mã giao dịch ngân hàng'),
      cell: (row) => <span>{row?.supplierTransaction}</span>,
      minWidth: '180px',
      maxWidth: '180px',
    },
    {
      name: t('Thời gian tạo'),
      cell: (row) => (
        <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian hoàn thành'),
      cell: (row) => (
        <span>{row?.finishedAt ? dayjs(row?.finishedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thời gian cập nhật'),
      cell: (row) => (
        <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : '-'}</span>
      ),
      minWidth: '165px',
      maxWidth: '165px',
    },
    {
      name: t('Thao tác'),
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
                  <i className='fas fa-th-large m-0 text-muted'></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: '12px' }}>
                <Dropdown.Item
                  className='detail'
                  onClick={() => {
                    openDrawerDetail('SUPPLIER_DETAIL', row.paymentId);
                  }}>
                  <i className='fas fa-info-circle fa-lg mr-2' />
                  {t('Xem chi tiết')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      minWidth: '115px',
      maxWidth: '130px',
    },
  ];

  const renderTablePayme = () => {
    return (
      <DataTableCustom
        isLoading={false}
        t={t}
        fixedHeader={true}
        fixedHeaderScrollHeight='400px'
        // fixedHeaderScrollHeight={}
        columns={columnsPayme}
        dataList={data}
        className='data-table-custom transaction-table'
        // paginationTotalRows={}
        nameDataTable='colTransaction'
        getDataList={getDataList}
        // defaultColumn={}
        {...rest}
      />
    );
  };

  return (
    <>
      {!supplierId && (
        <DataTableCustom
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          columns={columns}
          dataList={data}
          className='data-table-custom transaction-table'
          nameDataTable='colTransaction'
          getDataList={getDataList}
          isLoading={loading}
          {...rest}
        />
      )}

      {supplierId && supplierId === 6 && (
        <DataTableCustom
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          columns={columnsNapas}
          dataList={data}
          className='data-table-custom transaction-table'
          nameDataTable='colTransaction'
          getDataList={getDataList}
          isLoading={loading}
          // defaultColumn={}
          {...rest}
        />
      )}
      {supplierId && supplierId === 11 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columnsWooriBank}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}
      {supplierId && supplierId === 5 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columnsWooriBank}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}

      {supplierId && supplierId === 14 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columnsEbuy}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}

      {supplierId && supplierId === 4 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columns}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}
      {supplierId && supplierId === 1 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columnsPayme}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}
      {supplierId && supplierId === 2 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columnsAlipay}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}
      {supplierId && supplierId === 12 && (
        <DataTableCustom
          isLoading={loading}
          t={t}
          fixedHeader={true}
          fixedHeaderScrollHeight='400px'
          // fixedHeaderScrollHeight={}
          columns={columns}
          dataList={data}
          className='data-table-custom transaction-table'
          // paginationTotalRows={}
          nameDataTable='colTransaction'
          getDataList={getDataList}
          // defaultColumn={}
          {...rest}
        />
      )}
      {supplierId &&
        (supplierId === 3 ||
          supplierId === 7 ||
          supplierId === 9 ||
          supplierId === 8 ||
          supplierId === 15 ||
          supplierId === 10 ||
          supplierId === 13) && (
          <DataTableCustom
            isLoading={loading}
            t={t}
            fixedHeader={true}
            fixedHeaderScrollHeight='400px'
            // fixedHeaderScrollHeight={}
            columns={columns2}
            dataList={data}
            className='data-table-custom transaction-table'
            // paginationTotalRows={}
            nameDataTable='colTransaction'
            getDataList={getDataList}
            // defaultColumn={}
            {...rest}
          />
        )}

      {/* {filterPayload.supplierId && filterPayload.supplierId === 1 && renderTablePayme()} */}

      <DetailTransDrawer
        type={detailType}
        idDetail={idDetail}
        filter={filterPayload}
        // info={supplierInfo}
        // rowData={row}
        // searchText={searchText}
        closeDrawerDetail={() => {
          setDetailType('');
          setIdDetail(0);
        }}
        showOtherDetail={(type, itemId) => {
          setDetailType(type);
          setIdDetail(itemId);
        }}
        handleRecall={setSubmitForm}
        t={t}
      />
    </>
  );
};

export default DataTableSupplier;
