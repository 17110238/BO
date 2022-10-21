import { CreateEmailTemplateInput, SagaAction } from 'models';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<CreateEmailTemplateInput> {
  type?: typeof types.GET_TOP_TRANSFER.REQUEST;
}

const SQL_QUERY = `query getTopTransfer($input: GetTopMerchantInput!) {
    ReportMerchant {
        GetTopMerchant(input:$input){
          title
          merchantId
          count
          category
          amount
        }
      }
}
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const res = data?.data?.ReportMerchant?.GetTopMerchant;
    if (res) {
      callback && callback(true, res);
    } else {
      callback && callback(false, { message: 'Thất bại' });
    }
  } catch (error) {
    callback && callback(false, { message: 'Thất bại' });
  }
}

export default function* watchAction() {
  yield takeEvery(types.GET_TOP_TRANSFER.REQUEST, doAction);
}
