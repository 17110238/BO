import { MerchantNoteInfo } from './../../../../../models/account/feeState';
import { DefaultFeeMerchantConfig, FeeMerchantConfig } from 'models';
import { store } from '../../../../../../store';

const defaultFee: DefaultFeeMerchantConfig = store.getState()?.utility?.defaultMerchantFee;

export const formatDataFee = (data: any, merchantId: number) => {
  if (data && Object.keys(data).length) {
    return Object.keys(data)
      .map((key) => {
        const targetFee = data[key];
        if (!targetFee.length) return;

        const newFormat = targetFee.reduce((result: any, value: any) => {
          Object.keys(value).forEach((key) => {
            if (!['paymentMethodId', 'paymentMethodName'].includes(key)) {
              const convertFirstLetterKey = key.charAt(0).toUpperCase() + key.slice(1);
              const hasDefault =
                value[key].isDefault === true
                  ? {
                      ...result[`isDefault${convertFirstLetterKey}`],
                      [value.paymentMethodId]: 'true',
                    }
                  : result[`isDefault${convertFirstLetterKey}`];
              result = {
                ...result,
                [`isDefault${convertFirstLetterKey}`]: {
                  ...hasDefault,
                },
                [`valueCog${convertFirstLetterKey}`]: {
                  ...result[`valueCog${convertFirstLetterKey}`],
                  [value.paymentMethodId]: value[key]?.value?.toString(),
                },
              };
            }
          });

          return result;
        }, {});

        newFormat.paymentMethod = key.split('FeeList')[0];
        newFormat.merchantId = merchantId.toString();

        return newFormat;
      })
      .filter((ele) => typeof ele !== 'undefined');
  }

  return [];
};

export const formatValueDefaultOnData = (data: FeeMerchantConfig, type: string) => {
  const cloneData = { ...data };
  return cloneData[type as keyof Omit<FeeMerchantConfig, 'noteInfo'>]?.map((fee) => {
    const dataSelect = defaultFee[type as keyof DefaultFeeMerchantConfig]?.find(
      (value) => value.paymentMethodId === fee.paymentMethodId
    );
    return {
      ...fee,
      gatewayFee: {
        isDefault: fee.gatewayFee?.isDefault,
        value: fee.gatewayFee?.isDefault ? dataSelect?.gatewayFee : fee.gatewayFee?.value,
      },
      fixedGatewayFee: {
        isDefault: fee.fixedGatewayFee?.isDefault,
        value: fee.fixedGatewayFee?.isDefault
          ? dataSelect?.fixedGatewayFee
          : fee.fixedGatewayFee?.value,
      },
      transactionFee: {
        isDefault: fee.transactionFee?.isDefault,
        value: fee.transactionFee?.isDefault
          ? dataSelect?.transactionFee
          : fee.transactionFee?.value,
      },
      fixedTransactionFee: {
        isDefault: fee.fixedTransactionFee?.isDefault,
        value: fee.fixedTransactionFee?.isDefault
          ? dataSelect?.fixedTransactionFee
          : fee.fixedTransactionFee?.value,
      },
    };
  });
};
