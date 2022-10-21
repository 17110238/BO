export interface FilterSearchBalanceMerchantInput{
    transactionId?: string,
merchantId?:number,
excludeMerchant?: [number],
change?: string,
    transactionType?: string,
    createAt?: CreatedAt,
}
interface CreatedAt {
    from: string,
    to:string
   
}
interface paging{
    start: number,
    limit:number,
}
export interface SearchBalanceMerchantResponsed{
    createdAt:string,
transactionId: string,
merchantId: number,
merchantName: string,
transactionType: string,
balanceBefore: number,
amount: number,
balanceAfter: number,
change: string,
description: string,
referTransaction: string,
}

export interface  SearchBalanceMerchantInput {
    filter?: FilterSearchBalanceMerchantInput,
    paging?:paging
}