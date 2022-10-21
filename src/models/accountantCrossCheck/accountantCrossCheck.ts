export interface ReceiveAccount{
issuer?: string
accountNumber?: number
accountName?: string
}
export interface ExtraData{
campaignId?: number
depositTransaction?: string
depositInfo: string
}
export interface AccountantCrossCheck{
crossCheckId?: number,
transaction?: string //mã giao dịch
username?: string    // tên tk Mc
merchantName?: string   //tên MC
receiveAccount?: ReceiveAccount //tài khoản nhận
totalTransaction:number
amount:number
amountCrossCheck:number
note?: string
description?: string
extraData?: ExtraData
state?: string
type?: string // loại đối soát
isTransferWeekend?: boolean // chuyển cuối tuần
crossCheckNum?:number // Chuyển Tiền (T+n)
paymentMethod?: string  // pttt toán
crossCheckMethod?: string[] // hạn mục dối soát
createdAt?: string  // ngày tạo
approvedAt?: string
finishedAt?: string
campaignId?:string,
isOutOfStock?:boolean,
amountEdit?:number,

}

export interface AccountantCrossCheckFormat{
  crossCheckId?: number,
  transaction?: string //mã giao dịch
  username?: string    // tên tk Mc
  merchantName?: string   //tên MC
  receiveAccount?: ReceiveAccount //tài khoản nhận
  totalTransaction:number
  amount:number
  amountCrossCheck?:number
  note: string
  description?: string
  extraData?: ExtraData
  state?: string
  type?: string // loại đối soát
  isTransferWeekend?: boolean // chuyển cuối tuần
  crossCheckNum?:number // Chuyển Tiền (T+n)
  paymentMethod?: string  // pttt toán
  crossCheckMethod?: string[] // hạn mục dối soát
  createdAt?: string  // ngày tạo
  approvedAt?: string
  finishedAt?: string
  campaignId?:string,
  isOutOfStock?:boolean,
  amountEdit:number,

  }

export interface SearchParams {
    merchantId?: number,
    crossChecktype?: string,
    paymentMethod?: string,
    isTransferWeekend?: boolean,
    txtSearch?: string,
    typeSearch?: string,
    search?: string | string[],
    state?: string ,
    createdAt?: {
      from?: any;
      to?: any;
    };
  }
export interface CreateCrossCheck{
merchantId: number
amount: number
startDay: Date
endDay: Date
methodList: string[]
description: string

}
export interface getListCrossCheck{
    filter?: SearchParams
    paging: {
        start: number,
        limit: number,
      },
  sort?: {
    createdAt?:number,
    }
}

export interface finishedAtMerchantReportInput {
  from?: string
  to?: string
}

export interface FilterMerchantReportCrossCheck {
  merchantId?: number
  finishedAt?: finishedAtMerchantReportInput
}

export interface FilterMerchantReportCrossCheckInput {
  filter? : FilterMerchantReportCrossCheck
}

export interface transferedReportData {
  count?: number
  amount?: number
  fee?: number
  total?: number
  merchantId?: number
  paymentPartner?: number
}

export interface finalBalanceData {
  count?: number
  amount?: number
  fee?: number
  paymentPartner?: number
  total?: number
  merchantId?: number
}
export interface paymentPayMeApp {
  methodName?: string
  count?: number
  amount?: number
  fee?: number
  total?: number
}


export interface paymentRefundedResponse {
  count?: number;
  amount?: number;
  fee?: number;
  total?: number
}

export interface paymentRefundedData {
  paymentRefunded?: paymentRefundedResponse
  paymentSucceeded?: [paymentPayMeApp]
}

export interface IssueData {
  name?: String
}


export interface PaymentListDataReponse {
  issuer?: IssueData
  supplier?: IssueData
  method?: string
  supplierTransaction?: string
  paymentId?: string
  amount?: number
  fee?: number
  total?: number
  state?: string
  description?: string
  transactionId?: string
  partnerTransaction?: string
  createdAt?: string
  finishedAt?: string
  merchantName?: string
  storeName?: string
  methodName?: string
}


export interface GetMerchantReportCrossCheckDataReponse {
  transferedReport?: transferedReportData
  currentReport?: paymentRefundedData
  paymentList?: PaymentListDataReponse[]
  beginBalanceData?: finalBalanceData
  finalBalanceData?: finalBalanceData
  currentReportIncrease?: finalBalanceData
  currentReportBalance?: finalBalanceData
}

export interface GetMerchantReportCrossCheckReponse {
  data?: GetMerchantReportCrossCheckDataReponse
}
