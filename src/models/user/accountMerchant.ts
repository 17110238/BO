import {
  GenderEnum,
  StateEnum,
  AccountTypeEnum,
  TransactionAccInput,
  TransactionResponse,
  ReportMcInput,
  GetAllReportsOfMerchantResponse,
  ChangeLogsAccInput,
  ActionLogAccMc,
} from 'models';
import { MerchantAccount, MerchantState } from '../account/merchantState';


interface OperatorType {
  accountId: number
  username: string
  }
export interface UserBo {
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
  isActive?: Boolean;
  state?: StateEnum;
  scope?: [string];
  lastedLoginAt?: Date;
  lastedLogoutAt?: Date;
  accountType?: AccountTypeEnum;
  countLoginFail?: number;
  avatar?: string;
  merchantId?: BigInt;
  merchantName?: string;
  group?: [string];
  createdAt?: Date;
  updatedAt?: Date;
  operator?: OperatorType[];
}

export interface FilterSearchAccountMc {
  filter?: {
    search: string;
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

export interface UserBoState {
  loading: boolean;
  userBoInfoArray: UserBo[];
  detailUser: UserBo;
}
