import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
    type?: typeof types.GET_LIST_REPORT_BILL.REQUEST;
}

const SQL_QUERY = `
  query ReportTopMerchant($input: ReportTopTransactionInput!){
    ReportMerchant {
        ReportTopTransaction (input: $input) {
            data{
                merchantId
                accountId
                merchantName
                username
                brandName
                website
                industryCategory
                representative
                phone
                merchantType
                email
                createdAt
                approvedAt
                state
                count
                value
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
        const getListBill = data?.data?.ReportMerchant?.ReportTopTransaction;
        if (Array.isArray(getListBill.data)) {
            yield put({
                type: types.GET_LIST_REPORT_TOP.SUCCESS,
                payload: getListBill.data,
            });
            callback && callback(true, getListBill);
        } else {
            yield put({
                type: types.GET_LIST_REPORT_TOP.FAILURE,
            });

            callback && callback(false, getListBill);
        }
    } catch (error) {
        console.log('error get changed message info: ', error);
        yield put({
            type: types.GET_LIST_REPORT_TOP.FAILURE,
        });
        callback && callback(false, []);
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_REPORT_TOP.REQUEST, doAction);
}
