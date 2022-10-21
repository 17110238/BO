import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<any> {
  type?: string;
}

const SQL_QUERY = `query getWalletIssuers($input: AppIssuerGetInput)  {
  EWalletIssuer{
    AppIssuerGet(input: $input){
      message,
      succeeded,
      data{
        id,
        shortName,
        name,
        showName,
        service,
        isActive,
        description,
        configs,
        logo,
        createdAt,
        updatedAt
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

    const results = data.data.EWalletIssuer.AppIssuerGet;

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
  yield takeLatest(types.GET_ISSUER_LIST.REQUEST, doAction);
}
