import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';

interface SagaLoginHistory extends SagaAction<any> {
  type?: typeof types.LOGIN_HISTORY_CTT.REQUEST;
}

const SQL_QUERY = `
query queryLoginHistory($input:GetHistoryAccountLoginInput){
    HistoryAccountLogin{
      GetHistoryList(input:$input){
        data{
          appId
          lastLoginTime
          accountId
          lastLogoutTime
          accountId
          id
          ip
          username
          clientInfo{
            platform,
            deviceId,
            channel,
            version,
            userAgent
          }
        }
      }
    }
  }
`;

// `query queryLoginHistory($input:GetHistoryAccountLoginInput){
//   HistoryAccountLogin{
//     GetHistoryList(input:$input){
//       data{
//         appId
//         lastLoginTime
//         accountId
//         lastLogoutTime
//         accountId
//         state
//         id
//         updatedAt
//         createdAt
//         ip
//         username
//         clientInfo{
//            platform,
//           deviceId,
//           channel,
//           version,
//           isEmulator,
//           isRoot,
//           userAgent,
//           getBrand,
//           buildNumber,
//           bundleId,
//           deviceType,
//           model,
//           readableVersion,
//           systemName,
//           systemVersion
//         }
//       }
//     }
//   }
// }`

function* doAction({ payload, callback }: SagaLoginHistory) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const historyLoginList = data?.data?.HistoryAccountLogin?.GetHistoryList;
    if (Array.isArray(historyLoginList?.data)) {
      yield put({
        type: types.LOGIN_HISTORY_CTT.SUCCESS,
        payload: historyLoginList?.data,
      });
      callback && callback(true, historyLoginList?.data);
    } else {
      yield put({
        type: types.LOGIN_HISTORY_CTT.FAILURE,
      });
      callback && callback(false, null);
    }
  } catch (error) {
    yield put({
      type: types.LOGIN_HISTORY_CTT.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.LOGIN_HISTORY_CTT.REQUEST, doAction);
}
