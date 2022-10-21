import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types';
import { SagaAction } from 'models';
import { callGraphql } from '../../api/graphql';

interface SagaSearch extends SagaAction<any> {
  type?: typeof types.GET_DETAIL_SUPPLIER.REQUEST;
}

const SQL_QUERY = `
query SearchHistory($input:SearchHistoryPaymentInput!) {
    Supplier {
      SearchHistoryPayment(input:$input){
        succeeded
        message
        
        data{
          id      
         finishedAt
         createdAt    
         transaction 
         partnerTransaction  
        merchantId
         merchantName 
        storeId 
        storeName
          amount
          fee
          feeUser
          totalUser
          type
          total
          description
          state
          supplierResponsed
          supplierTransaction
          accountNumber
          bankName
          content
          updatedAt
          upDateTimedAt
          reason
          buyerEmail
          referTransaction
          sourceCurrency
          supplierResponsed
          escrowAmount
          clientIp
          paymentId
          method
          subType
          currency
          saveCard
          capture
          isNational
          payWay         
          iSecId
          transactionDateTime
           cardType
          iSecInfo{
            amount
            total
            fee
          }
          supplier{
            id
            name
          }
          bankInfoList{
            number
            bankName
fullName
branch
content
swiftCode
qrContent
          }
          bankInfo{
            bankCode 
cardHolder
issuedAt
swiftCode
shortName
cardNumber
          }
  
          
        }
        
      }
    }
  }
`;

function* doAction({ payload, callback }: SagaSearch) {
  try {
    // console.log(payload, '___________________________________');
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
      input: { ...payload },
      // input: { filter: { supplierId: 1, createdAt: {} }, paging: { start: 0, limit: 20 } },
    });

    const detailSupplier = data?.data?.Supplier?.SearchHistoryPayment;
    // console.log('ádsadasdasdasdasdsadasdas', data.data);

    if (detailSupplier?.succeeded) {
      yield put({
        type: types.GET_DETAIL_SUPPLIER.SUCCESS,
        payload: payload?.filter, //filter payload
      });
      callback && callback(true, detailSupplier?.data ?? {});
    } else {
      yield put({
        type: types.GET_DETAIL_SUPPLIER.FAILURE,
      });
      callback && callback(false, detailSupplier?.data);
    }
  } catch (error) {
    yield put({
      type: types.GET_DETAIL_SUPPLIER.FAILURE,
    });
  }
}

export default function* watchAction() {
  yield takeLatest(types.GET_DETAIL_SUPPLIER.REQUEST, doAction);
}
