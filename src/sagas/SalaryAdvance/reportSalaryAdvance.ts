import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_SALARY_ADVANCE.REQUEST;
}

const SQL_QUERY = `
query REPORT_SALARY_ADVANCE($input:ReportAdvanceSalaryInput) {
    AdvanceSalaryBo {
      ReportAdvanceSalary(input: $input) {
        data {
          merchantName
          advanceSalaryStaffNumber
          unreimbursedStaffNumber
          amountTotal
          reimbursedAmount
          unreimbursedAmount
        }
      }
    }
  }
`;

function* getReportSalaryAdvance({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const reportSalaryAdvance = data.data.AdvanceSalaryBo.ReportAdvanceSalary;
    if (reportSalaryAdvance) {
      callback && callback(true, reportSalaryAdvance);
    } else {
      callback && callback(false, null);
    }
  } catch (error) {
    callback && callback(false, null);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_SALARY_ADVANCE.REQUEST, getReportSalaryAdvance);
}
