import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import { LinkedBanksType } from 'models/linkedBanks';

interface SagaSearch extends SagaAction<LinkedBanksType> {
  type?: typeof types.GET_LINKED_BANKS.REQUEST;
}

const SQL_QUERY = `
query GetLinkedBanks($input: BankLinkedInput){
    EwalletAccount{
        LinkedBanks(input: $input) {
        id
        accountId
        phone
        appName
        state
        linkedAt
        cardInfo{
            cardNumber
            cardHolder
            issuedAt
            expiredAt
            bankCode
        }
      }
    }
  }
`;

function* getLinkedBanksSaga({ payload, callback }: SagaSearch) {
  try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
    });
    const linkedBanks = data?.data.EwalletAccount?.LinkedBanks;
    if (linkedBanks.length > 0) {
      callback && callback(true, linkedBanks);
    } else {
      callback && callback(false, {});
    }
  } catch (error) {
    callback && callback(false, {});
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_LINKED_BANKS.REQUEST, getLinkedBanksSaga);
}
