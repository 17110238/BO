import { call, put, takeLatest } from 'redux-saga/effects';
// import { postLogin, createAccountAPI, getListRoleOfAppUserAPI, getListScopeOfAppUserAPI } from "../apis/user.api"
// import { typeNameAccount } from "../redux.config";
import * as types from '../../redux/types';
import { callGraphql } from '../../api/graphql';
const postChangepass = (args: any) => {
  const SQL_CHANGEPASS = `
    mutation ChangePass($input: ChangePassInput!) {
      Account {
        ChangePass(input: $input) { 
          message
          succeeded
        }
      }
    }`;
  return callGraphql(SQL_CHANGEPASS, { input: { ...args } });
};

function* changePassAuth({payload, callback }:any) {
    try {
        
        const { data } = yield call(postChangepass, payload);
        if (data?.data.Account?.ChangePass?.succeeded) {
            yield put({
                type: types.UPDATE_PASSWORD_AUTH.SUCCESS,
                // payload: {
                //     username: action.payload.username,
                //     accessToken: data.data.Account.Login?.accessToken,
                //     accountInfo: data.data.Account.Login?.accountInfo,
                //     scope: data.data.Account.Login?.scope
                // },
            });
           callback(true, data?.data.Account ?? {});
        } else {
           callback(false, data?.data.Account );
        }
    } catch (error) {
        console.log('error login saga: ', error);
    }
}
export default function* watchAction() {
  yield takeLatest(types.UPDATE_PASSWORD_AUTH.REQUEST, changePassAuth);
}
