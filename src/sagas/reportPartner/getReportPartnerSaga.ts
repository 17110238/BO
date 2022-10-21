import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `
  query getReportPartner($input: ReportPartnerInput!){
    EwalletStateBankReportBo {
      ReportPartner(input: $input){
        data{
          date,
          newPartner,
          totalNewPartners
        },
        sumNewPartner
      }
    }
  }
`;

function* doAction({ callback, payload }: SagaSearch) {
  try {
    delete payload?.paging;

    const { data } = yield call<any>(callGraphql, SQL_QUERY, { input: payload });
    const rawData = data?.data?.EwalletStateBankReportBo?.ReportPartner;

    if (rawData) {
      callback && callback(true, rawData ?? {});
    } else {
      callback && callback(false, []);
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_REPORT_PARTNER.REQUEST, doAction);
}
