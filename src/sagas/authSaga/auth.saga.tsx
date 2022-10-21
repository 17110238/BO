import { call, put, takeLatest } from 'redux-saga/effects';
// import { postLogin, createAccountAPI, getListRoleOfAppUserAPI, getListScopeOfAppUserAPI } from "../apis/user.api"
// import { typeNameAccount } from "../redux.config";
import * as types from '../../redux/types';
import { callGraphql } from '../../api/graphql';
const postLogin = (args: any) => {
  const SQL_LOGIN = `
    mutation Login($input: LoginInput!) {
      Account {
        Login(input: $input) {
          accessToken
          message
          succeeded
          accountInfo{
          accountId
          username
          fullname
          phone
          gender
          birthday
          email
          isActive
          lastedLoginAt
          lastedLogoutAt
          avatar
          }
          state
          scope
          refcode
          link
        }
      }
    }`;
  return callGraphql(SQL_LOGIN, { input: { ...args } });
};
function* loginAuth(action: any) {
  try {
    const params = {
      ...action.payload,
    };
    const { data } = yield call(postLogin, params);
    if (data?.data?.Account?.Login?.succeeded) {
      yield put({
        type: types.CHECK_AUTH.CHECK_AUTH_SUCCESS,
        payload: {
          username: action.payload.username,
          accessToken: data.data.Account.Login?.accessToken,
          accountInfo: data.data.Account.Login?.accountInfo,
          scope: data.data.Account.Login?.scope,
          link : data.data.Account.Login?.link,
          refcode : data.data.Account.Login?.refcode
        },
      });
      action.callback(true, data?.data?.Account?.Login ?? {});
    } else {
      action.callback(false, data?.data?.Account?.Login ?? {});
    }
  } catch (error) {
    action.callback(false, {});
    console.log('error login saga: ', error);
  }
  // loadingAp.next(true)
  // yield registerClient()
  // const clientId = yield select((state) => state?.ms?.clientId)
  // if (clientId) {
  // loadingApp.next(false)
}

export default function* watchAction() {
  yield takeLatest(types.CHECK_AUTH.CHECK_AUTH_REQUEST, loginAuth);
}
