import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/roleManageTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_LIST_ROLE.REQUEST;
}

const SQL_QUERY = `
    query {
        Account {
            GetListRole{
                key
                description
                scope {
                    id
                    service
                    scope
                    description
                }
            }
        }
    }
`;

// `query {
//   Account {
//       GetListRole{
//           key
//           name
//           description
//           scope {
//               id
//               service
//               scope
//               description
//           }
//       }
//   }
// }`

function* getListRole({ callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY);
    const listRole = data.data.Account.GetListRole;
    if (Array.isArray(listRole) && listRole.length > 0) {
      yield put({
        type: types.GET_LIST_ROLE.SUCCESS,
        payload: listRole,
      });
      callback && callback(true, listRole);
    } else {
      yield put({
        type: types.GET_LIST_ROLE.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    console.log('error get list role saga: ', error);
    yield put({
      type: types.GET_LIST_ROLE.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LIST_ROLE.REQUEST, getListRole);
}
