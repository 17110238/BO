import { callGraphql } from 'api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAddDelegate } from 'redux/actions';
import * as types from 'redux/types';

interface SagaSearch extends SagaAction<PayloadAddDelegate> {
  type?: typeof types.ADD_DELEGATE_MERCHANT.REQUEST;
}

const SQL_QUERY = `
  mutation addDelegateMC($input:AddDelegateInput!){
    Merchant{
      AddDelegate (input: $input) {
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
    const added = data?.data?.Merchant?.AddDelegate;
    if (added?.succeeded) {
      yield put({
        type: types.ADD_DELEGATE_MERCHANT.SUCCESS,
        payload: added?.message,
      });
      yield put({
        type: types.GET_LIST_DELEGATE_MC.REQUEST,
        payload: {
          filter: {
            merchantId: +(payload?.merchantId || 0),
          },
        },
      });
      callback && callback(true, added);
    } else {
      yield put({
        type: types.ADD_DELEGATE_MERCHANT.FAILURE,
      });

      callback && callback(false, added);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.ADD_DELEGATE_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.ADD_DELEGATE_MERCHANT.REQUEST, doAction);
}
