export enum SupplierFilterGetReportCardTelcoEnum {
  ALL = '',
  GATE = 'GATE',
  VINA = 'VINA',
  VIETTEL = 'VIETTEL',
  GARENA = 'GARENA',
  ZING = 'ZING',
  BEELINE = 'BEELINE',
  KASPERSKY = 'KASPERSKY',
  VCOIN = 'VCOIN',
  VN_MOBI = 'VN_MOBI',
  ECASH = 'ECASH',
}

export interface GetReportCardTelcoInput {
  filter?: {
    createdAt: {
      from?: string;
      to?: string;
    };
    supplier?: SupplierFilterGetReportCardTelcoEnum;
  };
}

export interface DataTelco {
  date?: string;
  price?: number;
  totalCard?: number;
  totalAmountCard?: number;
  totalWallet?: number;
}

export interface SumTelco {
  totalCard?: number;
  totalAmountCard?: number;
  totalWallet?: number;
}
