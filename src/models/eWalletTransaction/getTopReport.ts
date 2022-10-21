export interface typeGetTopTransactionByDate{
    date:string,
    count: number
    amount: number
}
interface createdAt{
    from:string
    to:string
}
enum TopTransactionTasg{
    DEPOSIT,
    WITHDRAW,
    ISEC,
    TOPUP,
    CARD,
}
export interface typeGetTopTransactionByDateInput{
createdAt: createdAt
tags?: string
appId?: number
sort?: typeSortTopTransaction
}
export interface typeGetTopTransactionByAccountReponsed {
    accountId: number;
    fullname: string;
    count: number;
    amount: number;
    average: number;
    max: number;
}
export interface typeSortTopTransaction{
    count?: number;
    amount?: number;
    max?: number;
    average?: number;
}
export interface typeGetTopTransactionByAccountInput{
createdAt: createdAt
tags: TopTransactionTasg
appId: number
sort: typeSortTopTransaction
}
export interface LoginAmountType{
    accountId:string
fullname:string
count: number
}
export interface typeGetTopAccountLoginResponsed {
  
        loginAmount: [LoginAmountType]
        deviceAmount: [LoginAmountType]
}
export interface typeGetTopAccountLoginInput {
    appId: number
createdAt: createdAt
}