import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { GetRequestChangeInput, SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<GetRequestChangeInput> {
  type?: typeof types.GET_PENDING_LIST_MERCHANT.REQUEST;
}

const SQL_QUERY = `query getChangeRequest($input: GetRequestChangeInput!) {
    RequestChange {
      GetRequestChange(input: $input) {
        message
        succeeded
        data {
          id
          transactionId
          methodName
          tag {
            code
            title
            groupId
          }
          src {
            code
            title
          }
          target {
            code
            title
          }
          requestData {
            original {
              phone
              isActive
            }
            change {
              phone
              isActive
              note
            }
          }
          description
          projectName
          ipnUrl
          history {
            state
            createdAt
            extraData {
              accountId
              order
              reason
            }
          }
          processList {
            telegram
            state
            group
            order
            email
            user {
              username
              fullname
              accountId
              phone
            }
          }
          approvers {
            approver
            state
            order
          }
          isTurn
          state
          createdAt
          remainBlockedTime
          isLocked
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
    const merchantPendingList = data?.data?.RequestChange?.GetRequestChange;
    if (merchantPendingList) {
      yield put({
        type: types.GET_PENDING_LIST_MERCHANT.SUCCESS,
        payload: merchantPendingList?.data,
      });
      callback && callback(true, merchantPendingList ?? {});
    } else {
      yield put({
        type: types.GET_PENDING_LIST_MERCHANT.FAILURE,
      });

      callback && callback(false, merchantPendingList);
    }
  } catch (error) {
    console.log('error get pending list merchant saga: ', error);
    yield put({
      type: types.GET_PENDING_LIST_MERCHANT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_PENDING_LIST_MERCHANT.REQUEST, doAction);
}
