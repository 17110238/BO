import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListEwalletIsecReport($input: ReportByDayEwalletIsecReportInput!) {
    EwalletIsecReportBo{
      ReportByDay(input: $input){
        date
        fullDate
        countNew
        countUsed
        countLock
        countISec
        countCashback
        totalNew
        totalUsed
        totalLock
        totalISec
        totalCashback
        feeISec
      }
    }
}
  `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    delete payload.paging;
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const list = data?.data?.EwalletIsecReportBo?.ReportByDay;

    if (list?.length) {
      yield delay(500);
      callback && callback(true, list ?? {});
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_ISEC_REPORT.REQUEST, doAction);
}
