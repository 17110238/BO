export interface BankListType {
  id: number;
  bankCodeId: number;
  isActive: boolean;
  shortName: string;
  swiftCode: string;
  link: {
    gateway: string;
  };
  requiredDate: string;
}

export interface BankUpdateType {
  bankCodeList: {
    bankCodeId: number;
    isActive?: boolean;
    gateway?: string;
    requiredDate?: string;
  };
}

export interface GetBankListPayload {
  filter?: {
    bankCode?: number;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

interface ClientAppInfo {
  platform?: string;
  versionNotSupported: string;
  versionNewest: string;
}

export interface WalletAppVersionType {
  id: number;
  clientInfo: ClientAppInfo;
  updateTitle: string;
  updateURL: string;
  createdAt?: string;
  updatedAt?: string;
}

// reducer state
interface WalletAppVersionState {
  loading: boolean;
  data: [WalletAppVersionType] | [];
  error?: any;
}

export interface WalletState {
  appVersion: WalletAppVersionState;
}

// issuers config
export interface GetIssuerPayload {
  filter?: {
    bankCode?: number;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface IssuerListType {
  id: number;
  shortName: string;
  name: string;
  showName: string;
  service?: string[] | string;
  isActive: boolean;
  description: string;
  configs: string;
  createdAt?: string;
  updatedAt?: string;
  logo: string;
}

export interface IssuerAddType {
  name: string;
  shortName: string;
  showName: string;
  logo: string;
  isActive: boolean;
  description: string;
  configs: string;
  service?: string[];
}

export interface IssuerUpdateType extends IssuerAddType {
  id: number;
}

export interface GetSupplierPayload {
  filter?: {
    id?: number;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface SupplierListType {
  id: number;
  name: string;
  shortName: string;
  showName: string;
  logo: string;
  isActive: boolean;
  description: string;
  configs: string;
  service?: string[] | string;
  issuer?: string[] | string;
  NPH?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierAddType {
  name: string;
  shortName: string;
  showName: string;
  logo: string;
  isActive: boolean;
  description: string;
  configs: string;
  service?: string[];
  issuer?: string[] | string;
}

export interface SupplierUpdateType extends SupplierAddType {
  id: number;
}

export interface GetSettingWalletAdvancePayload {
  filter?: {
    key?: string;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface SettingWalletAdvanceType {
  id?: number;
  value?: string | boolean;
  key?: string;
  type?: string;
  description?: string;
  appId?: string;
  appName?: string;
}

// co.op bank
export interface GetBanksEwalletPayload {}
export interface BanksEwalletType {
  id?: number;
  bankName: string;
  serviceName: string;
  bankNumber: string;
  activeDate: string;
  balance: number;
}
export interface AddBankEwalletInput {
  bankName: string;
  serviceName: string;
  bankNumber: string;
  activeDate: string;
  balance: number;
}
export interface EditBankEwalletInput {
  id?: number;
  bankName: string;
  serviceName: string;
  bankNumber: string;
  balance: number;
  activeDate?: string;
}

export interface BanksCooperaType {
  id?: number;
  bankName: String;
  serviceName: String;
  bankNumber: String;
  activeDate: string;
  currency: string;
}

export interface AddBankCooperaInput {
  bankName: String;
  serviceName: String;
  bankNumber: String;
  activeDate: string;
  currency: String;
}

export interface EditBankCooperaInput {
  id?: number;
  bankNumber: String;
  bankName: String;
  serviceName: String;
  activeDate: string;
  currency: String;
}
