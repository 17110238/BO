export * from './account/accountMerchant';
export * from './account/accountState';
export * from './account/feeState';
export * from './account/merchantState';
export * from './accountantCrossCheck/accountantBalanceMerchant';
export * from './accountantCrossCheck/accountantCrossCheck';
export * from './cttReportTransaction';
export * from './customerSuport/customerSuport';
export * from './emailInfoMerchant/emailInforMerchant';
export * from './eWalletAccount/connectedUser';
export * from './eWalletAccount/ewalletAccountState';
export * from './eWalletBankTransaction';
export * from './eWalletIsec';
export * from './eWalletPaymeTransfer/eWalletPaymeTransferState';
export * from './eWalletReportBo';
export * from './eWalletSocialPayment';
export * from './eWalletTransaction';
export * from './eWalletTransaction/getTopReport';
export * from './eWalletWordFillter';
export * from './eWalletWordFillter/index';
export * from './infoCensor';
export * from './manualBank/manualBank';
export * from './notify';
export * from './processingFlow/processingFlowState';
export * from './ReportEwalletMC';
export * from './reportMerchant/reportMerchantState';
export * from './reportPartner';
export * from './reportWallet';
export * from './revenueStatistics';
export * from './settingDeposit/settingDeposit';
export * from './settingSystem/settingSystem';
export * from './store/storeState';
export * from './telco';
export * from './template/templateState';
export * from './transaction/transactionState';
export * from './user/userState';
export * from './utitlity/utilityState';
export * from './version/versionState';
export * from './wallet';
export * from './walletKyc/walletKycState';
export * from './walletReport';
export * from './withdrawal/withdrawalState';
export * from './loginHistory';
export * from './reportAgent';
export * from './eWalletBankReport/eWalletBankReportState';
export * from './eWalletLoanPackage';
export * from './eWalletManagerAccountPayme';

export interface ActionReducer {
  type: string;
  payload: any;
}
export interface CallbackResponse {
  (state: boolean, res: any): void;
}

export interface SagaAction<T> {
  payload?: T;
  callback?: CallbackResponse;
}
export enum ProfileAliasActionEnum {
  UPDATE = 'UPDATE',
  REJECT = 'REJECT',
}

