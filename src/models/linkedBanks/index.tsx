import { LinkedBankEnum, LinkedStateEnum } from 'models';

export interface getLinkedBanksInput {
  filter?: {
    searchValue?: string;
    searchType?: LinkedBankEnum;
    state?: LinkedStateEnum;
  };
  paging?: {
    start?: number;
    limit?: number;
  };
  sort?: {
    createdAt?: number;
  };
}

export interface CardInfoType {
  swiftCode: string;
  bankName: string;
  bankCode: string;
  cardNumber: string;
  accountNumber: string;
  cardHolder: string;
  issuedAt: string;
  expiredAt: string;
}

export interface LinkedBanksType {
  id: number;
  accountId: number;
  phone: string;
  appName: string;
  state: string;
  linkedAt: Date;
  cardInfo: CardInfoType;
}

export interface unlinkBankInput {
  linkedId?: number;
  phone?: string;
}
