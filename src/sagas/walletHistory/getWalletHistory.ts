import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/walletHistoryTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { appHistoryInput } from 'models/walletHistory/walletHistoryState';

interface SagaSearch extends SagaAction<appHistoryInput> {
  type?: typeof types.GET_WALLET_HISTORY.REQUEST;
}

const SQL_QUERY = `
  query GetWalletHistory ($input: appHistoryInput) {
    EwalletHistoryApp {
      AppHistory (input: $input) {
        message
        succeeded
        totalCredit
        totalDebit
        data {
          phone
          balance {
            before {
              cash
              credit
            }
            after {
              cash
              credit
            }
          }
          amount
          accountId
          change
          description
          referData {
            service {
              code
              type
              transaction
            }
            appId
            amount
            state
            description
            note
            accountId
            transaction
            transactionId
            createdAt
            updatedAt
            id
          }
          createdAt
          updatedAt
          id
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
    const result = data?.data?.EwalletHistoryApp?.AppHistory;

    if (result?.succeeded) {
      yield put({
        type: types.GET_WALLET_HISTORY.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? {});
    } else {
      yield put({
        type: types.GET_WALLET_HISTORY.FAILURE,
      });

      callback && callback(false, result ?? {});
    }
  } catch (error) {
    yield put({
      type: types.GET_WALLET_HISTORY.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_WALLET_HISTORY.REQUEST, doAction);
}
