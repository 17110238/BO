import { CreateEwalletTemplateInput, SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<CreateEwalletTemplateInput> {
  type?: typeof types.CREATE_TEMPLATE_WALLET.REQUEST;
}

const SQL_QUERY = `
mutation createTemplateEwallet($input: CreateEwalletTemplateInput!) {
  EwalletTemplateBo {
    Create(input: $input) {
      message
      succeeded
    }
  }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const res = data?.data?.EwalletTemplateBo?.Create;
    if (res) {
      yield put({
        type: types.CREATE_TEMPLATE_WALLET.SUCCESS,
        payload: res?.data,
      });
      callback && callback(true, res ?? {});
    } else {
      yield put({
        type: types.CREATE_TEMPLATE_WALLET.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    console.log('error create template: ', error);
    yield put({
      type: types.CREATE_TEMPLATE_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_TEMPLATE_WALLET.REQUEST, doAction);
}
