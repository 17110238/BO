import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetEmailTemplateInput, SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<GetEmailTemplateInput> {
  type?: typeof types.GET_LIST_TEMPLATE_WALLET.REQUEST;
}

const SQL_QUERY = `
query getListTemplateEWallet($input: GetEwalletTemplateInput!) {
  EwalletTemplateBo {
    GetTemplate(input: $input) {
      message
      succeeded
      data {
        id
        title
        content
        description
        project
        shortName
        type
        createdAt
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
    const templates = data?.data?.EwalletTemplateBo?.GetTemplate;
    if (templates) {
      yield put({
        type: types.GET_LIST_TEMPLATE_WALLET.SUCCESS,
        payload: templates?.data,
      });
      callback && callback(true, templates ?? []);
    } else {
      yield put({
        type: types.GET_LIST_TEMPLATE_WALLET.FAILURE,
      });

      callback && callback(false, templates);
    }
  } catch (error) {
    console.log('error get template list: ', error);
    yield put({
      type: types.GET_LIST_TEMPLATE_WALLET.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_TEMPLATE_WALLET.REQUEST, doAction);
}
