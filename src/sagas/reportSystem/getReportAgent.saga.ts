import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_REPORT_AGENT.REQUEST;
}

const SQL_QUERY = `
query REPORT_AGENT($input:ReportAgentInput!) {
       ReportMerchant {
         ReportAgent(
           input: $input
         ) {
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
    const dataReportMerchant = data?.data?.ReportMerchant?.ReportAgent;
    if (dataReportMerchant) {
      callback && callback(true, dataReportMerchant);
    } else {
      callback && callback(false, dataReportMerchant);
    }
  } catch (error) {
    callback && callback(false, error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_AGENT.REQUEST, doAction);
}
