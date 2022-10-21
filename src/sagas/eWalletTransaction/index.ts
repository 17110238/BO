import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction, SearchEWalletTransactionInput } from 'models';
import { callGraphql } from '../../api/graphql';
interface SagaSearch extends SagaAction<SearchEWalletTransactionInput> {
    type?: typeof types.GET_LIST_E_WALLET_TRANSACTION.REQUEST;
}

const SQL_QUERY = `
query getEWalletTransactionHistory($input : SearchEWalletTransactionInput){
    eWalletTransactionBo{
        SearchTransaction(input : $input) {
        message
        succeeded
        data {
            id
            transactionId
            accountId
            phone
            amount
            changed
            fee
            extraData
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

function* doAction({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload },
        });
        const eWalletTransaction = data?.data?.eWalletTransactionBo?.SearchTransaction;
        if (eWalletTransaction.succeeded) {
            callback?.(true, Array.isArray(eWalletTransaction?.data) ? eWalletTransaction?.data : []  );
        } else {
            callback?.(false, []);
        }
    } catch (error) {
        callback?.(false, { message: 'Lỗi kết nối server' });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_E_WALLET_TRANSACTION.REQUEST, doAction);
}
