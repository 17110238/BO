
import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
    type?: typeof types.GET_LIST_ACOUNTANT_CROSS_CHECK.REQUEST;
}

const SQL_QUERY = `
mutation exportAccountantCrossCheck($input: GetFiterCrossCheckInput!){
    CrossCheck{
        ExportCrossCheck(input:$input){
        succeeded
        message
      }
    }
  }`

function* exportAccountantCrossCheck({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: {
                filter: { ...payload },
            },
        });
        let dataRes = data?.data?.CrossCheck?.ExportCrossCheck;
        yield put({
            type: types.EXPORT_ACOUNTANT_CROSS_CHECK.PENDING,
        });
        callback && callback(true, dataRes ?? {});
    } catch (error) {
        console.log('error GETMcExport saga: ', error);
        yield put({
            type: types.EXPORT_ACOUNTANT_CROSS_CHECK.FAILURE,
            payload: error,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.EXPORT_ACOUNTANT_CROSS_CHECK.REQUEST, exportAccountantCrossCheck);
}