import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaEwalletReport extends SagaAction<any> {
  type?: typeof types.REPORT_CHECK_SUM.REQUEST;
}

const SQL_QUERY = `
query getEwalletReport($input:ReportCheckSumInput) {
    EwalletReportBo{
        ReportCheckSum(input:$input){
            beforeBalance
            deposit
            withdraw
            withdrawSocial
            payment
            transfer
            receive
            afterBalance
            checkSum
        }
    }
}
`;

function* doAction({ payload, callback }: SagaEwalletReport) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const reportCheckSum = data?.data?.EwalletReportBo?.ReportCheckSum;
    if (reportCheckSum && Object.keys(reportCheckSum).length > 0) {
      callback && callback(true, reportCheckSum);
    } else {
      callback && callback(false, reportCheckSum);
    }
  } catch (error) {
    callback && callback(false, { message: 'Lỗi kết nối server' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.REPORT_CHECK_SUM.REQUEST, doAction);
}
