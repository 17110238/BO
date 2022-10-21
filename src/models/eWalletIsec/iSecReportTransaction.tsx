export interface ISecReportTransaction {
  id?: number;
  accountId?: number;
  destinationAccountId?: number;
  bulkId?: string;
  gateTransactionId?: string;
  createdAt?: string;
  amount?: number;
  quantity?: number;
  state?: string;
  totalAmount?: string;
  phone?: string;
}

export interface PayloadSearchIsecReportTrans {
  filter?: FilterSearchIsecReportTrans;
  paging?: {
    start?: number;
    limit?: number;
  };
}

export interface FilterSearchIsecReportTrans {
  partnerTransaction?: string;
  state?: IsecBulkEnum;
  bulkId?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export enum IsecBulkEnum {
  NEW = 'NEW',
  CREATING = 'CREATING',
  CREATED = 'CREATED',
}
