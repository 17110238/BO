import { ChangedInfoType } from 'models';
import { DefaultFeeMerchantConfig } from 'models/account/feeState';

export interface UtilityReducerState {
  loading?: boolean;
  paymentMethods: PaymentMethod[];
  locations: LocationType[];
  mccCodes: MccCodeListType[];
  listBank: BankType[];
  defaultMerchantFee: DefaultFeeMerchantConfig;
  GetAppInfoData: GetAppInfoData[];
  GetNationality: GetNationality[]
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  paymentType: string;
  subPaymentType: string;
  payCode: string;
  payMethod: string;
  identifyCode: string;
  path: string;
  parentIdentifyCode: string;
  iconUrl: string;
}

export interface BankType {
  shortName: string;
  swiftCode: string;
  engName: string;
  viName: string;
}
export interface LocationType {
  id?: number;
  identifyCode?: string;
  path?: string;
  title?: string;
  parentIdentifyCode?: string;
  parentPath?: {
    identifyCode?: string;
    path?: string;
    title?: string;
  }[];
}

export interface LocationSearchPayload {
  parentIdentifyCode?: string;
  identifyCode?: string;
}

export interface MccCodeListType {
  id: number;
  code?: string;
  content: string;
  contentEN: string;
  approvedAccountId?: string;
  maxAmountTransaction: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatedAtInput {
  from?: string;
  to?: string;
}

export interface PagingInput {
  start?: number;
  limit?: number;
}
export interface ChangedFeeType {
  method?: string;
  data?: {
    type?: string;
    changedInfo?: {
      path?: string;
      before?: string[];
      after?: string[];
    }[];
  }[];
}

export interface noteInfoFeeType {
  images?: string[];
  description?: string;
}

export interface MethodChangedFeeType {
  type?: string;
  changedInfo?: ChangedInfoType[];
}

export interface PayloadFilterMccCodeType {
  filter?: {
    code?: string;
    from?: number;
    to?: number;
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}
export interface PayloadFilterMccCodeContentType {
  filter?: {
    codeContent?: string;
    from?: number;
    to?: number;
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}
export interface GetAppInfoInput {
  filter?: {
    name?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}

export interface GetAppInfoData {
  store?: {
    name?: string;
    id?: number;
    merchantId?: string;
  }[];
  tags?: {
    key?: string;
    value?: string;
  }[];
  services?: {
    key?: string;
    value?: string;
  }[];
}

export interface PaymentMethodFullType {
  paymentMethod?: {
    payCode?: string;
    name?: string;
  }
  supplier?: string[];
  issuer?: string[];
}

export interface SupplierPaymentMethodFullType {
  supplierName?: string;
  issuer?: string[];
}

export interface GetMerchantSDKInput {
  search?: string;
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface GetChangedStateCoboPoboResponsed {
  succeeded?: boolean;
  message?: string;
  transaction?: string;
  data?: {
    path?: string;
    before?: string[];
    after?: string[];
  }[]
}
export interface NationalityType {
  label: string;
  value: string;
  }
export interface GetNationality {
  data:NationalityType[];
}