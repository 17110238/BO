import { call, put, takeLatest } from 'redux-saga/effects';
// import { postLogin, createAccountAPI, getListRoleOfAppUserAPI, getListScopeOfAppUserAPI } from "../apis/user.api"
// import { typeNameAccount } from "../redux.config";
import * as types from '../../redux/types';
import { callGraphql } from '../../api/graphql';
const getListRoleOfAppUserAPI = () => {
    const SQL_GET_LIST_ROLE = `
      query GetListRole {
        Account {
          GetListRole {
            key
            name
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
    return callGraphql(SQL_GET_LIST_ROLE);
  };
  function* getListRoleOfAllUser(action:any) {
  try {
    const { data } = yield call(getListRoleOfAppUserAPI)
      if (data?.data?.Account?.GetListRole) {
      yield put({
        type: types.GET_LIST_ROLE_USER.SUCCESS,
        payload: data?.data?.Account?.GetListRole
      })
      //action?.callback(true, data?.data?.Account?.GetListRole)
    } else {
      action?.callback(false, data?.data?.Account?.GetListRole)
    }

  } catch (error) {
    console.log('error getListRole saga: ', error)
  }
}
export default function* watchAction() {
    yield takeLatest(types.GET_LIST_ROLE_USER.REQUEST, getListRoleOfAllUser);
}
  