export interface EWalletManager {
  id?: number;
  accountId?: number;
  state?: IsecEnum;
  amount?: number;
  isecCode?: string;
  createdAt?: string;
  scratchedAt?: string;
  donatedAccountId?: number;
  createAccountId?: string;
  receiverAccountId?: string;
}

export enum IsecEnum {
  REQUESTING = 'REQUESTING',
  PENDING = 'PENDING',
  DONATE = 'DONATE',
  USED = 'USED',
  DEPOSIT = 'DEPOSIT',
  LOCKED = 'LOCKED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export interface PayloadSearchIsecManage {
  filter?: FilterSearchIsecManage;
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface FilterSearchIsecManage {
  txtSearch?: string;
  typeSearch?: SearchIsecReportEnum;
  state?: IsecEnum;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export enum SearchIsecReportEnum {
  CREATED = 'CREATED',
  USED = 'USED',
  ISEC_CODE = 'ISEC_CODE',
}
