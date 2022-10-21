import { CreateEmailTemplateInput, SagaAction, UpdateEmailTemplateInput, UpdateEwalletTemplateInput } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<UpdateEwalletTemplateInput> {
  type?: typeof types.UPDATE_TEMPLATE_WALLET.REQUEST;
}

const SQL_QUERY = `
  mutation updateTemplateEwallet($input: UpdateEwalletTemplateInput!) {
    EwalletTemplateBo {
      Update (input: $input) {
        message
        succeeded
      }
    }
  }
`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const res = data?.data?.EwalletTemplateBo?.Update;
    if (res) {
      yield put({
        type: types.UPDATE_TEMPLATE_WALLET.SUCCESS,
        payload: res?.data,
      });
      callback && callback(true, res ?? {});
    } else {
      yield put({
        type: types.UPDATE_TEMPLATE_WALLET.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    console.log('error update template: ', error);
    yield put({
      type: types.UPDATE_TEMPLATE_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_TEMPLATE_WALLET.REQUEST, doAction)
}
