export interface LoanPackageReducerTypes {
  loading?: boolean;
  listData: Array<LoanPackageTypes>;
}

export interface LoanPackageTypes {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  accountId?: number;
  fullname?: string;
  phone?: string;
  termTitle?: string;
  packageId?: string;
  packageInfo?: FastLoanPackageType;
  transactionList?: [string];
  customerId?: string;
  transaction?: string;
  supplierTransaction?: string;
  supplierInfo?: FastLoanSupplierType;
  state?: string;
  approvedAt?: string;
  amount?: number;
  total?: number;
  monthlyTotal?: number;
  fee?: number;
  termFee?: number;
  dueDate?: string;
  settlementDate?: string;
  term?: number;
  email?: string;
  interestTitle?: string;
  interestRate?: number;
  customerInfo?: FastLoanCustomerType;
  supplierResponsed?: [string];
}

export interface FastLoanPackageType {
  id?: number;
  name?: string;
  description?: string;
  state?: string;
  amountLimit: {
    min?: number;
    max?: number;
    fixed?: number;
  };
  supplierInfo: FastLoanSupplierType;
  approvedAt?: string;
  term: {
    min?: number;
    max?: number;
    title?: string;
  };
  interestTitle?: string;
  interestRate: [
    {
      term?: number;
      rate?: number;
      title?: string;
      type?: string;
    }
  ];
  disbursement?: string;
  promotionUrl?: string;
  conditionUrl?: string;
  appType?: string;
  redirectUrl?: string;
  group?: string;
  statementInfo: [string];
  createdAt?: string;
  updatedAt?: string;
}

export interface FastLoanSupplierType {
  id?: string;
  name?: string;
  logo?: string;
  title?: string;
}

export interface FastLoanCustomerType {
  accountId?: number;
  name?: string;
  phone?: string;
  appId?: number;
  avatar?: string;
  email?: string;
  clientId?: string;
  kycInfo?: {};
}

interface KycEwalletType {
  kycId: BigInt;
  type?: string;
  identifyNumber?: string;
  state?: string;
  reason?: string;
  sentAt?: string;
  image?: {
    front?: string;
    back?: string;
    state?: string;
  };
  video?: {
    video?: string;
    state?: string;
  };
  face?: {
    face?: string;
    state?: string;
  };
  placeOfIssue?: string;
  issuedAt?: string;
  address: AddressEwalletAccountType;
  kycMerchant: KycMerchantEwalletType;
}

interface KycMerchantEwalletType {
  taxCode?: string;
  name?: string;
  shortName?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  address?: string;
  shopAddress?: string;
  business?: string;
  representative?: string;
  state?: string;
  lincenseImage?: [string];
}

interface AddressEwalletAccountType {
  street?: string;
  city: LocationEwalletType;
  district: LocationEwalletType;
  ward: LocationEwalletType;
}

interface LocationEwalletType {
  title?: string;
  identifyCode?: string;
  path?: string;
}

export interface LoanPackageFilter {
  approvedAt?: { from?: string; to?: string };
  search?: string;
  accountId?: number;
  phone?: string;
  transaction?: string;
  packageId?: number;
  state?: FastLoanStateEnum;
}

enum FastLoanStateEnum {
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  REQUESTED = 'REQUESTED',
}

export interface InputLoanPackage {
  paging?: {
    start?: number;
    limit?: number;
  };
  filter?: LoanPackageFilter;
}

export interface InputUpdateLoanPackage {
  id?: number;
  state?: string;
}
