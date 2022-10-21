import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';
import { GetPoboOrderInput } from 'models/pobo/poboState';
interface SagaSearch extends SagaAction<GetPoboOrderInput> {
    type?: typeof types.GET_LIST_POBO.REQUEST;
}

const SQL_QUERY = `
query getListPOBO($input: GetPoboOrderInput) {
  Transaction {
    GetPoboOrder(input: $input) {
      totalRow
      message
      succeeded
      data {
        accountId
        actionInfo {
            accountId
            fullname
            username
            }
        amount
        appId
        approvedAt
        bankTransaction
        bulkTransactionId
        canceledAt
        content
        createdAt
        createdBy
        createInfo{
            accountId
            fullname
            username
            }
        customer {
            customerId
            group
            name
            }
        destination {
            bankAccount {
            accountName
            accountNumber
            branch
            swiftCode
            }
        wallet {
            phone
            fullname
        }
            }
        extraData
        failedUrl
        fee
        id
        ipnUrl
        isPick
        merchantId
        partnerBulkTransaction
        partnerTransaction
        reason
        redirectUrl
        scheduleTransactionId
        source{
            customize{
                amount
                }
            }
        state
        submittedAccountId
        supplier
        supplierResponse{
            _id
            content
            createdAt
            }
        supplierTransaction
        total
        transactionId
        type
        updatedAt
        bankName
        verifyMethod
        merchantName
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
        const pobo = data?.data?.Transaction?.GetPoboOrder;
        if (pobo.succeeded) {
            callback?.(true, Array.isArray(pobo?.data) ? pobo?.data : [] );
        } else {
            callback?.(false, []);
        }
    } catch (error) {
        console.log('error get transaction list: ', error);
        callback?.(false, {message: 'Lỗi kết nối Server'});
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_POBO.REQUEST, doAction);
}
