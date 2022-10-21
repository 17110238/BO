import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
    type?: typeof types.GET_SERVICE_SEARCH_TRANSACTION.REQUEST;
}
const SQL_QUERY = `
query GetlistEwalletWordFillter{
    eWalletTransactionBo{
        GetServiceSearchTransaction{
            data
         }
     }
  } `

function* getServiceSearchTransaction({ payload, callback }: SagaSearch) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: {  ...payload}
    }); 
    const services = data?.data?.eWalletTransactionBo?.GetServiceSearchTransaction?.data;
    if (Array.isArray(services)) {
        callback?.(true, services ?? []);
    } else {
        callback?.(false, services ?? []);
    }
    } catch (error) {
        callback?.(false, []);
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_SERVICE_SEARCH_TRANSACTION.REQUEST,getServiceSearchTransaction);
}
