import { CreateEmailTemplateInput, SagaAction, UpdateEmailTemplateInput } from "models";
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<UpdateEmailTemplateInput> {
  type?: typeof types.UPDATE_TEMPLATE.REQUEST;
}

const SQL_QUERY = `
  mutation updateTemplate($input: UpdateEmailTemplateInput!) {
    EmailTemplate {
      UpdateEmailTemplate(input: $input) {
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
    const res = data?.data?.EmailTemplate?.UpdateEmailTemplate;
    if (res) {
      yield put({
        type: types.UPDATE_TEMPLATE.SUCCESS,
        payload: res?.data,
      });
      callback && callback(true, res ?? {});
    } else {
      yield put({
        type: types.UPDATE_TEMPLATE.FAILURE,
      });

      callback && callback(false, res);
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_TEMPLATE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_TEMPLATE.REQUEST, doAction)
}
