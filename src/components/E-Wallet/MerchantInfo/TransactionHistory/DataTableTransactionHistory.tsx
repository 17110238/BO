import DataTableCustom from 'components/common/Datatable/DatatableCusTom';
import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  EWalletTransactionBO,
  SearchEWalletTransactionInput,
} from 'models/merchantInfo/merchantInfoState';
import formatCurrency from 'utils/helpers/formatCurrency';

interface DataTableTransactionHistoryProps {
  t: (a: string) => string;
  data: EWalletTransactionBO[];
  getDataList: (
    start?: number,
    limit?: number
  ) => {
    payload: SearchEWalletTransactionInput;
    getList: (payload: any) => void;
  };
  setSubmitForm: (a: boolean) => void;
  rest?: any;
}

function DataTableTransactionHistory({
  t,
  data,
  getDataList,
  setSubmitForm,
  ...rest
}: DataTableTransactionHistoryProps) {
  const lang = localStorage.getItem('NEXT_LOCALE');
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer?.loadingTransactionHistory
  );

  const convertState = (_state: string) => {
    const state = _state?.toLowerCase();
    switch (state) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'succeeded':
        return 'Thành công';
      case 'canceled':
        return 'Hủy';
      case 'failed':
        return 'Thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      case 'expired':
        return 'Hết hạn';
      case 'created':
        return 'Đã khởi tạo';
      case 'requesting':
        return 'Đang yêu cầu';
      case 'used':
        return 'Đã sử dụng';
      case 'unlink':
        return 'Hủy liên kết';

      default:
        return state ? state.charAt(0).toUpperCase() + state?.slice(1) : state;
    }
  };

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
      TRANSFER_MONEY:"Chuyển tiền",
      OPEN_EWALLET_PAYMENT : "Thanh toán ví", 
    };
    return lanObj[text] || text;
  };

  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        name: t('Mã GD'),
        minWidth: '200px',
        cell: (row) => {
          return <div>{row?.transactionId}</div>;
        },
      },
      {
        name: t('Giá Trị GD'),
        minWidth: '150px',
        right: true,
        cell: (row) => {
          return row?.amount !== -1 ? (
            <div
              className={`amount ${
                row?.changed === '+' ? 'positive' : row?.changed === '-' ? 'negative' : ''
              }`}>
              {(row?.changed ? row.changed : '') + formatCurrency(row?.amount)}
            </div>
          ) : (
            <div>******</div>
          );
        },
      },
      {
        name: t('Phí'),
        minWidth: '100px',
        right: true,
        cell: (row) => {
          return <div>{formatCurrency(row?.fee)}</div>;
        },
      },
      {
        name: t('Dịch Vụ'),
        minWidth: '340px',
        cell: (row) => {
          return <div>{transService(row?.service?.code)}</div>;
        },
      },
      {
        name: t('Thời gian GD'),
        minWidth: '180px',
        cell: (row) => {
          return <div>{dayjs(row?.createdAt).format('HH:mm:ss DD/MM/YYYY')}</div>;
        },
      },
      {
        name: t('Trạng Thái GD'),
        center: true,
        minWidth: '160px',
        cell: (row) => {
          return (
            <div className={`state ${row?.state.toLowerCase()}`}>{convertState(row?.state)}</div>
          );
        },
      },
      {
        name: t('Trạng thái DV'),
        center: true,
        minWidth: '160px',
        cell: (row) => {
          return (
            <div className={`state ${row?.service?.state.toLowerCase()}`}>
              {convertState(row?.service?.state)}
            </div>
          );
        },
      },
      {
        name: t('Diễn giải'),
        minWidth: '400px',
        cell: (row) => {
          return <div>{row?.description}</div>;
        },
      },
    ],
    [lang]
  );

  return (
    <div>
      <DataTableCustom
        isLoading={isLoading}
        columns={columns}
        dataList={data}
        t={t}
        getDataList={getDataList}
        {...rest}
      />
    </div>
  );
}

export default DataTableTransactionHistory;
