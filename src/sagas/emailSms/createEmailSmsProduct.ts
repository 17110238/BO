import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from 'redux/types/emailSmsTypes';
import { SagaAction } from 'models';
import { callGraphql } from 'api/graphql';
import * as typesAPI from 'redux/types';

interface SagaUpdate extends SagaAction<any>{
    type?: typeof types.CREATE_EMAIL_SMS_PRODUCT.REQUEST;
}

const SQL_QUERY = `
    mutation CreateEmailSms($input : CreateEmailSmsProductInput!) {
        EmailSMS {
            CreateEmailSmsProduct(input : $input){
                message
                succeeded
            }
        }
    }
`;

function* doAction({ payload, callback }: SagaUpdate) {
    try {
    const { data } = yield call<any>(callGraphql, SQL_QUERY, {
        input: { ...payload },
    });
    const createEmailSmsProduct = data?.data.EmailSMS.CreateEmailSmsProduct;
    if (createEmailSmsProduct?.succeeded) {
        yield put({
            type: types.CREATE_EMAIL_SMS_PRODUCT.SUCCESS,
            payload: createEmailSmsProduct?.password,
        });
        callback && callback(true, createEmailSmsProduct);
    } else {
        yield put({
            type: types.CREATE_EMAIL_SMS_PRODUCT.FAILURE,
        });

        callback && callback(false, createEmailSmsProduct);
    }
    } catch (error) {
        yield put({
            type: types.CREATE_EMAIL_SMS_PRODUCT.FAILURE,
        });
    }
}

export default function* watchAction() {
    yield takeLatest(types.CREATE_EMAIL_SMS_PRODUCT.REQUEST, doAction);
}