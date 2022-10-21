import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_SALARY_ADVANCE.REQUEST;
}

const SQL_QUERY = `
query LIST_SALARY_ADVANCE($input:GetAdvanceSalaryInput) {
    AdvanceSalaryBo {
      GetAdvanceSalary(
        input: $input
      ) {
        data {
          transaction
          fullname
          merchantName
          maxAmount
          createdAt
          amount
          fee
          unreimbursedAmount
          state
        }
      }
    }
  }
`;

function* getReportSalaryAdvance({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const salaryAdvance = data.data.AdvanceSalaryBo.GetAdvanceSalary;
    if (salaryAdvance) {
      callback && callback(true, salaryAdvance);
    } else {
      callback && callback(false, null);
    }
  } catch (error) {
    callback && callback(false, null);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_SALARY_ADVANCE.REQUEST, getReportSalaryAdvance);
}
