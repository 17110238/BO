import { call, put, takeLatest } from 'redux-saga/effects';
import {
  postLogin,
  createAccountAPI,
  getListRoleOfAppUserAPI,
  getListScopeOfAppUserAPI,
} from '../apis/user.api';
import { typeNameAccount } from '../redux.config';
import { callGraphql } from '..';

function* login(action) {
  try {
    const params = {
      ...action.payload,
    };
    const responseLogin = yield call(postLogin, params);

    if (responseLogin?.data?.data?.Account?.Login?.succeeded) {
      yield put({
        type: `${typeNameAccount.ACCOUNT_LOGIN}_SUCCESS`,
        payload: {
          username: action.payload.username,
          accessToken: responseLogin.data.data.Account.Login?.accessToken,
        },
      });
      action.callback(true, responseLogin?.data?.data?.Account?.Login ?? {});
    } else {
      action.callback(false, responseLogin?.data?.data?.Account?.Login ?? {});
    }
  } catch (error) {
    console.log('error login saga: ', error);
  }
  // loadingAp.next(true)
  // yield registerClient()
  // const clientId = yield select((state) => state?.ms?.clientId)
  // if (clientId) {
  // loadingApp.next(false)
}

// function* createAccount(action) {
//   try {
//     const params = {
//       ...action.payload
//     }
//     console.log('saga create account , action.payload: ', params)
//     // yield put({ type: types.SHOW_LOADING });
//     const responseCreateAccount = yield call(createAccountAPI, params)
//     // yield put({ type: types.HIDE_LOADING });

//     console.log('responseCreateAccount: ', responseCreateAccount)
//     if (responseCreateAccount?.data?.data?.Account?.Create?.succeeded) {
//       action?.callback(true, responseCreateAccount?.data?.data?.Account?.Create)
//     } else {
//       action?.callback(false, responseCreateAccount?.data?.data?.Account?.Create)
//     }

//   } catch (error) {
//     console.log('error createAccount saga: ', error)
//   }
// }

function* getListRoleOfAllUser(action) {
  try {
    // yield put({ type: types.SHOW_LOADING });
    const responseGetListRole = yield call(getListRoleOfAppUserAPI);
    // yield put({ type: types.HIDE_LOADING });

    if (responseGetListRole?.data?.data?.Account?.GetListRole) {
      yield put({
        type: typeNameAccount.SET_LIST_ROLE_OF_ALL_USER,
        payload: responseGetListRole?.data?.data?.Account?.GetListRole,
      });
      action?.callback(true, responseGetListRole.data.data?.Account?.GetListRole);
    } else {
      action?.callback(false, responseGetListRole?.data?.data?.Account?.GetListRole);
    }
  } catch (error) {
    console.log('error getListRole saga: ', error);
  }
}

function* getListScopeOfAllUser(action) {
  try {
    // yield put({ type: types.SHOW_LOADING });
    const responseGetListScope = yield call(getListScopeOfAppUserAPI);
    // yield put({ type: types.HIDE_LOADING });
    if (responseGetListScope?.data?.data?.Account?.GetListScope) {
      yield put({
        type: typeNameAccount.SET_LIST_SCOPE_OF_ALL_USER,
        payload: responseGetListScope?.data?.data?.Account?.GetListScope,
      });
      action?.callback(true, responseGetListScope.data.data?.Account?.GetListScope);
    } else {
      action?.callback(false, responseGetListScope?.data?.data?.Account?.GetListScope);
    }
  } catch (error) {
    console.log('error getListRoleOfAllUser saga: ', error);
  }
}

export default function* watchAction() {
  yield takeLatest(typeNameAccount.ACCOUNT_LOGIN, login);
  yield takeLatest(typeNameAccount.GET_LIST_ROLE_OF_ALL_USER, getListRoleOfAllUser);
  yield takeLatest(typeNameAccount.GET_LIST_SCOPE_OF_ALL_USER, getListScopeOfAllUser);
}
