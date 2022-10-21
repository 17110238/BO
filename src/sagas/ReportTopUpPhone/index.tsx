import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
    type?: typeof types.GET_TOP_UP_PHONE.REQUEST;
}

const SQL_QUERY = `
    query  reportTopUpPhone($input:GetReportCardTelcoInput!) {
        EwalletReportBo {
            ReportTopupPhone(input:$input){
                data{
                    date,
                    totalTransaction,
                    totalAmountWallet,
                    totalAmountTransaction
                    }
                    sumData{
                    totalTransaction,
                    totalAmountWallet,
                    totalAmountTransaction
                  }
            }
        }
    }
`;

function* getReportTopUpPhone({ payload, callback }: SagaSearch) {
    try {
        const { data } = yield call<any>(callGraphql, SQL_QUERY, {
            input: { ...payload },
        });
        const reportWallet = data.data.EwalletReportBo.ReportTopupPhone;
        if (Array.isArray(reportWallet.data)) {
            yield put({
                type: types.GET_TOP_UP_PHONE.SUCCESS,
                payload: reportWallet,
            });
            callback && callback(true, reportWallet);
        } else {
            yield put({
                type: types.GET_TOP_UP_PHONE.FAILURE,
            });
            callback && callback(false, null);
        }
    } catch (error) {
        console.log('error get report wallet saga: ', error);
        yield put({
            type: types.GET_TOP_UP_PHONE.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_TOP_UP_PHONE.REQUEST, getReportTopUpPhone);
}
