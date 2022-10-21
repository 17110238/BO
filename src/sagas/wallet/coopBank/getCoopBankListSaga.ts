import { callGraphql } from 'api/graphql';
import { BanksEwalletType, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<BanksEwalletType> {
  type?: string;
}

const SQL_QUERY = `query getCoopBanks {
  EwalletStateBankReportBo {
    GetBanks {
      data{
        id,
        bankName,
        serviceName,
        bankNumber,
        activeDate,
        balance
      }
    }
  }
}
  `;

function* doAction({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);

    const results = data.data.EwalletStateBankReportBo.GetBanks;

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
  yield takeLatest(types.GET_COOPBANK_LIST.REQUEST, doAction);
}
