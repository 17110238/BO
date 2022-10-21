import { data } from 'jquery';
import { filter } from 'rxjs';
interface createdAt{
    from: string;
    to: string;
}
enum typeDate {

}

export interface ReportAgentInput{
    filter: {
        createdAt?: createdAt;
    typeDate?:string
    }
    
}
export interface ReportAngent{
    date: string
mcNewRegister: number
mcApproved: number
mcRejected: number
mcBlocked: number
mcHasTransaction: number
numberOfTransactions: number
mcActive: number
mcActiveIndividual: number
mcActiveEnterprise: number
}
export interface sumData{
    totalMcNewRegister: number
    totalMcApproved: number
    totalMcRejected: number
    totalMcBlocked: number
    totalNumberOfTransactions: number
    
}
export interface DataReportAgent{
    data: ReportAngent[],
    sumData:sumData
}
export interface ReportSystemTransactionInput {
    filter: {
        createdAt?: createdAt,
        method?:string
    }
}



export interface DataReportSystemTransactionResponsed{
date: String
amountTotal: number,
totalBalance:number,
total:number,
feeTotal:number,
merchantFeeTotal:number,
transactionTotal:number,
refundedAmountTotal:number,
refundedTransactionTotal:number,
canceledTransactionTotal:number,
failedTransactionTotal:number,
expiredTransactionTotal:number,
waitingCrosscheckAmountTotal:number,
crossCheckAmountTotal:number,
}

export interface SumDataReportSystemTransactionResponsed{
sumTotal: number,
sumAmountTotal: number,
sumFeeTotal: number,
sumMerchantFeeTotal: number,
sumTransactionTotal: number,
sumRefundedAmountTotal: number,
sumCanceledTransactionTotal: number,
sumRefundedTransactionTotal: number,
sumFailedTransactionTotal: number,
sumExpiredTransactionTotal: number,
sumWaitingCrosscheckAmountTotal: number,
}
export interface ReportSystemTransactionResponsed {
    data: DataReportSystemTransactionResponsed[],
    sumData:SumDataReportSystemTransactionResponsed
}