export enum AccetedFile {
  excel = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  word = 'application/msword',
  pdf = 'application/pdf',
  img = 'image/*',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum AccountTypeEnum {
  PARTNER = 'PARTNER',
  MERCHANT = 'MERCHANT',
  STORE = 'STORE',
  CASHIER = 'CASHIER',
  ADMIN = 'ADMIN',
}

export enum EwalletPaymentBoState {
  SUCCEEDED = 'SUCCEEDED',
  PENDING = 'PENDING',
}

export enum StateEnum {
  OPENED = 'OPENED',
  LOCKED = 'LOCKED',
  TEMPORARY_LOCK = 'TEMPORARY_LOCK',
}

export enum StateTransactionEnum {
  SUCCEEDED = 'SUCCEEDED',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
  CANCELED_SUCCEEDED = 'CANCELED_SUCCEEDED',
  RECEIVED = 'RECEIVED',
  USED = 'USED',
  ESCROW = 'ESCROW',
  CLAIMED = 'CLAIMED',
  DENIED = 'DENIED',
  AUTHORIZED = 'AUTHORIZED',
}
export enum MerchantTypeEnum {
  ENTERPRISE = 'ENTERPRISE',
  INDIVIDUAL = 'INDIVIDUAL',
  FOREIGN_ENTERPRISE = 'FOREIGN_ENTERPRISE',
  FOREIGN_INDIVIDUAL = 'FOREIGN_INDIVIDUAL',
}

export enum stateMcEnum {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CONTRACT = 'CONTRACT',
  CONTRACT_APPROVING = 'CONTRACT_APPROVING',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  APPROVING = 'APPROVING',
  APPROVED = 'APPROVED',
}

export enum KycStateReportUserEnum {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  CANCELED = 'CANCELED',
  BANNED = 'BANNED',
}

export enum stateWalletKYCEnum {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  PENDING_IC = 'PENDING_IC',
  BANNED = 'BANNED',
  AUTO_APPROVED = 'AUTO_APPROVED',
  MANUAL_APPROVED = 'MANUAL_APPROVED',
  FILLING = 'FILLING',
  FAIL_FILLED = 'FAIL_FILLED',
  MANUAL_REJECTED = 'MANUAL_REJECTED',
}

export enum typeEnumCard {
  LOCKED = 'LOCKED',
  OPEN = 'OPEN',
}

export enum typeEnumListCard {
  ATM = 'ATM',
  CREDIT_INTERNATIONAL = 'CREDIT_INTERNATIONAL',
  CREDIT_DOMESTIC = 'CREDIT_DOMESTIC',
}

export enum MethodTransactionEnum {
  VN_PAY = 'VN_PAY',
  PAYME = 'PAYME',
  ATM = 'ATM',
  ALIPAY_DIRECT = 'ALIPAY_DIRECT',
  ALIPAY_ECOMMERCE = 'ALIPAY_ECOMMERCE',
  ISEC = 'ISEC',
  MANUAL_BANK = 'MANUAL_BANK',
  XNAP = 'XNAP',
  THAIQR = 'THAIQR',
  CREDIT = 'CREDIT',
  MOMO = 'MOMO',
  ZALO_PAY = 'ZALO_PAY',
  WEBMONEY = 'WEBMONEY',
  CREDIT_INTERNATIONAL = 'CREDIT_INTERNATIONAL',
  PAYNOW = 'PAYNOW',
  VIETQR = 'VIETQR',
}

export enum connectionTypeMcEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum TagEWalletTransactionBoEnum {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  MOBILE_CARD = 'MOBILE_CARD',
  MOBILE_TOPUP = 'MOBILE_TOPUP',
  BILL = 'BILL',
  ISEC = 'ISEC',
  ISEC_CREATE = 'ISEC_CREATE',
  CASHBACK = 'CASHBACK',
  SOCIAL = 'SOCIAL',
  SOCIAL_PAYMENT = 'SOCIAL_PAYMENT',
  INTERNAL = 'INTERNAL',
  LINKED = 'LINKED',
  BONUS = 'BONUS',
  DISCOUNT = 'DISCOUNT',
  PAYMENT = 'PAYMENT',
  RECEIVE_MONEY = 'RECEIVE_MONEY',
  DEPOSIT_BANK_MANUAL = 'DEPOSIT_BANK_MANUAL',
  PAYME_SALARY = 'PAYME_SALARY',
  ADD_MONEY = 'ADD_MONEY',
}

export enum LinkedBankEnum {
  PHONE = 'PHONE',
  ACCOUNT_ID = 'ACCOUNT_ID',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export enum LinkedStateEnum {
  NEW = 'NEW',
  LINKED = 'LINKED',
  LOCKED = 'LOCKED',
  UNLINK = 'UNLINK',
  FAILED = 'FAILED',
  REQUIRED_OTP = 'REQUIRED_OTP',
  REQUIRED_VERIFY = 'REQUIRED_VERIFY',
}

export enum StateEWalletTransactionBoEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export enum ServiceEWalletTransactionBOEnum {
  BILL = 'BILL',
  ISEC = 'ISEC',
  SALARY = 'SALARY',
  CASHBACK = 'CASHBACK',
  ISEC_BULK = 'ISEC_BULK',
  ISEC_REDEEM = 'ISEC_REDEEM',
  ISEC_SCRATCH = 'ISEC_SCRATCH',
  ISEC_SEND = 'ISEC_SEND',
  ISEC_SAVE = 'ISEC_SAVE',
  ISEC_RECEIVED = 'ISEC_RECEIVED',
  ISEC_DONATED = 'ISEC_DONATED',
  CANCEL_ISEC = 'CANCEL_ISEC',
  SOCIAL_LINK = 'SOCIAL_LINK',
  SOCIAL_PAYMENT = 'SOCIAL_PAYMENT',
  SOCIAL_DONATE_MONEY_LINK = 'SOCIAL_DONATE_MONEY_LINK',
  SOCIAL_DONATE_MONEY = 'SOCIAL_DONATE_MONEY',
  SOCIAL_REQUEST_MONEY_LINK = 'SOCIAL_REQUEST_MONEY_LINK',
  SOCIAL_SEND_MONEY = 'SOCIAL_SEND_MONEY',
  SOCIAL_SEND_MONEY_LINK = 'SOCIAL_SEND_MONEY_LINK',
  SOCIAL_PAYME_RECEIVE_MONEY = 'SOCIAL_PAYME_RECEIVE_MONEY',
  SOCIAL_NAPAS_RECEIVE_MONEY = 'SOCIAL_NAPAS_RECEIVE_MONEY',
  SOCIAL_SEND_MONEY_LINK_RECIPIANT = 'SOCIAL_SEND_MONEY_LINK_RECIPIANT',
  REFUND_MONEY = 'REFUND_MONEY',
  ADD_MONEY = 'ADD_MONEY',
  MINUS_MONEY = 'MINUS_MONEY',
  WITHDRAW_BANK_MANUAL = 'WITHDRAW_BANK_MANUAL',
  DEPOSIT_BANK_MANUAL = 'DEPOSIT_BANK_MANUAL',
  LINKED = 'LINKED',
  DEPOSIT_PVCBANK = 'DEPOSIT_PVCBANK',
  WITHDRAW_PVCBANK = 'WITHDRAW_PVCBANK',
  WITHDRAW_PAYME = 'WITHDRAW_PAYME',
  MOBILE_CARD = 'MOBILE_CARD',
  MOBILE_TOPUP = 'MOBILE_TOPUP',
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
  WITHDRAW_BANK_GATEWAY = 'WITHDRAW_BANK_GATEWAY',
  WITHDRAW_BANK_LINKED_PVCBANK = 'WITHDRAW_BANK_LINKED_PVCBANK',
  WITHDRAW_BANK_LINKED_GATEWAY = 'WITHDRAW_BANK_LINKED_GATEWAY',
  WITHDRAW_BANK_LINKED_OCBBANK = 'WITHDRAW_BANK_LINKED_OCBBANK',
  PAYME_SEND_MONEY = 'PAYME_SEND_MONEY',
  PAYME_RECEIVE_MONEY = 'PAYME_RECEIVE_MONEY',
  TRANSFER_PAYME = 'TRANSFER_PAYME',
  GATEWAY_PAYMENT = 'GATEWAY_PAYMENT',
  SOCIAL_PAYMENT_REQUEST_MONEY_LINK = 'SOCIAL_PAYMENT_REQUEST_MONEY_LINK',
  SOCIAL_PAYMENT_RECEIVE_REQUEST_MONEY_LINK = 'SOCIAL_PAYMENT_RECEIVE_REQUEST_MONEY_LINK',
  SOCIAL_PAYMENT_SEND_MONEY_LINK = 'SOCIAL_PAYMENT_SEND_MONEY_LINK',
  SOCIAL_PAYMENT_DONATE_MONEY_LINK = 'SOCIAL_PAYMENT_DONATE_MONEY_LINK',
  SOCIAL_PAYMENT_PAYME_RECEIVE_MONEY = 'SOCIAL_PAYMENT_PAYME_RECEIVE_MONEY',
  SOCIAL_PAYMENT_NAPAS_RECEIVE_MONEY = 'SOCIAL_PAYMENT_NAPAS_RECEIVE_MONEY',
  SOCIAL_PAYMENT_SEND_MONEY = 'SOCIAL_PAYMENT_SEND_MONEY',
  SOCIAL_PAYMENT_DONATE_MONEY = 'SOCIAL_PAYMENT_DONATE_MONEY',
  ADVANCE_MONEY = 'ADVANCE_MONEY',
  CREDIT_STATEMENT = 'CREDIT_STATEMENT',
  CREDIT_SETTLEMENT = 'CREDIT_SETTLEMENT',
  PAYME_CREDIT = 'PAYME_CREDIT',
  PAY_QRCODE = 'PAY_QRCODE',
}

export enum MethodEWalletTransactionBOEnum {
  VNPAY = 'VNPAY',
  PAYME = 'PAYME',
  GATEWAY = 'GATEWAY',
  LINKED_GATEWAY = 'LINKED_GATEWAY',
  LINKED_BANK = 'LINKED_BANK',
  LINKED_BANK_OCBBANK = 'LINKED_BANK_OCBBANK',
}

export enum SearchTypeEwalletAccountEnum {
  PHONE = 'PHONE',
  ACCOUNT_ID = 'ACCOUNT_ID',
  FULLNAME = 'FULLNAME',
  ALIASNAME = 'ALIASNAME',
  IDENTIFY = 'IDENTIFY',
}

export enum MethodRefundEWalletTransactionBOEnum {
  PAYME = 'PAYME',
  LINKED_BANK_PVCBANK = 'LINKED_BANK_PVCBANK',
  NAPAS_BANK = 'NAPAS_BANK',
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

interface PagingTransactionAccInput {
  start: number;
  limit: number;
}

interface PagingChangeLogsAccInput {
  start: number;
  limit: number;
}

interface finishedAtMcInput {
  from: string;
  to: string;
}

export interface filterDate {
  from: string;
  to: string;
}

export interface ReportMerchantResponse {
  merchantId: number;
  merchantName: string;
  amountTotal: number;
  feeTotal: number;
  transactionTotal: number;
  crossCheckTotal: number;
  crossCheckAmountTotal: number;
}

export interface TransactionAccInput {
  paging: PagingTransactionAccInput;
}

export interface ReportMcInput {
  finishedAt: finishedAtMcInput;
}

export interface ChangeLogsAccInput {
  paging: PagingChangeLogsAccInput;
}

export interface GetAllReportsOfMerchantResponse {
  message: string;
  succeeded: boolean;
  data: ReportMerchantResponse[];
  totalRow: number;
}

export interface ActionLogAccMc {
  createdAt: Date;
  submittedAccountId: number;
  submittedAccountName: string;
  action: string;
  result: string;
  detail: string;
}
export interface authState {
  loading: false;
  error: false;
  accessToken: string;
  listRole: {}[];
  show: boolean;
  accountInfo: {
    profile: {};
    scope: string[];
    link: string;
    refcode: string;
  };
}

export enum MaxRangeBusinessEnum {
  less100m = 'less100m',
  max1b = 'max1b',
  max10b = 'max10b',
  up10b = 'up10b',
}

export interface ReportInput {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export enum SupplierTransServiceEnum {
  BILL_OCB = 'BILL_OCB',
  BILL_SSCC = 'BILL_SSCC',
  BILL_ESTIO = 'BILL_ESTIO',
  GATE_CARD = 'GATE_CARD',
  GATE_TOPUP = 'GATE_TOPUP',
  NAPAS = 'NAPAS',
  PVCOMBANK = 'PVCOMBANK',
  OCBBANK = 'OCBBANK',
  BIDVBANK = 'BIDVBANK',
}

export enum SupplierTransSearchTypeEnum {
  SSCC_ID = 'SSCC_ID',
  TRANSACTION = 'TRANSACTION',
  PHONE = 'PHONE',
  TRANSACTION_TYPE = 'TRANSACTION_TYPE',
  CUSTOMER_ID = 'CUSTOMER_ID',
  CUSTOMER_NAME = 'CUSTOMER_NAME',
  CUSTOMER_TRANSACTION = 'CUSTOMER_TRANSACTION',
  SUPPLIER_CODE = 'SUPPLIER_CODE',
  BANK_TRANSACTION = 'BANK_TRANSACTION',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  SERIAL = 'SERIAL',
  SUPPLIER = 'SUPPLIER',
}
