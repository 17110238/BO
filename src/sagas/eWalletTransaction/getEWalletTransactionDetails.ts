import { callGraphql } from 'api/graphql';
import { GetEWalletTransactionDetailInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaExport extends SagaAction<GetEWalletTransactionDetailInput> {
    type?: typeof types.GET_LIST_E_WALLET_DETAILS.REQUEST;
}
const SQL_QUERY = `
 query getEWalletTransactionDetails($input: GetEWalletTransactionDetailInput!) {
    eWalletTransactionBo {
        GetEWalletTransactionDetail(input: $input) {
            data {
                id
                transactionId
                accountId
                phone
                amount
                changed
                fee
                total
                discount
                bonus
                cashback
                tags
                service {
                    code
                    type
                    name
                    id
                    serviceAt
                    method
                    serviceMethod {
                        id
                        registerId
                        group
                        info
                        description
                    }
                    transaction
                    state
                    data
                }
                createdAt
                updatedAt
                state
                description
                extraData
                paymentMethod
                payment{
                    id
                    transaction
                    method
                    state
                    description
                    extraData {
                        resolveType
                        paymeCreditNo
                        packageId
                        }
                    }
                transport{
                    accountId
                    transportId
                    transaction
                    state
                    method
                    description
                    }
                method {
                    id
                    registerId
                    group
                    info
                    description
                    bankInfo
                    }
                isVisible
                via
                publishedAt
                partnerId
                appId
                supplierMobileCard  {
                    accountId
                    amount
                    total
                    discount
                    fee
                    quantity
                    partnerTransaction
                    supplier
                    transaction
                    description
                    cardInfo{
                        amount
                        total
                        discount
                        serial
                        pin
                        expiredAt
                        saleDate
                        state
                    }
                        state
                        payment
                        supplierResponsed
                        extraData
                        isRefunded
                        createdAt
                        updatedAt
                    }
                supplierMobileTopup {
                    createdAt
                    updatedAt
                    accountId
                    amount
                    total
                    discount
                    fee
                    quantity
                    partnerTransaction
                    supplier
                    transaction
                    description
                    phone
                    type
                    state
                    payment
                    supplierResponsed
                    extraData
                    isRefunded
                    }
                supplierBill {
                    createdAt
                    updatedAt
                    accountId
                    customerBillId
                    amount
                    total
                    transaction
                    fee
                    bankTransaction
                    partnerTransaction
                    description
                    customerInfo {
                        id
                        fullname
                        address
                        }
                    type
                    supplierInfo {
                        fullname
                        code
                        }
                    studentInfo {
                        studentName
                        schoolName
                        schoolCode
                        className
                        classCode
                        }
                    state
                    gateway
                    paymentPeriod
                    payment
                    supplierResponsed
                    extraData
                }
            }
    }
}
}
`;
function* getEWalletTransactionDetails({ payload, callback }: SagaExport) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: {...payload },
        });
        let transactionDetails = data?.data?.eWalletTransactionBo?.GetEWalletTransactionDetail?.data;
        if (Object.keys(transactionDetails).length > 0) {
            callback?.(true, transactionDetails );
        } else {
            callback?.(false, {});
        }
    }
     catch (error) {
        callback?.(false, {});
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_E_WALLET_DETAILS.REQUEST, getEWalletTransactionDetails);
}
