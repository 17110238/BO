import { stateWalletKYCEnum } from 'models';

export interface WalletKYC {
  id?: number;
  accountId?: number;
  alias?: string;
  email?: string;
  kycAutoState?: string;
  phone?: string;
  fullname?: string;
  birthday?: string;
  gender?: string;
  address?: AddressWalletKYC;
  addressString?: string;
  identifyNumber?: string;
  issuedAt?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  video?: EwalletVideoKycType;
  image?: EwalletImageKycType;
  face?: EwalletFaceKycType;
  identifyIC?: EwalletidentifyICType;
  state?: stateWalletKYCEnum;
  appName?: string;
  nationality?: string;
  type?: string;
  placeOfIssue?: string;
  isPushNotification?: boolean;
  registeredAt?: string;
  merchant?: MerchantKYCInfo;
  accountType?: string;
  isConfirmed?: boolean;
}

export interface MerchantKYCInfo {
  taxCode?: string;
  name?: string;
  shortName?: string;
  email?: string;
  website?: string;
  logo?: string;
  address?: string;
  business?: string;
  representative?: string;
  openTime?: string;
  state?: string;
  lincenseImage?: string[];
  phone?: string;
  shopAddress?: string;
}

export interface AddressWalletKYC {
  street?: string;
  city?: {
    identifyCode?: string;
    path?: string;
    title?: string;
  };
  district?: {
    identifyCode?: string;
    path?: string;
    title?: string;
  };
  ward?: {
    identifyCode?: string;
    path?: string;
    title?: string;
  };
}

export interface EwalletVideoKycType {
  video: string;
  state: string;
}

export interface EwalletImageKycType {
  front: string;
  back: string;
  state?: string;
}

export interface EwalletFaceKycType {
  face: string;
  state: string;
}

export interface EwalletidentifyICType {
  front?: string;
  back?: string;
  state?: string;
  reason?: string;
}

export interface PayloadSearchKYC {
  filter?: FilterSearchKYC;
  paging?: {
    start: number;
    limit: number;
  };
}

export interface FilterSearchKYC {
  id?: number;
  state?: string;
  searchString?: string;
  kycAutoState?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface PayloadRequestEKYC {
  id: number;
  pushNotification?: boolean;
}

export interface PayloadRejectEKYC {
  id: number;
  reason: string;
  imageState?: boolean;
  faceState?: boolean;
  videoState?: boolean;
  merchantState?: boolean;
  identifyICState?: boolean;
}

export interface PayloadLogKYCWallet {
  search?: string;
  createdAt?: {
    from: string;
    to: string;
  };
  paging?: {
    start: number;
    limit: number;
  };
}

export interface LogKYCWallet {
  jsonData?: string;
  action?: string;
  ip?: string;
  userName?: string;
  fullName?: string;
  internalAccountId?: string;
  createdAt?: string;
  updatedAt?: string;
}
