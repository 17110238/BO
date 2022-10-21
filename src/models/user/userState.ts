import { GenderEnum, StateEnum, AccountTypeEnum } from "../index";
export interface AccountBo {
  id: string;
  googleAccountId: string;
  username: string;
  password: string;
  fullname: string;
  phone: string;
  gender: GenderEnum;
  birthday: Date;
  address: string;
  identifyNumber: string;
  issueDate: Date;
  issuePlace: string;
  email: string;
  isActive: boolean;
  state: StateEnum;
  scope: string[];
  lastedLoginAt: Date;
  lastedLogoutAt: Date;
  accountType: AccountTypeEnum;
  countLoginFail: number;
  avatar: string;
  group: string[];
}

export interface createUserType {
  username: string;
  password: string;
  repassword: string;
  fullname: string;
  phone: number;
  email: string;
  gender: string;
  birthday: Date | null;
  isActive: Boolean;
  role: string[];
}
export interface updateUserType {
  id:number,
  username: string;
  password: string;
  repassword: string;
  fullname: string;
  phone: number;
  email: string;
  gender: string;
  birthday: Date | null;
  isActive: Boolean;
  role: string[];
}

export interface createUserScopeType{
  username: string;
  password: string;
  fullname: string;
  phone: number;
  email: string;
  gender: string;
  birthday: Date | null;
  isActive: Boolean;
  scope: string[];
}
export interface updateUserScopeType {
  id:number,
  username: string;
  password: string;
  repassword: string;
  fullname: string;
  phone: number;
  email: string;
  gender: string;
  birthday: Date | null;
  isActive: Boolean;
  scope: string[];
}

// Delete user
export interface DeleteInput {
  id?: number
}

export interface DeleteResponsed {
  message? : string;
  succeeded? : Boolean;
}