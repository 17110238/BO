import {
  EwalletAccount,
  MethodEWalletTransactionBOEnum,
  MethodRefundEWalletTransactionBOEnum,
  ServiceEWalletTransactionBOEnum,
  StateEWalletTransactionBoEnum,
  SupplierTransSearchTypeEnum,
  SupplierTransServiceEnum,
  TagEWalletTransactionBoEnum,
} from 'models';

export interface EWalletTransactionBO {
  id?: number;
  transactionId?: string;
  accountId?: number;
  phone?: string;
  amount?: number;
  changed?: string;
  fee?: number;
  total?: number;
  discount?: number;
  bonus?: number;
  cashback?: number;
  tags?: [string];
  service?: ServiceEWalletTransactionBO;
  createdAt?: number;
  updatedAt?: number;
  state?: string;
  description?: string;
  extraData?: string;
  paymentMethod?: string;
  payment?: PaymentEWalletTransactionBO;
  transport?: TransportEWalletTransactionBO;
  method?: MethodEWalletTransactionBO;
  isVisible?: boolean;
  via?: string;
  publishedAt?: number;
  partnerId?: number;
  appId?: number;
  supplierMobileCard?: SupplierMobileCardEWalletTransactionBO;
  supplierMobileTopup?: SupplierMobileTopupEWalletTransactionBO;
  supplierBill?: SupplierBillEWalletTransactionBO;
}

