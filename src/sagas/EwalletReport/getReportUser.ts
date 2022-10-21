import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { ReportUserInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import _ from 'lodash'

interface SagaEwalletReport extends SagaAction<ReportUserInput> {
  type?: typeof types.GET_REPORT_USER.REQUEST;
}

const SQL_QUERY = `
query getEwalletReport($input:ReportUserInput) {
    EwalletReportBo{
        ReportUser(input:$input){
           data {
            accountId
            fullname
            phone
            kycState
            appName
            birthday
            age
            gender
            address
            status
           }
        }
    }
}
`;

function* getReportUser({ payload, callback }: SagaEwalletReport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const reportUser = data.data.EwalletReportBo.ReportUser.data;
    if (reportUser.length > 0) {
      callback && callback(true, reportUser);
    }
    else {
      callback && callback(false, reportUser);
    }
  } catch (error) {
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_USER.REQUEST, getReportUser);
}
