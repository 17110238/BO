import { StateTransactionEnum, MethodTransactionEnum } from '../index';

export enum SearchTypeEnum {
  ALL_ID = 'ALL_ID',
  // TRANSACTION_ID = 'TRANSACTION_ID',
  // PARTNER_TRANSACTION = 'PARTNER_TRANSACTION',
  // SUPPLIER_TRANSACTION = 'SUPPLIER_TRANSACTION',
  // PAYMENT_ID = 'PAYMENT_ID',

  MERCHANT_ID = 'MERCHANT_ID',
  CROSSCHECK_ID = 'CROSSCHECK_ID',
}
export interface TransactionState {
  loadingDrawer: boolean;
  loadingModal: boolean;
  loading: boolean;
  loadingExport: boolean;
  transactionInfoArray: TransactionResponse[];
  transactionDetail: TransactionResponse;
  refundTransactionInfo: RefundTransactionResponse;
  cancelTransactionInfo: CancelTransactionResponse;
  errorExport: errorExport;
}

interface errorExport {
  message: string;
  code?: number | string;
}

interface ClaimedInfo {
  groupId: string;
  files: [string];
  description: string;
  submittedAccountId: string;
  approvedAccountId: string;
  reason: string;
  createdAt: string;
}

export interface TransactionResponse {
  id?: number;
  cardType?: string;
  cardNumber?: string;
  country?: string;
  accountId?: BigInt;
  transactionId?: string; // Mã giao dịch
  orderId?: string; // Mã đơn hàng
  partnerTransaction?: string; // Mã giao dịch đối tác
  supplierId?: string; // Mã nhà cung cấp
  merchantId?: string; // Mã merchant
  supplierName?: string; // Tên nhà cung cấp
  supplierTransaction?: string; // Mã GD nhà cung cấp
  paymentId?: string; // Mã thanh toán
  amount?: number; // Giá trị giao dịch
  fee?: number; // Phí đối soát
  total?: number; // Thực nhận
  method?: string; // Phương thức thanh toán
  issuerName?: string; // Tên nhà phát hành
  createdAt?: string; // Thời gian tạo
  finishedAt?: string; // Thời gian hoàn thành
  updatedAt?: string; // Thời gian cập nhật
  state?: StateTransactionEnum | string; // Trạng thái
  clientIp?: string; // client IP
  description?: string; // Mô tả
  storeId?: string; // Mã cửa hàng
  paymentSubType?: string; // Hình thức
  paymentMainType?: string;
  crossCheckState?: string; // Trạng thái đối soát
  crossCheckId?: string; // Mã đối soát
  storeName?: string; // Tên cửa hàng
  merchantName?: string; // Tên merchant
  transactionType?: string; // loại giao dịch
}

export interface GetDetailTransactionReponse extends TransactionResponse {
  paymeRequested: string;
  extraData: string;
  supplierResponsed: string[];
}

export interface GetAllTransactionsInput {
  filter?: {
    id?: number;
    state?: StateTransactionEnum | string | string[];
    method?: MethodTransactionEnum | string;
    accountId?: number | string | null;
    merchantId?: BigInt;
    createAt?: {
      from?: Date | string;
      to?: Date | string;
    };
    search?: string | undefined;
    searchType?: SearchTypeEnum;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface GetDetailTransactionInput {
  transactionId: string;
}

export interface GetDetailPaymentInput {
  paymentId: string;
}

export interface RefundTransactionResponse {
  transaction?: string;
  message?: string;
  succeeded?: boolean;
}
export interface RefundTransactionInput {
  transaction?: string | undefined;
  partnerTransaction?: string | undefined;
  amount: number | string | undefined;
  reason: string | undefined;
}

export interface CancelTransactionResponse {
  transaction?: string;
  message?: string;
  succeeded?: boolean;
}
export interface CancelTransactionInput {
  transaction?: string | undefined;
  reason: string | undefined;
  partnerTransaction?: string | undefined;
}

export interface GetRefundAmountResponsed {
  message: string;
  succeeded: boolean;
  refundAmount: number;
}

export interface GetRefundAmountInput {
  transactionId: string;
}

export interface UploadPayintInput {
  merchantId: any;
  file: any;
}
export interface UploadPayintInput {
  merchantId: any;
  file: any;
}
