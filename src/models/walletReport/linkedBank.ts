export interface GetReportLinkedBankPayLoad {
  filter?: {
    swiftCode?: string;
    dateFilter?: {
      from?: string;
      to?: string;
    };
  };
}

export interface EwalletReportLinkedBankType {
  quantityLinkedCard: number;
  quantityNewLinkedCard: number;
  quantityUnlinkedCard: number;
  quantityDepositTransaction: number;
  totalDepositTransaction: number;
  quantityWithdrawTransaction: number;
  totalWithdrawTransaction: number;
  date: string;
}
