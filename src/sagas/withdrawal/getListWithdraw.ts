import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetWithdrawInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetWithdrawInput> {
  type?: typeof types.GET_LIST_WITHDRAW.REQUEST;
}

const SQL_QUERY = `
query getListWithdraw($input: GetWithdrawInput) {
  Transaction {
      GetWithdraw(input: $input) {
      totalRow
      message
      succeeded
      data {
          accountId
          amount
          approvedAt
          bankTransaction
          canceledAt
          content
          contentWithdraw
          createdAt
          destination{
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
          failedUrl
          fee
          id
          ipnUrl
          isPick
          merchantId
          partnerTransaction
          reason
          redirectUrl
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
          updatedAt
          verifyMethod
          merchantName
          bankName
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
    const withdrawal = data?.data?.Transaction?.GetWithdraw;
    if (withdrawal.succeeded) {
      callback?.(true, Array.isArray(withdrawal?.data) ? withdrawal?.data : [] );
    } else {
      callback?.(false, []);
    }
  } catch (error) {
    console.log('error get transaction list: ', error);
    callback?.(false, {message: 'Lỗi kết nối Server'});
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_WITHDRAW.REQUEST, doAction);
}
