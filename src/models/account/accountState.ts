import { GenderEnum, StateEnum, AccountTypeEnum } from '../index';
export interface Account {
  id?: string;
  googleAccountId?: string;
  username?: string;
  password?: string;
  fullname?: string;
  phone?: string;
  gender?: GenderEnum;
  birthday?: string;
  address?: string;
  identifyNumber?: string;
  issueDate?: string;
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
  group?: string[];
}
