import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/lockedCardTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { CreateCardInput } from 'models/lockedCards/lockedCardsState';

interface SagaSearch extends SagaAction<CreateCardInput> {
  type?: typeof types.LOCKED_CARD.REQUEST;
}

const SQL_QUERY = `
  mutation lockedCard($input: CreateCardInput!) {
    ManagementCard {
        CreateCard(input: $input) {
        succeeded
        message
      }
    }
  }
`;

function* lockedCard({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const result = data?.data?.ManagementCard?.CreateCard;

    if (result?.succeeded) {
      callback && callback(true, result?.message ?? '');
    } else {
      callback && callback(false, result?.message ?? '');
    }
  } catch (error) {
    callback && callback(false, 'Thất bại');
  }
}

export default function* watchAction() {
  yield takeLatest(types.LOCKED_CARD.REQUEST, lockedCard);
}
