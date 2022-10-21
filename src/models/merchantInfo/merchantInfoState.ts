import { appHistoryData } from 'models/walletHistory/walletHistoryState';

// Search Merchant Info
export interface MerchantInfoState {
  accountId: string;
  loading: boolean;
  loadingLinkedBank: boolean;
  loadingSession: boolean;
  loadingWalletHistory: boolean;
  loadingTransactionHistory: boolean;
  loadingChangeHistory: boolean;
  loadingTransactionReport: boolean;
  loadingRequestCancelWallet: boolean;
  loadingUpdate: boolean;
  loadingResetPassword: boolean;
  loadingUnlockKyc: boolean;
  merchantAccountInfo: EwalletAccount[];
  merchantSessions: EwalletSessionType[];
  merchantWalletHistory: appHistoryData[];
  merchantTransactionHistory: EWalletTransactionBO[];
  merchantLinkedBanks: BankLinkedObject[];
  merchantChangeHistory: LogsType[];
  merchantTransactionReport: string;
  merchantWalletTotalCredit: number;
  merchantWalletTotalDebit: number;
}

export interface SearchEwalletAccountInput {
  filter: FilterEwalletAccountInput;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface FilterEwalletAccountInput {
  id?: number[];
  state?: string[];
  accountType?: string;
  search?: string;
  searchValue?: string;
  searchType?: SearchTypeEwalletAccountEnum;
  createdAt?: {
    from?: Date;
    to?: Date;
  };
}

export enum SearchTypeEwalletAccountEnum {
  PHONE = 'PHONE',
  ACCOUNT_ID = 'ACCOUNT_ID',
  FULLNAME = 'FULLNAME',
  ALIASNAME = 'ALIASNAME',
  IDENTIFY = 'IDENTIFY',
}

export interface SearchEwalletAccountResponse {
  message: string;
  succeeded: boolean;
  data: EwalletAccount[];
}
interface ShareHolder {
  fullname: string;
  identifyNumber: string;
  title: string;
  capitalRatio: string;
  nationality: string;
  }
export interface EwalletAccount {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  avatar: string;
  updatedAvatarAt: Date;
  birthday: Date;
  isActive: boolean;
  isVerifiedEmail: boolean;
  state: string;
  gender: string;
  accountType: string;
  createdClientId: string;
  createdIp: string;
  scope: string[];
  lastedLoginAt: Date;
  lastedLogoutAt: Date;
  address: AddressEwalletAccountType;
  createdDeviceInfo: createdDeviceInfoType;
  kyc: KycEwalletType;
  location?: AddressEwalletAccountType;
  balance: number;
  appName: string;
  alias: string;
  clockLoginFail: string;
  createdAt: Date;
  updatedAt: Date;
  shareHolders: ShareHolder[];
  temporaryAddress: AddressEwalletAccountType;
  position: string;
  career: string;
}

export interface AddressEwalletAccountType {
  street: string;
  city: LocationEwalletType;
  district: LocationEwalletType;
  ward: LocationEwalletType;
  province?:LocationEwalletType
}

export interface LocationEwalletType {
  title: string;
  identifyCode: string;
  path: string;
}

export interface createdDeviceInfoType {
  platform: string;
  channel: string;
  version: string;
}

export interface KycEwalletType {
  kycId: number;
  type: string;
  identifyNumber: string;
  state: string;
  reason: string;
  sentAt: Date;
  image: ImageEwalletKycType;
  video: {
    video: string;
    state: string;
  };
  face: {
    face: string;
    state: string;
  };
  placeOfIssue: string;
  issuedAt: Date;
  kycMerchant: KycMerchantEwalletType;
}

export interface ImageEwalletKycType {
  front: string;
  back: string;
}

export interface KycMerchantEwalletType {
  taxCode: string;
  name: string;
  shortName: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  address: string;
  shopAddress: string;
  business: string;
  representative: string;
  state: string;
  lincenseImage: string[];
}

export interface RequestCancelAccountInput {
  accountId: number;
  reason: string;
}

export interface RequestCancelAccountResponse {
  succeeded: boolean;
  message: string;
}

export interface UnlockKycInput {
  kycId: number;
}

export interface UnlockKycResponse {
  succeeded: boolean;
  message: string;
}

export interface UpdateEwalletAccountInput {
  id: number;
  alias: string;
  fullname: string;
  avatar: string;
  birthday: Date;
  gender: GenderEnum;
  email: string;
  province: string;
  district: string;
  wards: string;
  address: string;
  isActive: boolean;
  state: StateEwalletAccountEnum;
  accountType: EwalletAccountTypeEnum;
  kyc: KycEwalletInput;
  kycMerchant: KycMerchantEwalletInput;
  scope: EwalletAccountScopeEnum[];
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum StateEwalletAccountEnum {
  OPENED = 'OPENED',
  LOCKED = 'LOCKED',
  TEMPORARY_LOCK = 'TEMPORARY_LOCK',
}

export enum EwalletAccountTypeEnum {
  BUSINESS = 'BUSINESS',
  PERSONAL = 'PERSONAL',
}

export enum EwalletAccountScopeEnum {
  ROOT = 'ROOT',
  BUSSINESS_ACCOUNT = 'BUSSINESS_ACCOUNT',
  SCRATCH_ISEC = 'SCRATCH_ISEC',
}

export interface KycEwalletInput {
  identifyNumber: string;
  placeOfIssue: string;
  issuedAt: Date;
  image: {
    front: string;
    back: string;
  };
  video: {
    video: string;
  };
}

export interface KycMerchantEwalletInput {
  name: string;
  taxCode: string;
  representative: string;
  phone: string;
  address: string;
  shopAddress: string;
  lincenseImage: string[];
}

export interface NewPasswordWalletInput {
  accountId: number;
}

export interface NewPasswordWalletResponse {
  succeeded: boolean;
  message: string;
  data: {
    password: string;
  }
}

// Linked Banks
export interface BankLinkedObject {
  id: number;
  accountId: number;
  phone: string;
  appName: string;
  state: string;
  linkedAt: Date;
  cardInfo: CardInfo;
}

export interface CardInfo {
  swiftCode: string;
  bankName: string;
  bankCode: string;
  cardNumber: string;
  accountNumber: string;
  cardHolder: string;
  issuedAt: string;
  expiredAt: string;
}

export interface BankLinkedInput {
  filter?: FilterBankLinked;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface FilterBankLinked {
  id?:any;
  searchValue?: string;
  searchType?: SearchTypeBankLinkedEnum;
}

export enum SearchTypeBankLinkedEnum {
  PHONE = 'PHONE',
  ACCOUNT_ID = 'ACCOUNT_ID',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

// Transaction History
export interface SearchEWalletTransactionInput {
  filter?: FilterEWalletTransactionInput;
  paging?: {
    start: number;
    limit: number;
  };
}

export interface FilterEWalletTransactionInput {
  select?: {
    phone?: string;
    transactionId?: string;
    accountId?: number;
    id?: number;
    paymentTransaction?: string;
    transportTransaction?: string;
  };
  createdAt?: {
    from?: Date;
    to?: Date;
  };
}

export interface SearchEWalletTransactionBOResponse {
  message: string;
  succeeded?: boolean;
  data: EWalletTransactionBO[];
}

export interface EWalletTransactionBO {
  transactionId: string;
  changed: string;
  amount: number;
  fee: number;
  state: string;
  description: string;
  createdAt: Date;
  service: {
    state: string;
    code: string;
  };
}

// Sessions
export interface GetSessionsResponse {
  message: string;
  succeeded: boolean;
  data: EwalletSessionType[];
}

export interface EwalletSessionType {
  id: number;
  ip: string;
  deviceId: string;
  deviceInfo: string;
  platform: string;
  version: string;
  clientChannel: string;
  loginTime: string;
  logoutTime: string;
  createdAt: string;
  accountId: string;
}

// change history
export interface GetAccountMerchantLogInput {
  search?: string;
  createdAt?: {
    from?: Date;
    to?: Date;
  };
  paging?: {
    start: number;
    limit: number;
  };
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

export interface PayloadUpdateInfoAccount {
  id?: number;
  alias?: string;
  fullname?: string;
  avatar?: string;
  birthday?: string;
  gender?: string;
  email?: string;
  province?: string;
  district?: string;
  wards?: string;
  address?: string;
  isActive?: Boolean;
  state?: string;
  accountType?: string;
  scope?: string[];
  kyc?: {
    identifyNumber?: string;
    placeOfIssue?: string;
    issuedAt?: string;
    image?: {
      front: string;
      back: string;
    };
    video?: {
      video: string;
    };
  };
  kycMerchant?: {
    name?: string;
    taxCode?: string;
    representative?: string;
    phone?: string;
    address?: string;
    shopAddress?: string;
    lincenseImage?: [string];
  };
}


// Transaction Report
export interface ReportEwalletAccountInput {
  filter?: {
    accountId?: number;
    createdAt?: {
      from?: string;
      to?: string;
    };
  }
}