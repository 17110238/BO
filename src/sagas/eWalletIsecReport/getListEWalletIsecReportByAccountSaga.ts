import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getListEwalletIsecReportByAccount($input: ReportIsecByAccountEwalletIsecReportInput!) {
    EwalletIsecReportBo{
      ReportIsecByAccount(input: $input){
        data {
          accountId
          quantityCreated
          quantityReceived
          quantityUsed
          quantityTransfer
          phone
          amount
          amountCreated
          amountReceived
          amountUsed
          amountTransfer
          amountResidual
          feeUsed
          feeTransfer
        }
        total {
          accountId
          quantityCreated
          quantityReceived
          quantityUsed
          quantityTransfer
          phone
          amount
          amountCreated
          amountReceived
          amountUsed
          amountTransfer
          amountResidual
          feeUsed
          feeTransfer
        }
      }
    }
}
  `;

// const SQL_QUERY = `query getListEwalletIsecReportByAccount($input: ReportIsecByAccountEwalletIsecReportInput!) {
//     EwalletIsecReportBo{
//       ReportIsecByAccount(input: $input){
//           accountId
//           quantityCreated
//           quantityReceived
//           quantityUsed
//           quantityTransfer
//           phone
//           amountCreated
//           amountReceived
//           amountUsed
//           amountTransfer
//           amountResidual
//           feeUsed
//           feeTransfer
//       }
//     }
// }
//   `;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: { ...payload } });
    const report = data?.data?.EwalletIsecReportBo?.ReportIsecByAccount;

    if (report?.data?.length || report?.length) {
      yield delay(500);
      callback && callback(true, report ?? {});
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
    callback && callback(false, []);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_EWALLET_ISEC_REPORT_BY_ACCOUNT.REQUEST, doAction);
}
