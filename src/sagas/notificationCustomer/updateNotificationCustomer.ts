import { callGraphql, callGraphQlFormData } from '../../api/graphql';
import { SagaAction } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/notificationCustomerTypes';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.UPDATE_NOTIFICATION_CUSTOMER.REQUEST;
}

const SQL_QUERY = `
    mutation EwalletAnnounce($file:Upload,$type:String,$title:String,$customer:String,$project:String,$content:String,$customerList:[String],$url:String,$redirectSchema:String,$titleSchema:String,$notiType:String) {
        EwalletAnnounce {
            Ewalletannounce(file:$file,type:$type,title:$title,
        project:$project,customer:$customer,customerList:$customerList,
            content:$content,url:$url,redirectSchema:$redirectSchema,titleSchema:$titleSchema,notiType:$notiType
        ){
            message
            succeeded
        }
        }
    }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    let res: any = null;
    if (payload?.file) {
      const { data } = yield call<any>(callGraphQlFormData, SQL_QUERY, payload, payload?.file);
      res = data;
    } else {
      const { data } = yield call<any>(callGraphql, SQL_QUERY, payload);
      res = data;
    }
    const updated = res?.data?.EwalletAnnounce?.Ewalletannounce;
    if (updated?.succeeded) {
      yield put({
        type: types.UPDATE_NOTIFICATION_CUSTOMER.SUCCESS,
        payload: updated?.message,
      });
      callback && callback(true, updated);
    } else {
      yield put({
        type: types.UPDATE_NOTIFICATION_CUSTOMER.FAILURE,
      });
      callback && callback(false, updated);
    }
  } catch (error) {
    console.log('error saga: ', error);
    yield put({
      type: types.UPDATE_NOTIFICATION_CUSTOMER.FAILURE,
    });
    callback && callback(false, { message: 'Server Error' });
  }
}

export default function* watchAction() {
  yield takeLatest(types.UPDATE_NOTIFICATION_CUSTOMER.REQUEST, doAction);
}
