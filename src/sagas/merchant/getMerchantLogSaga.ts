import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetAccountMerchantLogInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<GetAccountMerchantLogInput> {
  type?: typeof types.GET_MERCHANT_LOG.REQUEST;
}

const SQL_QUERY = `
query getMerchantLog ($input: GetAccountMerchantLogInput!){
    LogSystem{
        GetMerchantLog(input:$input){
            data {
                jsonData
                action
                ip
                userName
                fullName
                internalAccountId
                createdAt
                updatedAt
            }
            message
            succeeded
      }
    }
  }
  `;

function* getMerchantLog({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const merchant = data?.data?.LogSystem?.GetMerchantLog?.data;
    if (Array.isArray(merchant)) {
      callback && callback(true, merchant);
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error searchMC saga: ', error);
    callback && callback(false, {message: 'Lỗi kết nối Server'});
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_LOG.REQUEST, getMerchantLog);
}
