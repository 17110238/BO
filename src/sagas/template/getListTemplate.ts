import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from "redux/types";
import { GetEmailTemplateInput, SagaAction } from "models";
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetEmailTemplateInput> {
  type?: typeof types.GET_LIST_TEMPLATE.REQUEST;
}

const SQL_QUERY = `query getListTemplate($input: GetEmailTemplateInput) {
  EmailTemplate {
    GetEmailTemplate(input: $input) {
      message
      succeeded
      totalRow
      data {
        title
        content
        description
        shortName
        type
        id
      }
    }
  }
}
`

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload }
    });
    const templates = data?.data?.EmailTemplate?.GetEmailTemplate;
    if (templates) {
      yield put({
        type: types.GET_LIST_TEMPLATE.SUCCESS,
        payload: templates?.data,
      });
      callback && callback(true, templates ?? []);
    } else {
      yield put({
        type: types.GET_LIST_TEMPLATE.FAILURE,
      });

      callback && callback(false, templates);
    }
  } catch (error) {
    console.log('error get template list: ', error);
    yield put({
      type: types.GET_LIST_TEMPLATE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_TEMPLATE.REQUEST, doAction)
}
