

export interface EWalletWordFillter {
 id: number,
title: string,
description: string,
isActive: Boolean
file: string,
fileName: string,
type: string,
createdAt: Date,
updatedAt: Date,
    
}


export interface DepositWithdrawEwalletInput {
        merchantId: number,
        action: string,
        amount: string,
        description: string
}
