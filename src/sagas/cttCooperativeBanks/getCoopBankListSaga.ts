import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getCttCoopBanks {
  EwalletStateBankReportBo {
    GetBankPayment {
      data{
        id
        bankName
        serviceName
        bankNumber
        activeDate
        currency
      }
    }
  }
}
  `;

function* doAction({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);

    const results = data.data.EwalletStateBankReportBo.GetBankPayment;

    if (results) {
      callback &&
        callback(true, { data: results?.data || [], message: results?.message || null } ?? {});
    } else {
      callback && callback(false, results || {});
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_CTT_COOPBANK_LIST.REQUEST, doAction);
}
