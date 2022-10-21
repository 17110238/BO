import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { ReportUserInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import _ from 'lodash'

interface SagaEwalletReport extends SagaAction<ReportUserInput> {
  type?: typeof types.GET_STATISTIC_REPORT_USER.REQUEST;
}

const SQL_QUERY = `
query getStatisReportUser($input:ReportUserInput) {
    EwalletReportBo{
        StatisReportUser(input:$input){
           data {
            totalUser
            totalApp
            }
        }
    }
}
`;

function* getStatisticUser({ payload, callback }: SagaEwalletReport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const statisticUser = data.data.EwalletReportBo.StatisReportUser.data;
    if (Object.keys(statisticUser).length > 0) {
      callback && callback(true, statisticUser);
    }
     else {
      callback && callback(false, statisticUser);
    }
  } catch (error) {
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_STATISTIC_REPORT_USER.REQUEST, getStatisticUser);
}
