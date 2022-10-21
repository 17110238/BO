import { GenderEnum, KycStateReportUserEnum } from "models"

export interface DataReportUser {
    accountId?: number
    fullname?: string
    phone?: string
    kycState?: string
    appName?: string
    birthday?: string
    age?: number
    gender?: string
    address?: string
    status?: string
}

export interface ReportUserInput {
    filter?: FilterReportUserInput
    paging?: PagingReportUserInput
}

export interface FilterReportUserInput {
    fullname?: string
    appId?: number
    kycState?: KycStateReportUserEnum
    gender?: GenderEnum
    age?: AgeFilterReportUserInput
}

export interface PagingReportUserInput {
    start?: number
    limit?: number
}

export interface AgeFilterReportUserInput {
    from: number
    to: number
}

export interface initialStateReport {
    loading: boolean;
    loadingExport: boolean,
    listReportUser?: Array<DataReportUser>;
}

export interface DataStatisReportUser {
    totalUser: number
    totalApp: number
}