export interface SupplierMobileCardEWalletTransactionBO {
  accountId?: number;
  amount?: number;
  total?: number;
  discount?: number;
  fee?: number;
  quantity?: number;
  partnerTransaction?: string;
  supplier?: string;
  transaction?: string;
  description?: string;
  cardInfo?: CardInfoSupplierMobileCardEWalletTransactionBO[];
  state?: string;
  payment?: string;
  supplierResponsed?: string;
  extraData?: string;
  isRefunded?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierMobileTopupEWalletTransactionBO {
  accountId?: number;
  amount?: number;
  total?: number;
  discount?: number;
  fee?: number;
  quantity?: number;
  partnerTransaction?: string;
  supplier?: string;
  transaction?: string;
  description?: string;
  phone?: string;
  type?: string;
  state?: string;
  payment?: string;
  supplierResponsed?: string;
  extraData?: string;
  isRefunded?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardInfoSupplierMobileCardEWalletTransactionBO {
  amount?: number;
  total?: number;
  discount?: number;
  serial?: string;
  pin?: string;
  expiredAt?: string;
  saleDate?: string;
  state?: string;
}

export interface SupplierBillEWalletTransactionBO {
  accountId?: number;
  customerBillId?: number;
  amount?: number;
  total?: number;
  transaction?: string;
  fee?: number;
  bankTransaction?: string;
  partnerTransaction?: string;
  description?: string;
  customerInfo?: CustomerInfoSupplierBillEWalletTransactionBO;
  type?: string;
  supplierInfo?: SupplierInfoSupplierBillEWalletTransactionBO;
  studentInfo?: StudentInfoSupplierBillEWalletTransactionBO;
  state?: string;
  gateway?: string;
  paymentPeriod?: string;
  payment?: string;
  supplierResponsed?: string;
  extraData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfoSupplierBillEWalletTransactionBO {
  id?: string;
  fullname?: string;
  address?: string;
}

export interface SupplierInfoSupplierBillEWalletTransactionBO {
  fullname?: string;
  code?: string;
}

export interface StudentInfoSupplierBillEWalletTransactionBO {
  studentName?: string;
  schoolName?: string;
  schoolCode?: string;
  className?: string;
  classCode?: string;
}

export interface ServiceEWalletTransactionBO {
  code?: string;
  type?: string;
  name?: string;
  id?: number;
  serviceAt?: number;
  method?: string;
  serviceMethod?: ServiceMethodEWalletTransactionBO;
  transaction?: string;
  state?: string;
  data?: string;
}

export interface ServiceMethodEWalletTransactionBO {
  id?: number;
  registerId?: string;
  group?: string;
  info?: string;
  description?: string;
}

export interface PaymentEWalletTransactionBO {
  id?: number;
  transaction?: string;
  method?: string;
  state?: string;
  description?: string;
  extraData?: ExtraDataPaymentEWalletTransactionBO;
}

export interface ExtraDataPaymentEWalletTransactionBO {
  resolveType?: string;
  paymeCreditNo?: number;
  packageId?: number;
}

export interface TransportEWalletTransactionBO {
  accountId?: number;
  transportId?: number;
  transaction?: string;
  state?: string;
  method?: string;
  description?: string;
}

export interface MethodEWalletTransactionBO {
  id?: number;
  registerId?: string;
  group?: string;
  info?: string;
  description?: string;
  bankInfo?: string;
}

export interface SearchEWalletTransactionInput {
  filter?: {
    select?: {
      phone?: string;
      transactionId?: string;
      accountId?: number;
      id?: number;
      paymentTransaction?: string;
      transportTransaction?: string;
    };
    createdAt?: {
      from?: number;
      to?: number;
    };
    appId?: number;
    tags?: TagEWalletTransactionBoEnum;
    state?: StateEWalletTransactionBoEnum;
    code?: ServiceEWalletTransactionBOEnum;
    method?: MethodEWalletTransactionBOEnum;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface RefundEWalletTransactionInput {
id: number
}

export interface SearchSupplierTransactionInput {
  filter?: {
    service?: SupplierTransServiceEnum;
    searchType?: SupplierTransSearchTypeEnum;
    searchValue?: string;
    createdAt?: {
      from?: string;
      to?: string;
    };
  };
  paging?: {
    start?: number;
    limit: number;
  };
  sort?: {
    createdAt?: number;
  };
}

export interface SupplierTransactionType {
  SSCCBillObject: SSCCBillObject;
  OCBBillObject: OCBBillObject;
  EstioBillObject: EstioBillObject;
  GateCardObject: GateCardObject;
  GateTopUpObject: GateTopUpObject;
  NapasTransactionObject: NapasTransactionObject;
  PVCombankTransactionObject: PVCombankTransactionObject;
  OCBBankTransactionObject: OCBBankTransactionObject;
  BIDVTransactionObject: BIDVTransactionObject;
}

export interface SSCCBillObject {
  id: number;
  transaction: string;
  total: number;
  fee: number;
  feeLater: number;
  state: string;
  customerName: string;
  customerClass: string;
  customerSchool: string;
  customerAddress: string;
  createdAt: string;
  accountInfo: EwalletAccount;
}

export interface OCBBillObject {
  id: number;
  accountId: string;
  transaction: string;
  total: number;
  fee: number;
  state: string;
  typeTransaction: string;
  description: string;
  bankTransaction: string;
  supplierCode: string;
  supplierName: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  createdAt: string;
  accountInfo: EwalletAccount;
}

export interface EstioBillObject {
  id: number;
  transaction: string;
  total: number;
  fee: number;
  state: string;
  typeTransaction: string;
  description: string;
  bankTransaction: string;
  supplierCode: string;
  supplierName: string;
  customerId: string;
  customerName: string;
  customerClass: string;
  customerSchool: string;
  customerAddress: string;
  createdAt: string;
  accountInfo: EwalletAccount;
}

export interface BSWithdrawObject {
  id: number;
  transaction: string;
  total: number;
  state: string;
  fee: number;
  method: string;
  description: string;
  bankTransaction: string;
  customerName: string;
  customerBankAccount: string;
  createdAt: string;
  accountInfo: EwalletAccount;
}

export interface GateCardObject {
  id: number;
  transaction: string;
  serial: string;
  total: number;
  fee: number;
  discount: number;
  cashback: number;
  state: string;
  description: string;
  supplier: string;
  createdAt: string;
  accountInfo: EwalletAccount;
}

export interface GateTopUpObject {
  id: number;
  transaction: string;
  total: number;
  fee: number;
  discount: number;
  cashback: number;
  state: string;
  description: string;
  supplier: string;
  createdAt: string;
  accountInfo: EwalletAccount;
}

export interface NapasTransactionObject {
  transaction: string;
  supplierTransaction: string;
  transTime: number;
  bankAccount: string;
  total: number;
  amount: number;
  fee: number;
  transType: string;
  state: string;
  content: string;
  description: string;
  supplier: string;
  supplierResponse: [string];
  accountInfo: EwalletAccount;
  bankInfo: BankCodeType;
}

export interface PVCombankTransactionObject {
  transaction: string;
  supplierTransaction: string;
  transTime: number;
  bankAccount: string;
  total: number;
  amount: number;
  fee: number;
  transType: string;
  state: string;
  description: string;
  content: string;
  supplier: string;
  supplierResponse: [string];

  bankInfo: BankCodeType;
  accountInfo: EwalletAccount;
}

export interface OCBBankTransactionObject {
  transaction: string;
  supplierTransaction: string;
  transTime: number;
  bankAccount: string;
  requestId: string;
  total: number;
  amount: number;
  fee: number;
  transType: string;
  state: string;
  description: string;
  supplier: string;
  createdAt: string;
  supplierResponse: [string];
  bankInfo: BankCodeType;
}

export interface BIDVTransactionObject {
  transaction: string;
  supplierTransaction: string;
  transTime: number;
  bankAccount: string;
  requestId: string;
  total: number;
  amount: number;
  fee: number;
  transType: string;
  state: string;
  description: string;
  supplier: string;
  createdAt: string;
  supplierResponse: [string];
  bankInfo: BankCodeType;
}

export interface BankCodeType {
  shortName: string;
  swiftCode: string;
  engName: string;
  viName: string;
}

export interface GetEWalletTransactionDetailInput {
  id: number
}
