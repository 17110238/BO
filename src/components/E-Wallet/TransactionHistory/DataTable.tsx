import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import dayjs from 'dayjs';
import useWindowDimensions from 'hook/useWindowDimension';
import React, { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import formatCurrency from 'utils/helpers/formatCurrency';
import _ from 'lodash';
import Link from 'next/link';
import { EWalletTransactionBO } from 'models';
import Details from './Modal/Details';
import Refund from './Modal/Refund';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
interface Props {
  t: (a: string) => string;
  data: EWalletTransactionBO[] | undefined;
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

const DataTable: React.FC<Props> = ({
  t,
  data,
  deleteDefault,
  getDataList,
  setSubmitForm,
  heightBoxSearch,
  isLoading,
  ...rest
}) => {
  const lang: string = localStorage.getItem('NEXT_LOCALE') ?? 'vi';
  const [isShowModalRefund, setShowModalRefund] = useState<boolean>(false);

  const { height: screenHeight } = useWindowDimensions();
  const totalFixedHeightDatatable = heightBoxSearch && screenHeight - heightBoxSearch - 243; // 243 is total header + footer

  const [showModalDetails, setShowModalDetails] = useState<boolean>(false);
  const [_id, setId] = useState<number | undefined>(0);

  const handleOnClick = (_id: number | undefined) => {
    _id && setShowModalDetails(true);
    _id && setId(_id);
  };

  const defaultColumn = [
    t('id'),
    t('Mã giao dịch'),
    t('Số điện thoại'),
    t('Account ID'),
    t('Giá trị GD'),
    t('Phí'),
    t('Total'),
    t('Loại GD'),
    t('Service'),
    t('Thời gian tạo'),
    t('TG cập nhật'),
    t('TG hoàn thành'),
    t('Trạng thái GD'),
    t('Trạng thái dịch vụ'),
    t('Mã thanh toán'),
    t('ID chuyển tiền'),
    t('Diễn giải'),
    t('Phương thức'),
    t('Thao tác'),
  ];

  const transService = (text: any) => {
    const lanObj: any = {
      ALL: 'Tất cả dịch vụ',
      BILL: 'Hóa đơn',
      ISEC: 'ISEC',
      SALARY: 'Lương',
      CASHBACK: 'Hoàn tiền',
      ISEC_BULK: 'Số lượng lớn ISEC',
      ISEC_REDEEM: 'Làm tròn ISEC',
      ISEC_SCRATCH: 'ISEC SCRATCH',
      ISEC_SEND: 'ISEC gửi',
      ISEC_SAVE: 'ISEC Tiết kiệm',
      ISEC_RECEIVED: 'ISEC Nhận',
      ISEC_DONATED: 'ISEC Cho/tặng',
      CANCEL_ISEC: 'ISEC Hủy',
      SOCIAL_LINK: 'Link gửi qua mạng xã hội',
      SOCIAL_PAYMENT: 'Thanh toán qua truyền thông xã hội',
      SOCIAL_DONATE_MONEY_LINK: 'Link gửi tiền quyên góp thông qua truyền thông xã hội',
      SOCIAL_DONATE_MONEY: 'Tiền quyên góp thông qua truyền thông xã hội',
      SOCIAL_REQUEST_MONEY_LINK: 'Link Yêu cầu chuyển tiền',
      SOCIAL_SEND_MONEY: 'Gửi tiền qua truyền thông xã hội',
      SOCIAL_SEND_MONEY_LINK: 'Link gửi tiền qua truyền thông xã hội',
      SOCIAL_PAYME_RECEIVE_MONEY: 'Nhận tiền qua link thanh toán từ PayME',
      SOCIAL_NAPAS_RECEIVE_MONEY: 'Nhận tiền qua link thanh toán từ Napas',
      SOCIAL_SEND_MONEY_LINK_RECIPIANT: 'Người nhận chuyển tiền qua liên kết',
      REFUND_MONEY: 'Hoàn tiền',
      ADD_MONEY: 'Nạp Tiền',
      MINUS_MONEY: 'Trừ tiền',
      WITHDRAW_BANK_MANUAL: 'Rút tiền về tài khoản ngân hàng',
      DEPOSIT_BANK_MANUAL: 'Nạp Tiền từ tài khoản ngân hàng',
      LINKED: 'Liên kết thẻ',
      DEPOSIT_PVCBANK: 'Nạp tiền bằng số thẻ ngân hàng',
      WITHDRAW_PVCBANK: 'Rút tiền về số thẻ ngân hàng',
      WITHDRAW_PAYME: 'Rút Về Ví PayME',
      MOBILE_CARD: 'Card di động',
      MOBILE_TOPUP: 'Nạp điện thoại',
      DEPOSIT: ' Nạp tiền',
      PAYMENT: 'Thanh Toán',
      WITHDRAW_BANK_GATEWAY: 'Rút tiền về tài khoản ngân hàng thông qua cổng thanh toán',
      WITHDRAW_BANK_LINKED_PVCBANK: 'Rút tiền về số thẻ ngân hàng đã liên kết',
      WITHDRAW_BANK_LINKED_GATEWAY:
        'Rút tiền về tài khoản ngân hàng thông qua cổng thanh toán đã liên kết',
      WITHDRAW_BANK_LINKED_OCBBANK: 'Rút tiền về tài khoản ngân hàng liên kết OCB',
      PAYME_SEND_MONEY: 'Gửi tiền từ ví PayME',
      PAYME_RECEIVE_MONEY: 'Nhận tiền bằng ví PayME',
      TRANSFER_PAYME: 'Chuyển tiền bằng ví PayME',
      GATEWAY_PAYMENT: 'Cổng thanh toán',
      SOCIAL_PAYMENT_REQUEST_MONEY_LINK: 'Liên kết yêu cầu chuyển tiền',
      SOCIAL_PAYMENT_RECEIVE_REQUEST_MONEY_LINK: 'Liên kết nhận tiền thanh toán',
      SOCIAL_PAYMENT_SEND_MONEY_LINK: 'Liên kết gửi tiền',
      SOCIAL_PAYMENT_DONATE_MONEY_LINK: 'Liên kết nhận Quyên góp',
      SOCIAL_PAYMENT_PAYME_RECEIVE_MONEY: 'Nhận tiền thanh toán từ liên kết vào ví PayME',
      SOCIAL_PAYMENT_NAPAS_RECEIVE_MONEY: 'Nhận tiền thanh toán từ liên kết vào Napas',
      SOCIAL_PAYMENT_SEND_MONEY: 'Gửi tiền thanh toán',
      SOCIAL_PAYMENT_DONATE_MONEY: 'Nhận quyên góp',
      ADVANCE_MONEY: 'Tạm ứng',
      CREDIT_STATEMENT: 'Sao kê tín dụng',
      CREDIT_SETTLEMENT: 'Đối soát tín dụng',
      PAYME_CREDIT: 'Ví tín dụng PayME',
      PAY_QRCODE: 'Thanh toán bằng QR code',
    };
    return lanObj[text] || text;
  };

  const transTransactionType = (text: any) => {
    const lanObj: any = {
      ALL: 'Tất cả loại GD',
      DEPOSIT: 'Nạp tiền',
      WITHDRAW: 'Rút tiền',
      MOBILE_CARD: 'Thẻ cào điện thoại',
      MOBILE_TOPUP: 'Nạp điện thoại',
      BILL: 'Hoá đơn',
      ISEC: 'ISEC',
      ISEC_CREATE: 'Tạo Isec',
      CASHBACK: 'Hoàn tiền',
      SOCIAL: 'Bên ngoài',
      SOCIAL_PAYMENT: 'Thanh toán qua truyền thông xã hội',
      INTERNAL: 'Nội bộ',
      LINKED: 'Liên kết thẻ',
      BONUS: 'Thưởng',
      DISCOUNT: 'Chiết khấu',
      PAYMENT: 'Thanh toán',
      RECEIVE_MONEY: 'Nhận tiền',
      DEPOSIT_BANK_MANUAL: 'Nạp tiền chuyển khoản',
      PAYME_SALARY: 'Chi lương',
      ADD_MONEY: 'Nạp tiền trực tiếp',
    };
    return lanObj[text] || '';
  };

  const columns: TableColumn<EWalletTransactionBO>[] = useMemo(
    () => [
      {
        name: t('id'),
        minWidth: '120px',
        maxWidth: '150px',
        cell: (row) => (
          <span
            className='text-color cursor-pointer'
            onClick={() => {
              handleOnClick(row?.id);
            }}>
            {row?.id}
          </span>
        ),
      },
      {
        name: t('Mã giao dịch'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => <span>{row?.transactionId} </span>,
      },
      {
        name: t('Số điện thoại'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => (
          <Link
            href={`/vi-dien-tu/thong-tin-khach-hang?searchValue=${row?.phone}&searchType=PHONE`}>
            <a className='text-color'>{row?.phone}</a>
          </Link>
        ),
      },
      {
        name: t('accountId'),
        minWidth: '130px',
        maxWidth: '200px',
        cell: (row) => <span>{row?.accountId}</span>,
      },
      {
        name: t('Giá trị GD'),
        right: true,
        minWidth: '180px',
        maxWidth: '200px',
        cell: (row) => (
          <span>
            {row?.amount === -1 ? (
              <span className='text-muted'>******</span>
            ) : row?.changed === '-' ? (
              <span className='text-danger'>
                {row?.changed} {formatCurrency(row?.amount)} đ
              </span>
            ) : row?.changed === '+' ? (
              <span className='text-info'>
                {row?.changed} {formatCurrency(row?.amount)} đ
              </span>
            ) : (
              <span>
                {row?.changed} {formatCurrency(row?.amount)} đ
              </span>
            )}
          </span>
        ),
      },
      {
        name: t('Phí'),
        right: true,
        cell: (row) => <span>{formatCurrency(row?.fee)} đ</span>,
        minWidth: '100px',
        maxWidth: '120px',
      },
      {
        name: t('Total'),
        cell: (row) => <span>{formatCurrency(row?.total)} đ</span>,
        minWidth: '120px',
        maxWidth: '200px',
        right: true,
      },
      {
        name: t('Loại GD'),
        cell: (row) => (
          <span className='color-payme'>{row?.tags ? transTransactionType(row.tags[0]) : ''}</span>
        ),
        minWidth: '240px',
        maxWidth: '350px',
      },
      {
        name: t('Service'),
        cell: (row) => (
          <span className='color-payme'>
            {row?.service?.type ? transService(row?.service?.type) : '-'}
          </span>
        ),
        minWidth: '240px',
        maxWidth: '350px',
      },
      {
        name: t('Thời gian tạo'),
        cell: (row) => (
          <span>{row?.createdAt ? dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
        minWidth: '150px',
        maxWidth: '250px',
      },
      {
        name: t('TG cập nhật'),
        cell: (row) => (
          <span>{row?.updatedAt ? dayjs(row?.updatedAt).format('HH:mm:ss DD/MM/YYYY') : ''}</span>
        ),
        minWidth: '150px',
        maxWidth: '250px',
      },
      {
        name: t('TG hoàn thành'),
        cell: (row) => (
          <span>
            {row?.publishedAt ? dayjs(row?.publishedAt).format('HH:mm:ss DD/MM/YYYY') : ''}
          </span>
        ),
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Trạng thái GD'),
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
        minWidth: '180px',
        maxWidth: '240px',
      },
      {
        name: t('Trạng thái dịch vụ'),
        cell: (row) => (
          <span
            className={`${
              row?.service?.state === 'REVIEW'
                ? 'state-refunded-modal'
                : row?.service?.state === 'EXPIRED'
                ? 'state-cancel-payment-modal'
                : row?.service?.state === 'SUCCEEDED'
                ? 'state-success-modal'
                : row?.service?.state === 'PENDING'
                ? 'state-pending-modal'
                : row?.service?.state === 'CANCELED' || row?.service?.state === 'FAILED'
                ? 'state-cancel-modal'
                : 'state-cancel-modal'
            } `}>
            {t(`${row?.service?.state}`)}
          </span>
        ),
        minWidth: '160px',
        maxWidth: '180px',
      },
      {
        name: t('Mã thanh toán'),
        cell: (row) => <span>{row?.payment?.transaction || '-'}</span>,
        minWidth: '160px',
        maxWidth: '200px',
      },
      {
        name: t('ID chuyển tiền'),
        cell: (row) => <span>{row?.transport?.transaction || '-'}</span>,
        minWidth: '140px',
        maxWidth: '200px',
      },
      {
        name: t('Diễn giải'),
        cell: (row) => <span>{row?.description || '-'}</span>,
        minWidth: '200px',
        maxWidth: '300px',
      },
      {
        name: t('Phương thức'),
        cell: (row) => <span>{row?.paymentMethod || '-'}</span>,
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
                    <i className='fas fa-ellipsis-h m-0 text-muted'></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ borderRadius: '12px' }}>
                  <Dropdown.Item
                    className='detail'
                    onClick={() => {
                      handleOnClick(row?.id);
                    }}>
                    <i className='fas fa-info-circle fa-lg mr-2' />
                    {t('Xem chi tiết')}
                  </Dropdown.Item>
                  {row?.state === 'SUCCEEDED' &&
                  (row?.service?.state === 'FAILED' ||
                    row?.service?.state === 'PENDING' ||
                    row?.service?.state === 'USED') ? (
                    <Dropdown.Item
                      className='refund'
                      onClick={() => {
                        setShowModalRefund(true), setId(row?.id);
                      }}>
                      <i className='fas fa-undo-alt fa-lg mr-2'></i>
                      {t('Refund transaction')}
                    </Dropdown.Item>
                  ) : (
                    ''
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
      <Details
        _id={_id ? _id : 0}
        show={showModalDetails}
        handleClose={() => setShowModalDetails(false)}
        t={t}
      />

      <Refund
        show={isShowModalRefund}
        handleClose={() => setShowModalRefund(false)}
        _id={_id ? _id : 0}
        t={t}
        handleRecall={setSubmitForm}
        lang={lang}
      />
    </>
  );
};

export default DataTable;
