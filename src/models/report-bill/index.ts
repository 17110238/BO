import { filter } from 'lodash';


interface createdAt{
    from: string,
    to: string
}
export interface ReportPoboOrderInput{
    createdAt:createdAt
}
export interface  ReportPoboOrderType {
    month: string
    successCount: number
    successAmount: number
    failCount: number
    failAmount: number
}
export interface  ReportPoboOrderReponsed  {
    data: ReportPoboOrderType[],
    total:ReportPoboOrderType
}
export interface ReportTopTransactionInputFilter {
    merchantId?: number,
    method?: string,
    formula: string
    createdAt: createdAt
}
interface PagingInput {
    start: number,
    limit: number,
    }
export interface ReportTopTransactionInput {
    filter: ReportTopTransactionInputFilter,
    paging:PagingInput

}
export interface ReportTopTransactionType {
    merchantId: number,
    accountId: number,
    merchantName: string,
    username: string,
    brandName: string,
    website: string,
    industryCategory: string,
    representative: string,
    phone: string,
    merchantType: string,
    email: string,
    createdAt: string,
    approvedAt: string,
    state: string,
    count: number,
    value: number
    }
export interface ReportTopTransactionResponsed {
    data:[ReportTopTransactionType]
}