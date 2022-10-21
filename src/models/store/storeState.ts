import { TypeCrossCheckEnum } from 'models';
import { object } from 'yup';

export interface StoreState {
  loading: boolean;
  storeList: StoreMerchant[];
  listLogStore: InputLogStore[];
}

export interface delegateStore {
  accountId?: number;
  fullname?: string;
  username?: string;
  phone?: string;
  isAllowCancel?: boolean;
  isActive?: boolean;
  createdAt?: string;
  expiryAt?: string;
  storeName?: string;
}

export interface CrossCheckInfoPayMeType {
  phone: string;
  walletAccountId: string;
  fullname: string;
}

export interface CrossCheckInfoBankType {
  number: string;
  fullname: string;
  swiftCode: string;
  province: string;
  branch: string;
  provinceIdentifyCode: string;
}

export interface StoreMerchant {
  storeId: number;
  storeName: string;
  businessCode: string;
  accountId: number;
  username: string;
  merchantId: number;
  merchantName: string;
  address: string;
  createdAt: string;
  approvedAccountId: number;
  state: string;
  isActive: boolean;
  isShift: boolean;
  website: string;
  paymentForm: PaymentFormEnum;
  logo: string;
  transactionType: TransactionTypeEnum;
  storeImage: string;
  description: string;
  operator: {
    accountId?: number;
    username?: string;
  };
  contact: {
    fullname: string;
    email: string;
    phone: string;
    identifyImages: string[];
  };
  workingTime: [
    {
      open: string;
      close: string;
    }
  ];
  registration: {
    province: string;
    district: string;
    wards: string;
    address: string;
    locationIdentifyCode: string;
    images: string[];
  };
  crossCheckInfo: {
    isOwner: boolean;
    isUseBank: boolean;
    isAllowCrossCheck: boolean;
    crossCheckNum: number;
    type: TypeCrossCheckEnum;
    payME: CrossCheckInfoPayMeType;
    bank: CrossCheckInfoBankType;
  };
  locale: Array<localeTypeInput>;
  paymentMethod: [
    {
      paymentMethodId: number;
      paymentMethodName: string;
      state: string;
      reason: string;
      isActive: boolean;
    }
  ];
  paymentMethodExtend: [
    {
      method: number;
      extraData: string;
    }
  ];
  delegate: Array<delegateStore>;
}

export interface SearchStoreInput {
  filter?: {
    merchantId?: number;
    storeId?: number | number[];
    search?: string;
    createdAt?: {
      from?: string;
      to?: string;
    };
    province?: string;
    district?: string;
    wards?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}

export interface localeTypeInput {
  title: string;
  description: string;
  locale: string;
}

export interface registrationTypeInput {
  address?: string;
  locationIdentifyCode?: string;
  images?: string[];
}

export interface workingTimeTypeInput {
  open?: string;
  close?: string;
}

export interface FormUpdateStore {
  storeId?: number;
  locale?: Array<localeTypeInput>;
  title?: string;
  paymentForm?: PaymentFormEnum;
  phone?: string;
  email?: string;
  website?: string;
  registration?: registrationTypeInput;
  workingTime?: workingTimeTypeInput;
  description?: string;
  logo?: string;
  isShift?: boolean;
  transactionType?: TransactionTypeEnum;
  crossCheckInfo?: CrossCheckInfoInput;
  paymentMethod?: Array<number>;
  bannerInfo?: BannerInfoInput;
  isActive?: boolean;
}

export interface BannerArrInput {
  id?: number;
  showDuration?: number;
  from?: number;
  to?: number;
  createdAt?: Date;
  type?: MediaType;
  link?: string;
}

export interface BannerInfoInput {
  isActive?: boolean;
  banners?: Array<BannerArrInput>;
}

export interface CrossCheckInfoInput {
  isAllowCrossCheck?: boolean;
  isOwner?: boolean;
  isUseBank?: boolean;
  type?: TypeCrossCheckEnum;
  crossCheckNum?: number;
  payME?: CrossCheckInfoPayMeInput;
  bank?: CrossCheckInfoBankInput;
}

export interface CrossCheckInfoPayMeInput {
  phone?: string;
}

export interface CrossCheckInfoBankInput {
  number?: string;
  fullname?: string;
  swiftCode?: string;
  branch?: string;
  provinceIdentifyCode?: string;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum PaymentFormEnum {
  ECOMMERCE = 'ECOMMERCE',
  OFFLINE = 'OFFLINE',
}

export enum TransactionTypeEnum {
  PAYMENT = 'PAYMENT',
  COBO = 'COBO',
}

export interface InputSearchLogStore {
  search?: string;
  createdAt: {
    from?: string;
    to?: string;
  };
  paging: {
    start?: number;
    limit?: number;
  };
}

export interface InputLogStore {
  jsonData?: string;
  action?: string;
  ip?: string;
  userName?: string;
  fullName?: string;
  internalAccountId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InputAlipayStore {
  storeId?: number;
  methodId?: number;
  description?: string;
  title?: string;
}

export interface AlipayStoreTypes {
  merchantId?: string;
  merchantName?: string;
  type?: string;
  state?: string;
  reason?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  accountInfo?: {
    identifyNumber?: string;
    fullname?: string;
  };
  registration?: {
    address?: string;
    country?: string;
    number?: string;
    industryCode?: string;
    image?: {
      front?: string;
      back?: string;
    };
  };
}
