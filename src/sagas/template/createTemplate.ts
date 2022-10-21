import { CreateEmailTemplateInput, SagaAction } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<CreateEmailTemplateInput> {
  type?: typeof types.CREATE_TEMPLATE.REQUEST;
}

const SQL_QUERY = `mutation createTemplate($input: CreateEmailTemplateInput!) {
  EmailTemplate {
    CreateEmailTemplate(input: $input) {
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
    const res = data?.data?.EmailTemplate?.CreateEmailTemplate;
    if (res) {
      yield put({
        type: types.CREATE_TEMPLATE.SUCCESS,
        payload: res?.data,
      });
      callback && callback(true, res ?? {});
    } else {
      yield put({
        type: types.CREATE_TEMPLATE.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    console.log('error create template: ', error);
    yield put({
      type: types.CREATE_TEMPLATE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.CREATE_TEMPLATE.REQUEST, doAction)
}
