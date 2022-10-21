import { callGraphql } from 'api/graphql';
import { EditBankEwalletInput, SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<EditBankEwalletInput> {
  type?: string;
}

const SQL_QUERY = `mutation updateCoopBank($input: EditBankEwalletInput){
  EwalletStateBankReportBo{
    EditBank(input: $input) {
      message,
      succeeded
    }
  }
}`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: payload,
    });

    const results = data.data.EwalletStateBankReportBo.EditBank;

    if (results.succeeded) {
      callback &&
        callback(
          results.succeeded,
          { data: results?.data || [], message: results?.message || null } ?? {}
        );
    } else {
      callback && callback(results.succeeded, results || {});
    }
  } catch (error) {
    console.log('error get location saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_COOPBANK.REQUEST, doAction);
}
