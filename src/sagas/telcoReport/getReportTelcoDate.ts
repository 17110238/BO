import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_TELCO_DATE.REQUEST;
}

const SQL_QUERY = `
query reportTelcoByDate($input:GetReportCardTelcoInput) {
    EwalletReportBo {
      ReportCardTelcoDate(input:$input){
        data {
          date,
          totalCard,
          totalAmountCard,
          totalWallet,
        }
        sumData {
          totalCard,
          totalAmountCard,
          totalWallet
        }
      }
    }
  }
`;

function* getReportTelcoDate({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const telcoDate = data.data.EwalletReportBo.ReportCardTelcoDate;
    if (Array.isArray(telcoDate?.data)) {
      yield put({
        type: types.GET_TELCO_DATE.SUCCESS,
        payload: telcoDate,
      });
      callback && callback(true, telcoDate);
    } else {
      yield put({
        type: types.GET_TELCO_DATE.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get report telco saga: ', error);
    yield put({
      type: types.GET_TELCO_DATE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_TELCO_DATE.REQUEST, getReportTelcoDate);
}
