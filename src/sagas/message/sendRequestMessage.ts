import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql, callGraphQlFormData } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.REQUEST_MESSAGE.REQUEST;
}

const SQL_QUERY = `mutation Announce($file:Upload,$target:String,$custom:String,$templateTitle:String,$title:String,$customeList:[emailInput],$description:String) {
    Announce{
      announce(
        target:$target
        custom:$custom
        templateTitle:$templateTitle
        title:$title
        description:$description
        customeList:$customeList
        file:$file
      ){
        message
        succeeded
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    if (payload.file) {
      const { data } = yield call<any>(callGraphQlFormData, SQL_QUERY, payload, payload.file);
      if (data.data.Announce.announce.succeeded) {
        callback && callback(true, data.data.Announce.announce.message);
      } else {
        callback && callback(false, data.data.Announce.announce.message);
      }
    } else {
      const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        ...payload,
      });
      if (data.data.Announce.announce.succeeded) {
        callback && callback(true, data.data.Announce.announce.message);
      } else {
        callback && callback(false, data.data.Announce.announce.message);
      }
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.REQUEST_MESSAGE.REQUEST, doAction);
}
