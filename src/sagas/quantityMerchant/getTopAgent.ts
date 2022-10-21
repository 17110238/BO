import { callGraphql } from 'api/graphql';
import { GetChangedInfoInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<GetChangedInfoInput> {
    type?: typeof types.GET_LIST_REPORT_BILL.REQUEST;
}

const SQL_QUERY = `
  query REPORT_AGENT($input: ReportAgentInput!){
    ReportMerchant {
        ReportAgent (input: $input) {
            data {
                date
                mcNewRegister
                mcApproved
                mcRejected
                mcBlocked
                mcActive
                mcActiveIndividual
                mcActiveEnterprise
                mcHasTransaction
                numberOfTransactions
              }
              sumData {
                totalMcNewRegister
                totalMcApproved
                totalMcRejected
                totalMcBlocked
                totalNumberOfTransactions
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
       
        const getListBill = data?.data?.ReportMerchant?.ReportAgent;
        if (Array.isArray(getListBill.data)) {
            yield put({
                type: types.GET_LIST_REPORT_AGENT.SUCCESS,
                payload: getListBill,
            });
            callback && callback(true, getListBill);
        } else {
            yield put({
                type: types.GET_LIST_REPORT_AGENT.FAILURE,
            });

            callback && callback(false, getListBill);
        }
    } catch (error) {
        console.log('error get changed message info: ', error);
        yield put({
            type: types.GET_LIST_REPORT_AGENT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.GET_LIST_REPORT_AGENT.REQUEST, doAction);
}
