import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
    type?: typeof types.GET_LIST_REPORT_BILL.REQUEST;
}

const SQL_QUERY = `
  query ReportPoboOrder($input: ReportPoboOrderInput!){
    EwalletStateBankReportBo {
        ReportPoboOrder (input: $input) {
            data{
                month,
                successCount,
                successAmount,
                failCount,
                failAmount
              }
            total{
             month,
            successCount,
            successAmount,
            failCount,
            failAmount
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
        const getListBill = data?.data?.EwalletStateBankReportBo?.ReportPoboOrder;
        if (Array.isArray(getListBill.data)) {
            yield put({
                type: types.GET_LIST_REPORT_BILL.SUCCESS,
                payload: getListBill,
            });
            callback && callback(true, getListBill);
        } else {
            yield put({
                type: types.GET_LIST_REPORT_BILL.FAILURE,
            });

            callback && callback(false, getListBill);
        }
    } catch (error) {
        console.log('error get changed message info: ', error);
        yield put({
            type: types.GET_LIST_REPORT_BILL.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_REPORT_BILL.REQUEST, doAction);
}
