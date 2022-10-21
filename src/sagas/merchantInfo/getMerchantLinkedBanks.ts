import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/merchantInfoTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';


interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_MERCHANT_LINKED_BANKS.REQUEST;
}

// const SQL_QUERY = `
//   query getMerchantLinkedBanks($input: BankLinkedInput) {
//     EwalletAccount {
//       LinkedBanks (input: $input) {
//         id
//         accountId
//         phone
//         appName
//         state
//         linkedAt
//         type
//         cardInfo {
//           swiftCode
//           bankName
//           bankCode
//           cardNumber
//           accountNumber
//           cardHolder
//           issuedAt
//           expiredAt
//         }
//       }
//     }
//   }
// `;
const SQL_QUERY = `
query getMerchantLinkedBanks($input:BankLinkedInput) {
  EwalletAccount {
    LinkedBanks (input:$input) {
      id
      accountId
      phone
      appName
      state
      linkedAt
      type
      cardInfo {
        swiftCode
        bankName
        bankCode
        cardNumber
        accountNumber
        cardHolder
        issuedAt
        expiredAt
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
    const result = data?.data?.EwalletAccount?.LinkedBanks;

    if (result) {
      yield put({
        type: types.GET_MERCHANT_LINKED_BANKS.SUCCESS,
        payload: result,
      });
      callback && callback(true, result ?? []);
    } else {
      yield put({
        type: types.GET_MERCHANT_LINKED_BANKS.FAILURE,
      });

      callback && callback(false, result ?? []);
    }
  } catch (error) {
    yield put({
      type: types.GET_MERCHANT_LINKED_BANKS.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_MERCHANT_LINKED_BANKS.REQUEST, doAction);
}
