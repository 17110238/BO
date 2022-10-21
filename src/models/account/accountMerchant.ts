import { SearchParams } from 'components/Account/BoxSearchAccount';
import {
  AccountTypeEnum,
  ActionLogAccMc,
  GenderEnum,
  GetAllReportsOfMerchantResponse,
  StateEnum,
} from 'models';
import { PagingInput } from 'models/utitlity/utilityState';
import { MerchantAccount } from './merchantState';

export interface AccountMerchant {
  id?: number;
  accountId?: number;
  username?: string;
  fullname?: string;
  phone?: string;
  gender?: GenderEnum;
  birthday?: Date;
  address?: string;
  identifyNumber?: string;
  issueDate?: Date;
  issuePlace?: string;
  email?: string;
  isActive?: boolean;
  state?: StateEnum;
  scope?: string[];
  lastedLoginAt?: Date;
  lastedLogoutAt?: Date;
  accountType?: AccountTypeEnum;
  countLoginFail?: number;
  avatar?: string;
  merchantId?: number;
  merchantName?: string;
  group: string[];
  createdAt?: Date;
  updatedAt?: Date;
  // transaction (input: TransactionAccInput): [TransactionResponse]
  report?: GetAllReportsOfMerchantResponse;
  // changeLogs? : ( input : ChangeLogsAccInput) => ActionLogAccMc
  changeLogs?: ActionLogAccMc;
  merchants?: [MerchantAccount];
  lockAccount?: boolean;
}

export interface AccountMerchant2 {
  id?: number;
  accountId?: string;
  username?: string;
  fullname?: string;
  phone?: string;
  gender?: GenderEnum;
  birthday?: Date;
  address?: string;
  identifyNumber?: string;
  issueDate?: Date;
  issuePlace?: string;
  email?: string;
  isActive?: boolean;
  state?: StateEnum;
  scope?: string[];
  lastedLoginAt?: Date;
  lastedLogoutAt?: Date;
  accountType?: AccountTypeEnum;
  countLoginFail?: number;
  avatar?: string;
  merchantId?: number;
  merchantName?: string;
  group: string[];
  createdAt?: Date;
  updatedAt?: Date;
  // transaction (input: TransactionAccInput): [TransactionResponse]
  report?: GetAllReportsOfMerchantResponse;
  // changeLogs? : ( input : ChangeLogsAccInput) => ActionLogAccMc
  changeLogs?: ActionLogAccMc;
  merchants?: [MerchantAccount];
}

export interface FilterDateISO {
  from?: Date;
  to?: Date;
}

export interface FilterSearchAccountMc {
  // filter?: {
  //     // id : number | null;
  //     search: string | number;
  //     // createdAt : FilterDateISO | null;
  // };
  filter?: SearchParams;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface AccountMerchantState {
  loading: boolean;
  isTabList: boolean;
  showFilter: boolean;
  accountMerchantInfoArray: AccountMerchant[];
  roles: role[];
}

export interface role {
  key: string;
  name: string;
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

export interface UpdateAccMcInput {
  accountId?: number | null;
  password?: string | null;
  fullname?: string | null;
  phone?: string | null;
  email?: string | null;
  gender?: GenderEnum;
  birthday?: string;
  isActive?: boolean | null;
  // role? : {
  //     key: string,
  //     value: string
  // } | string
  role?: any;
  createdAt?: Date;
  lastedLoginAt?: Date;
  state?: any;
  merchantName?: string;
}

export interface PasswordTemporaryInput {
  accountId: number;
  expireAfterMinute: number | undefined;
  description: string | undefined;
  submittedAccountId?: number;
}

export interface UnlockAccMcInput {
  accountId: number | undefined;
}

export interface ChangePassAccMcInput {
  accountId: number;
  password: string;
  submittedAccountId?: number;
}

export interface UpdateActiveAccMcInput {
  accountId?: number;
  submittedAccountId?: number;
}

export interface SearchByRoleInput {
  filter?: SearchByRoleFilter;
  paging?: PagingInput;
}

export interface SearchByRoleFilter {
  role?: string;
  state?: string;
}

export interface DeleteScopeBoInput {
  id: number
}

export interface GetListMCScopeInput {
  filter?: GetListMCScopeInputFilter
  paging?: PagingInput;
}

export interface GetListMCScopeInputFilter {
  service?: string
  scope?: string
  group?: string
}


export interface RequestActiveInput {
  id?: number
  isActive?: boolean
}