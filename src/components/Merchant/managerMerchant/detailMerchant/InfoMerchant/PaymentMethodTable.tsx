import { ForexType, MerchantAccount, PaymentMethod } from 'models';
import React, { useEffect, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import _ from 'lodash';
import defaultMethod from '../utils/constDefaultMethod';
import {
  bussinessOption,
  forexType,
  serviceOptions,
  supplierOption_1,
  supplierOption_2,
  supplierOption_3,
  typeOption,
} from '../utils/constantSelectOptions';

interface Props {
  checked?: string[];
  form: UseFormReturn<MerchantAccount>;
  refresh: boolean;
}

const PaymentMethodTable: React.FC<Props> = ({ checked, form, refresh }) => {
  const { t } = useTranslation('common');
  const profile = useSelector<any, MerchantAccount>((state) => state.merchantRD.merchantProfile);
  const {
    control,
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = form;
  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );

  const indexOfMethod = (id: number) => {
    const index = tablePaymentPosition?.findIndex((value) => {
      return +value === id;
    });
    return index;
  };

  const [isShowSupplierAPOFF, setIsShowSupplierAPOFF] = useState<boolean>(false);
  const [isShowSupplierAPON, setIsShowSupplierAPON] = useState<boolean>(false);
  const [isShowSupplierQRPAY, setIsShowSupplierQRPAY] = useState<boolean>(false);

  useEffect(() => {
    profile?.paymentMethodExtend?.map((item: any) => {
      if (item.method === 5 && item?.extraData?.type === 'MANUAL') {
        setIsShowSupplierAPOFF(true)
      }
      if (item.method === 7 && item?.extraData?.type === 'MANUAL') {
        setIsShowSupplierAPON(true)
      }
      if (item.method === 606 && item?.extraData?.type === 'MANUAL') {
        setIsShowSupplierQRPAY(true)
      }
    })
  }, [])

  const tablePaymentPosition = paymentMethods
    .filter((ele) => ele.paymentType !== 'FOLDER')
    .map((ele) => ele.id);
  const nameOfMethod = (id: number) => {
    const target = paymentMethods?.find((value) => value.id === +id);
    return target?.name || '';
  };

  const getErrorFormIndex = (index: number, type: string) => {
    const errorExtraData =
      errors?.paymentMethodExtend && errors?.paymentMethodExtend[index]?.extraData;
    if (!errorExtraData) {
      return '';
    }
    return errorExtraData[type as keyof {}] ? ' input-custom-error' : '';
  };

  useEffect(() => {
    if (checked) {
      const newPaymentExtend = tablePaymentPosition.map((method) => {
        if (!checked.includes(method.toString())) return {};
        const defaultValue: any = defaultMethod[+method as keyof {}] || { isTransferNow: false };
        const newValue = _.merge(
          { ...defaultValue },
          getValues(`paymentMethodExtend.${indexOfMethod(+method)}.extraData` as const)
        );
        return {
          method: +method,
          extraData: newValue,
        };
      });
      setValue('paymentMethodExtend', [...newPaymentExtend]);
    }
  }, [refresh]);

  const handleIsShowSupplier = (method: string, value: any) => {
    method === 'ALIPAY_OFFLINE' && setIsShowSupplierAPOFF(!isShowSupplierAPOFF)
    method === 'ALIPAY_ONLINE' && setIsShowSupplierAPON(!isShowSupplierAPON)
    method === 'QRPAY' && setIsShowSupplierQRPAY(!isShowSupplierQRPAY)
  };

  return (
    <>
      {checked?.length ? (
        checked?.map((check, index) => {
          setValue(`paymentMethodExtend.${indexOfMethod(+check)}.method` as const, +check);

          switch (+check) {
            //#region Th??? ATM
            case 2:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' +
                      getErrorFormIndex(indexOfMethod(+check), 'serviceCode')
                    }>
                    <label>{t('M?? d???ch v???')}</label>
                    <Controller
                      control={control}
                      name={
                        `paymentMethodExtend.${indexOfMethod(
                          +check
                        )}.extraData.serviceCode` as const
                      }
                      defaultValue={'WL1'}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={serviceOptions}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.serviceCode` as const
                              );
                              field.onChange(newValue?.value);
                            }}
                            value={
                              serviceOptions.find((ele) => {
                                return ele.value === field?.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            //#region Alipay Offline
            case 5:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Lo???i')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      rules={{ required: true }}
                      defaultValue={'DEFAULT'}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={typeOption}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.type` as const
                              );
                              onChange(newValue?.value);
                              handleIsShowSupplier('ALIPAY_OFFLINE', newValue?.value);
                            }}
                            value={typeOption.find((ele) => {
                              return ele.value === value || null;
                            })}
                            // value={typeOption[1]}
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  {isShowSupplierAPOFF && (
                    <div
                      className={
                        'form-group flex-full ' +
                        getErrorFormIndex(indexOfMethod(+check), 'supplier')
                      }>
                      <label>{t('Supplier')}</label>
                      <Controller
                        control={control}
                        name={
                          `paymentMethodExtend.${indexOfMethod(+check)}.extraData.supplier` as const
                        }
                        defaultValue={'ALIPAY'}
                        render={({ field }) => (
                          <React.Fragment>
                            <ReactSelect
                              isSearchable={false}
                              className='select-input-form'
                              classNamePrefix='input-select'
                              options={supplierOption_1}
                              onChange={(newValue) => {
                                clearErrors(
                                  `paymentMethodExtend.${indexOfMethod(
                                    +check
                                  )}.extraData.supplier` as const
                                );
                                field.onChange(newValue?.value);
                              }}
                              value={
                                supplierOption_1.find((ele) => {
                                  return ele.value === field.value;
                                }) || null
                              }
                              placeholder='--- Vui l??ng ch???n ---'
                            />
                          </React.Fragment>
                        )}
                      />
                    </div>
                  )}
                  <div
                    className={
                      'form-group flex-full ' +
                      getErrorFormIndex(indexOfMethod(+check), 'forexExchangeType')
                    }>
                    <label>{t('Ngu???n t??? gi??')}</label>
                    <Controller
                      control={control}
                      name={
                        `paymentMethodExtend.${indexOfMethod(
                          +check
                        )}.extraData.forexExchangeType` as const
                      }
                      rules={{ required: true }}
                      defaultValue={ForexType.REUTER}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={forexType}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.forexExchangeType` as const
                              );
                              field.onChange(newValue?.value);
                            }}
                            value={
                              forexType.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            //#region Alipay Online
            case 7:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Lo???i')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      rules={{ required: true }}
                      defaultValue={'DEFAULT'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={typeOption}
                            defaultValue={typeOption[0]}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.type` as const
                              );
                              field.onChange(newValue?.value);
                              handleIsShowSupplier('ALIPAY_ONLINE', newValue?.value);
                            }}
                            value={
                              typeOption.find((ele) => {
                                return ele.value === field?.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  {isShowSupplierAPON && (
                    <div
                      className={
                        'form-group flex-full ' +
                        getErrorFormIndex(indexOfMethod(+check), 'supplier')
                      }>
                      <label>{t('Supplier')}</label>
                      <Controller
                        control={control}
                        name={
                          `paymentMethodExtend.${indexOfMethod(+check)}.extraData.supplier` as const
                        }
                        defaultValue={'ALIPAY'}
                        render={({ field }) => (
                          <React.Fragment>
                            <ReactSelect
                              isSearchable={false}
                              className='select-input-form'
                              classNamePrefix='input-select'
                              options={supplierOption_1}
                              onChange={(newValue) => {
                                clearErrors(
                                  `paymentMethodExtend.${indexOfMethod(
                                    +check
                                  )}.extraData.supplier` as const
                                );
                                field.onChange(newValue?.value);
                              }}
                              value={
                                supplierOption_1.find((ele) => {
                                  return ele.value === field.value;
                                }) || null
                              }
                              placeholder='--- Vui l??ng ch???n ---'
                            />
                          </React.Fragment>
                        )}
                      />
                    </div>
                  )}
                  <div
                    className={
                      'form-group flex-full ' +
                      getErrorFormIndex(indexOfMethod(+check), 'forexExchangeType')
                    }>
                    <label>{t('Ngu???n t??? gi??')}</label>
                    <Controller
                      control={control}
                      name={
                        `paymentMethodExtend.${indexOfMethod(
                          +check
                        )}.extraData.forexExchangeType` as const
                      }
                      rules={{ required: true }}
                      defaultValue={ForexType.REUTER}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={forexType}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.forexExchangeType` as const
                              );
                              field.onChange(newValue?.value);
                            }}
                            value={
                              forexType.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            //#region QR Pay
            case 606:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>

                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Lo???i')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      rules={{ required: true }}
                      defaultValue={'DEFAULT'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={typeOption}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.type` as const
                              );
                              field.onChange(newValue?.value);
                              handleIsShowSupplier('QRPAY', newValue?.value);
                            }}
                            value={
                              typeOption.find((ele) => {
                                return ele.value === field?.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>

                  {isShowSupplierQRPAY && (
                    <div
                      className={
                        'form-group flex-full ' +
                        getErrorFormIndex(indexOfMethod(+check), 'supplier')
                      }>
                      <label>{t('Supplier')}</label>
                      <Controller
                        control={control}
                        name={
                          `paymentMethodExtend.${indexOfMethod(+check)}.extraData.supplier` as const
                        }
                        defaultValue={'PVCOMBANK'}
                        render={({ field }) => (
                          <React.Fragment>
                            <ReactSelect
                              isSearchable={false}
                              className='select-input-form'
                              classNamePrefix='input-select'
                              options={supplierOption_3}
                              onChange={(newValue) => {
                                clearErrors(
                                  `paymentMethodExtend.${indexOfMethod(
                                    +check
                                  )}.extraData.supplier` as const
                                );
                                field.onChange(newValue?.value);
                              }}
                              value={
                                supplierOption_3.find((ele) => {
                                  return ele.value === field.value;
                                }) || null
                              }
                              placeholder='--- Vui l??ng ch???n ---'
                            />
                          </React.Fragment>
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            //#endregion
            //#region Th??? qu???c t??? (VN)
            case 612:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Giao d???ch c???n quy???t to??n')}</label>
                    <label className='switch'>
                      <input
                        defaultChecked={true}
                        type='checkbox'
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isCapture` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div className='form-input-checkbox'>
                    <label>{t('Giao d???ch c???n x??c th???c')}</label>
                    <label className='switch'>
                      <input
                        defaultChecked={true}
                        type='checkbox'
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.is3DSecure` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'mid')
                    }>
                    <label>{t('L??nh v???c KD')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.mid` as const}
                      rules={{ required: true }}
                      defaultValue={'4'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={bussinessOption}
                            onChange={(newValue) => {
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.mid` as const
                              );
                              field.onChange(newValue?.value);
                            }}
                            value={
                              bussinessOption.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Lo???i')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      rules={{ required: true }}
                      defaultValue={'MANUAL'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={typeOption}
                            onChange={(newValue) => {
                              field.onChange(newValue?.value);
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.type` as const
                              );
                            }}
                            value={
                              typeOption.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'supplier')
                    }>
                    <label>{t('Supplier')}</label>
                    <Controller
                      control={control}
                      name={
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.supplier` as const
                      }
                      rules={{ required: true }}
                      defaultValue={'SACOMBANK'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={supplierOption_2}
                            onChange={(newValue) => {
                              field.onChange(newValue?.value);
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.supplier` as const
                              );
                            }}
                            value={
                              supplierOption_2.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            //#region V?? MoMo
            case 614:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' +
                      getErrorFormIndex(indexOfMethod(+check), 'accessKey')
                    }>
                    <label>{t('Access key')}</label>
                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.accessKey` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(
                                +check
                              )}.extraData.accessKey` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' +
                      getErrorFormIndex(indexOfMethod(+check), 'serectKey')
                    }>
                    <label>{t('Serect key')}</label>
                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.serectKey` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(
                                +check
                              )}.extraData.serectKey` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' +
                      getErrorFormIndex(indexOfMethod(+check), 'partnerCode')
                    }>
                    <label>{t('Partner code')}</label>

                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(
                          +check
                        )}.extraData.partnerCode` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(
                                +check
                              )}.extraData.partnerCode` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            //#region V?? ZaloPay
            case 615:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'appId')
                    }>
                    <label>{t('App ID')}</label>

                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.appId` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(
                                +check
                              )}.extraData.appId` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'appUser')
                    }>
                    <label>{t('App User')}</label>

                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.appUser` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(
                                +check
                              )}.extraData.appUser` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'key1')
                    }>
                    <label>{t('Key 1')}</label>
                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.key1` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(+check)}.extraData.key1` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'key2')
                    }>
                    <label>{t('Key 2')}</label>
                    <input
                      className='form-control'
                      placeholder='Vui l??ng nh???p'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.key2` as const,
                        {
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(+check)}.extraData.key2` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            //#region Th??? qu???c t??? (NN)
            case 618:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div className='form-input-checkbox'>
                    <label>{t('Giao d???ch c???n quy???t to??n')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={true}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isCapture` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div className='form-input-checkbox'>
                    <label>{t('Giao d???ch c???n x??c th???c')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={true}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.is3DSecure` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'mid')
                    }>
                    <label>{t('L??nh v???c KD')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.mid` as const}
                      rules={{ required: true }}
                      defaultValue={'4'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={bussinessOption}
                            onChange={(newValue) => {
                              field.onChange(newValue?.value);
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.mid` as const
                              );
                            }}
                            value={
                              bussinessOption.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Lo???i')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      rules={{ required: true }}
                      defaultValue={'MANUAL'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={typeOption}
                            onChange={(newValue) => {
                              field.onChange(newValue?.value);
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.type` as const
                              );
                            }}
                            value={
                              typeOption.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'supplier')
                    }>
                    <label>{t('Supplier')}</label>
                    <Controller
                      control={control}
                      name={
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.supplier` as const
                      }
                      rules={{ required: true }}
                      defaultValue={'SACOMBANK'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
                            isSearchable={false}
                            className='select-input-form'
                            classNamePrefix='input-select'
                            options={supplierOption_2}
                            onChange={(newValue) => {
                              field.onChange(newValue?.value);
                              clearErrors(
                                `paymentMethodExtend.${indexOfMethod(
                                  +check
                                )}.extraData.supplier` as const
                              );
                            }}
                            value={
                              supplierOption_2.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui l??ng ch???n ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            //#endregion
            default:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuy???n ti???n ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        {...register(
                          `paymentMethodExtend.${indexOfMethod(
                            +check
                          )}.extraData.isTransferNow` as const
                        )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                </div>
              );
          }
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default PaymentMethodTable;
