interface createdAt{
    from: string;
    to: string;
}


export interface FilterGetReportCardTelcoInput{
    filter: {
        createdAt:createdAt
        supplier?:string
    }

}
export interface ReportReportTopupPhone{
    date?: string;
    totalTransaction: number;
totalAmountTransaction: number;
totalAmountWallet: number;
}

export interface SumReportReportTopupPhone {
    totalTransaction: number;
    totalAmountTransaction: number ;
    totalAmountWallet: number ;
}
    
export interface EwalletTopupPhoneResponsed {
    data: ReportReportTopupPhone[];
    sumData: SumReportReportTopupPhone
    }