import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/lockedCardTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { GetLockedCardsInput } from 'models/lockedCards/lockedCardsState';

interface SagaSearch extends SagaAction<GetLockedCardsInput> {
  type?: typeof types.GET_LOCKED_CARDS.REQUEST;
}

const SQL_QUERY = `
  query GetLockedCards($input: GetManagementCardInput) {
    ManagementCard {
      GetManagementCard(input: $input) {
        data {
          id
          number
          type
          lockTime
          swiftCode
          state
          name
          createdAt
          updatedAt
          stateAt {
            state
            date
            accountId
            fullName
          }
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
    const result = data?.data?.ManagementCard?.GetManagementCard;

    if (result) {
      yield put({
        type: types.GET_LOCKED_CARDS.SUCCESS,
        payload: result?.data,
      });
      callback && callback(true, result?.data ?? []);
    } else {
      yield put({
        type: types.GET_LOCKED_CARDS.FAILURE,
      });

      callback && callback(false, result?.data ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_LOCKED_CARDS.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LOCKED_CARDS.REQUEST, doAction);
}
