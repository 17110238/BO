import {
  Account,
  connectionTypeMcEnum,
  MaxRangeBusinessEnum,
  MerchantTypeEnum,
  ProcessListType,
  stateMcEnum,
  StoreMerchant,
} from '../index';
//import { sendContractMerchant } from './../../redux/actions/merchantAction';
import { FeeMerchantConfig } from './feeState';

export interface MerchantState {
  loading: boolean;
  loadingModal: boolean;
  merchantInfoArray: MerchantAccount[];
  approvalMerchantArray: MerchantAccount[];
  merchantProfile: MerchantAccount;
  merchantFee: FeeMerchantConfig;
  methodChecked: string[] | number[];
  pendingListMerchant: RequestChangeType[];
  totalPendingMerchant: number;
  logsType: LogsType[];
  logsFee: LogsTransactionFee[];
}
enum appraisalStateEnum {
  NEW = 'NEW',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

enum ContractStateEnum {
  VALID = "VALID",
  EXPIRED = "EXPIRED"
}

export interface MerchantAccount {
  merchantId?: string;
  contactInfo?: ContactInfoType;
  businessOverview?: BusinessOverviewType;
  businessDetails?: BusinessDetailsType;
  accountInfo?: Account;
  benefitOwner?: benefitOwnerInput;
  paymentMethod?: PaymentMethodType[];
  paymentMethodExtend?: PaymentMethodExtendType[];
  paymentMethodUse?: number[];
  crossCheckInfo?: CrossCheckInfoType;
  createdAt?: string;
  approvedAt?: string;
  updatedAt?: string;
  state?: stateMcEnum;
  rejectReason?: string[];
  authType?: string;
  withdrawVerifyType?: string;
  minBalance?: number;
  connectionTypeList?: string[];
  services?: string[];
  isActive?: boolean;
  isShift?: boolean;
  delegate?: DelegatesType[];
  stores?: StoreMerchant[];
  notifyTelegram?: NotifyTelegramType;
  isSecurityPayout?: boolean;
  currency?: string;
  operator?: OperatorType[] | number[];
  categoryNameDefault?: string;
  emailBcc?: [string];
  appraisalState?: appraisalStateEnum;
  product?: string;
  contractDateStart?: string;
  contractDateEnd?: string;
  contractState?: ContractStateEnum

}

export interface benefitOwnerInput {
  fullname?: string;
  birthday?: string;
  identifyNumber?: string;
  issueDate?: string;
  issuePlace?: string;
  email?: string;
  nationality?: string;
}

export interface ContactInfoType {
  name?: string;
  email?: string;
  phone?: string;
  identifyNumber?: string;
  issuePlace?: string;
  birthday?: string;
  issueDate?: string;
  position?: string;
  nationality?: string;
}

export interface BusinessOverviewType {
  type?: string;
  category?: string;
  categoryName?: string;
  abbreviationName?: string;
  brandName?: string;
  description?: string;
  maxRange?: any;
  connectionType?: string;
  homeUrl?: string;
  taxCode?: string;
  address?: string;
  province?: string;
  district?: string;
  wards?: string;
  locationIdentifyCode?: string;
  maxAmountTransaction?: number;
  logo?: string;
  averageIncome?: string;
  totalRevenue?: string;
  operatingStaff?: string;
  companyAddress?: CompanyMerchantAddressType;
  shareholders?: ShareHolderType[];
  benefitOwner?: benefitOwnerType;
}

export interface benefitOwnerType {
  fullname?: string;
  birthday?: string;
  identifyNumber?: string;
  issueDate?: string;
  issuePlace?: string;
  email?: string;
  nationality?: string;
}

export interface CompanyMerchantAddressType {
  name?: string;
  address?: string;
  phoneNumber?: string;
}

export interface FilterSearchParams {
  filter?: {
    type?: MerchantTypeEnum;
    merchantId?: number;
    accountId?: number;
    search?: string;
    state?: stateMcEnum;
    createAt?: {
      from?: Date | string;
      to?: Date | string;
    };
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt?: number;
    updatedAt?: number;
    approvedAt?: number;
  };
}

export interface BusinessOverviewType {
  type?: string;
  category?: string;
  categoryName?: string;
  abbreviationName?: string;
  brandName?: string;
  description?: string;
  maxRange?: any;
  connectionType?: string;
  homeUrl?: string;
  taxCode?: string;
  address?: string;
  province?: string;
  district?: string;
  wards?: string;
  locationIdentifyCode?: string;
  maxAmountTransaction?: number;
}

export interface BusinessDetailsType {
  identifyImages?: string[] | [];
  executiveMemberList?: string[] | [];
  licenseImages?: string[] | [];
  representativeContracts?: string[] | [];
  chiefAccountantAppointment?: string[] | [];
  benefitOwnerDocument?: string[] | [];
  merchantContract?: {
    contractId?: number;
    contractCode?: string;
    fileName?: string;
    url?: string;
  };
  otherImages?: string[] | [];
}

export interface CrossCheckInfoType {
  isOwner?: boolean;
  isUseBank?: boolean;
  isAllowCrossCheck?: boolean;
  crossCheckNum?: number;
  type?: TypeCrossCheckEnum;
}

export enum TypeCrossCheckEnum {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  OFF = 'OFF',
}

export interface PaymentMethodExtendType {
  method?: number;
  extraData?: ExtraDataType | string;
}
export interface ExtraDataType {
  isTransferNow: boolean;
  type?: string;
  serviceCode?: string;
  supplier?: string;
  storeCode?: string;
  isCapture?: boolean;
  is3DSecure?: boolean;
  mid?: string;
  accessKey?: string;
  serectKey?: string;
  partnerCode?: string;
  appId?: string;
  key1?: string;
  key2?: string;
  appUser?: string;
  forexExchangeType?: ForexType;
}

export enum ForexType {
  REUTER = 'REUTER',
  VCB = 'VCB',
  VCB_SELL = 'VCB_SELL',
  VCB_BUY = 'VCB_BUY',
}
export interface PaymentMethodType {
  referId?: number;
  issuer?: {
    id?: number;
    name?: string;
    group?: string;
  };
  supplier?: {
    id?: number;
    name?: string;
  };
  paymentType?: {
    mainType?: string;
    subType?: string;
  };
  fee?: {
    normal?: FeeType;
    ecommerce?: FeeType;
    cobo?: FeeType;
    pobo?: FeeType;
  };
}

export interface FeeType {
  gateway?: number;
  fixedGateway?: number;
  transaction?: number;
  fixedTransaction?: number;
}

export interface MerchantFeeType {
  ecommerceFeeList: MerchantFeeItemType[];
  coboFeeList: MerchantFeeItemType[];
  poboFeeList: MerchantFeeItemType[];
}

export interface MerchantFeeItemType {
  paymentMethodId: number;
  paymentMethodName: string;
  gatewayFee: MerchantFeeValueType;
  fixedGatewayFee: MerchantFeeValueType;
  transactionFee: MerchantFeeValueType;
  fixedTransactionFee: MerchantFeeValueType;
}

export interface MerchantFeeValueType {
  isDefault: boolean;
  value: number;
}

export interface PayloadApproveMerchant {
  merchantId: number;
  submittedAccountId?: number;
}

export interface PayloadRejectMerchant extends PayloadApproveMerchant {
  rejectReason: string[];
}

export interface PayloadChangePasswordMerchant {
  accountId: number;
  password: string;
  newPassword: string;
  rePassword: string;
}

export interface DelegatesType {
  accountId?: number;
  fullname?: string;
  phone?: string;
  email?: string;
  isActivePasswordTrading?: boolean;
  passwordTrading?: string;
  role?: string;
  tokenVerify?: string;
  username?: string;
  isActive?: boolean;
  createdAt: string;
  password?: string;
}

export interface PayloadUpdateActiveAccountMerchant {
  merchantId: number;
  delegateId: number;
  isActive: boolean;
}
export interface SendContractMerchant {
  merchantId: number;
  description: string;
  createdAt?: {
    from: string;
    to: string;
  };
}

export interface GetRequestChangeInput {
  filter?: {
    requestId?: number;
    createdAt?: {
      from?: Date | string;
      to?: Date | string;
    };
    code?: string;
    groupId?: string;
    targetCode?: string;
    state?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    id?: number;
  };
  clientId?: string;
}

export interface GetRequestChangeResponsed {
  succeeded: boolean;
  message: string;
  data: RequestChangeType[];
}

export interface RequestChangeType {
  id?: number;
  transactionId?: string;
  tag?: {
    code?: string;
    title?: string;
    groupId?: string;
  };
  src?: {
    code?: string;
    title?: string;
  };
  target?: [
    {
      code?: string;
      title?: string;
    }
  ];
  requestData?: {
    original?: {
      phone?: string;
      isActive?: boolean;
    };
    change?: {
      phone?: string;
      isActive?: boolean;
      note?: string;
    };
  };
  description?: string;
  projectName?: string;
  ipnUrl?: string;
  history?: [
    {
      state?: string;
      createdAt?: string;
      extraData?: {
        order?: number;
        accountId?: number;
        reason?: string;
      };
    }
  ];
  processList?: ProcessListType[];
  approvers?: [
    {
      approver?: string;
      state?: string;
      order?: number;
    }
  ];
  isTurn?: boolean;
  state?: string;
  createdAt?: string;
  remainBlockedTime?: number;
  isLocked?: boolean;
}

// Model of create account mc
export interface RegisterBusinessDetailInput {
  identifyImages?: string[] | [];
  chiefAccountantAppointment?: string[] | [];
  benefitOwnerDocument?: string[] | [];
  representativeContracts?: string[] | [];
  executiveMemberList?: string[] | [];
  licenseImages?: string[] | [];
  contracts?: string[] | [];
}

export interface RegisterContactInfoInput {
  fullname?: string;
  phone?: string;
  email?: string;
}

export interface RegisterBusinessOverviewInput {
  type?: MerchantTypeEnum | any;
  abbreviationName?: string;
  categoryName?: string;
  description?: string;
  maxRange?: MaxRangeBusinessEnum | any;
  address?: string;
  province?: string;
  district?: string;
  wards?: string;
  country?: string;
  locationIdentifyCode?: string;
  connectionType?: connectionTypeMcEnum | any;
  website?: string;
  brandName?: string;
}

export interface CreateMerchantInput {
  contactInfo?: RegisterContactInfoInput;
  businessOverview?: RegisterBusinessOverviewInput;
  businessDetails?: RegisterBusinessDetailInput;
}
export interface AprrovedPendingRequestInput {
  requestId: number;
}

export interface RejectPendingRequestInput {
  requestId: number;
  reason: string;
}

export interface ChangedInfoType {
  path?: string;
  before?: string[];
  after?: string[];
}

export interface GetChangedInfoInput {
  id: number;
}

export interface NotifyTelegramType {
  payout: string;
  payment: string;
}

export interface OperatorType {
  accountId: number;
  username: string;
}

export interface LogsType {
  jsonData: string;
  action: string;
  ip: string;
  userName: string;
  fullName: string;
  internalAccountId: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetAccountMerchantLogInput {
  search?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface PayloadDisableSettlement {
  merchantId: number;
  amount: number;
  dateNumber: number;
  startDay: string;
  endDay: string;
}

export interface PayloadRequestActiveMerchant {
  id: number;
  isActive: boolean;
}

export interface LogsTransactionFee {
  paymentMethodId?: string;
  gateway?: number;
  fixedGateway?: number;
  transaction?: number;
  fixedTransaction?: number;
  accountId?: number;
  fullname?: string;
  username?: string;
  description: string;
  images: string[];
  merchantId?: string;
  type?: string;
  value?: TransactionFee;
  jsonBeforeParams?: TransactionFee;
  jsonAfterParams?: TransactionFee;
  createdAt?: Date;
}

export interface TransactionFee {
  gateway?: number;
  fixedGateway?: number;
  transaction?: number;
  fixedTransaction?: number;
}

export interface FilterLogTransactionFeeInput {
  filter?: {
    search?: string;
    createdAt: {
      from?: string;
      to?: string;
    };
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}
export interface GetMerchantActiveInfoResponsed {
  merchantId: number;
  title: string;
  isActive: boolean;
}

export interface GetAccountActiveInfoResponsed extends GetMerchantActiveInfoResponsed {
  accountId: number;
  username: string;
}

export interface ShareHolderType {
  fullname?: string;
  identifyNumber?: string;
  title?: string;
  capitalRatio?: string;
  nationality?: string;
}
