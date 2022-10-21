import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../../redux/types/manualBankTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_MANUAL_BANK.REQUEST;
}

const SQL_QUERY = `
  query getManualBank($input:GetReportManulBankingInput!) {
    EwalletReportBo {
      ReportManulBanking(input:$input){
        data{
          date,
          amount,
          count,
          total,
          fee
        }
        total {
          amount,
          count,
          total,
          fee
        }
      }
    }
  }
`;

function* getManualBanks({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const manualBanks = data.data.EwalletReportBo.ReportManulBanking;
    if (Array.isArray(manualBanks.data)) {
      yield put({
        type: types.GET_LIST_MANUAL_BANK.SUCCESS,
        payload: manualBanks,
      });
      callback && callback(true, manualBanks);
    } else {
      yield put({
        type: types.GET_LIST_MANUAL_BANK.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.GET_LIST_MANUAL_BANK.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_MANUAL_BANK.REQUEST, getManualBanks);
}
