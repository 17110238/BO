import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/lockedCardTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { LockCardInput } from 'models/lockedCards/lockedCardsState';

interface SagaSearch extends SagaAction<LockCardInput> {
  type?: typeof types.UPDATE_LOCKED_CARD.REQUEST;
}

const SQL_QUERY = `
  mutation UpdateLockedCard($input: BlockManagementCardInput) {
    ManagementCard {
      BlockManagementCard(input: $input) {
        succeeded
        message
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.ManagementCard?.BlockManagementCard;

    if (result?.succeeded) {
      yield put({
        type: types.UPDATE_LOCKED_CARD.SUCCESS,
        payload: result?.message,
      });
      callback && callback(true, result?.message ?? '');
    } else {
      yield put({
        type: types.UPDATE_LOCKED_CARD.FAILURE,
        payload: result?.message,
      });

      callback && callback(false, result?.message ?? '');
    }
  } catch (error) {
    yield put({
      type: types.UPDATE_LOCKED_CARD.FAILURE,
    });
    callback && callback(false, 'Thất bại');
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_LOCKED_CARD.REQUEST, doAction);
}
