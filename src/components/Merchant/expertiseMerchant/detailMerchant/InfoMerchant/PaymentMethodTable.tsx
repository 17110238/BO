import { MerchantAccount, PaymentMethod } from 'models';
import React, { useEffect } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import _ from 'lodash';
import defaultMethod from '../utils/constDefaultMethod';
import {
  bussinessOption,
  serviceOptions,
  supplierOption_1,
  supplierOption_2,
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

  const tablePaymentPosition = paymentMethods
    .filter((ele) => ele.paymentType !== 'FOLDER')
    .map((ele) => ele.id);

  const nameOfMethod = (id: number) => {
    const target = paymentMethods?.find((value) => value.id === +id);

    return target?.name || '';
  };

  const indexOfMethod = (id: number) => {
    const index = tablePaymentPosition?.findIndex((value) => {
      return +value === id;
    });

    return index;
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

  return (
    <>
      {checked?.length ? (
        checked?.map((check, index) => {
          setValue(`paymentMethodExtend.${indexOfMethod(+check)}.method` as const, +check);

          switch (+check) {
            case 2:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                    <label>{t('Mã dịch vụ')}</label>
                    <Controller
                      control={control}
                      name={
                        `paymentMethodExtend.${indexOfMethod(
                          +check
                        )}.extraData.serviceCode` as const
                      }
                      defaultValue={'WL1'}
                      // rules={{ required: true }}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            case 5:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                    <label>{t('Loại')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      // rules={{ required: true }}
                      defaultValue={'MANUAL'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            }}
                            value={
                              typeOption.find((ele) => {
                                return ele.value === field.value;
                              }) || null
                            }
                            placeholder='--- Vui lòng chọn ---'
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
                      defaultValue={'ALIPAY'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            case 7:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                    <label>{t('Loại')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      // rules={{ required: true }}
                      defaultValue={'MANUAL'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            }}
                            value={
                              typeOption.find((ele) => {
                                return ele.value === field?.value;
                              }) || null
                            }
                            placeholder='--- Vui lòng chọn ---'
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
                      defaultValue={'ALIPAY'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            case 606:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                      getErrorFormIndex(indexOfMethod(+check), 'storeCode')
                    }>
                    <label>{t('QRCode NH')}</label>
                    <input
                      placeholder='Vui lòng nhập'
                      autoComplete='off'
                      className='form-control'
                      {...register(
                        `paymentMethodExtend.${indexOfMethod(+check)}.extraData.storeCode` as const,
                        {
                          // required: true,
                          onChange: (e) => {
                            clearErrors(
                              `paymentMethodExtend.${indexOfMethod(
                                +check
                              )}.extraData.storeCode` as const
                            );
                          },
                        }
                      )}
                    />
                  </div>
                </div>
              );
            case 612:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                    <label>{t('Giao dịch cần quyết toán')}</label>
                    <label className='switch'>
                      <input
                        defaultChecked={false}
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
                    <label>{t('Giao dịch cần xác thực')}</label>
                    <label className='switch'>
                      <input
                        defaultChecked={false}
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
                    <label>{t('Lĩnh vực KD')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.mid` as const}
                      // rules={{ required: true }}
                      defaultValue={'4'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Loại')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      // rules={{ required: true }}
                      defaultValue={'MANUAL'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
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
                      // rules={{ required: true }}
                      defaultValue={'SACOMBANK'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            case 614:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                      placeholder='Vui lòng nhập'
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
                      placeholder='Vui lòng nhập'
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
                      placeholder='Vui lòng nhập'
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
            case 615:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                      placeholder='Vui lòng nhập'
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
                      placeholder='Vui lòng nhập'
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
                      placeholder='Vui lòng nhập'
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
                      placeholder='Vui lòng nhập'
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
            case 618:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
                    <label>{t('Giao dịch cần quyết toán')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
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
                    <label>{t('Giao dịch cần xác thực')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
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
                    <label>{t('Lĩnh vực KD')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.mid` as const}
                      // rules={{ required: true }}
                      defaultValue={'4'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                  <div
                    className={
                      'form-group flex-full ' + getErrorFormIndex(indexOfMethod(+check), 'type')
                    }>
                    <label>{t('Loại')}</label>
                    <Controller
                      control={control}
                      name={`paymentMethodExtend.${indexOfMethod(+check)}.extraData.type` as const}
                      // rules={{ required: true }}
                      defaultValue={'MANUAL'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
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
                      // rules={{ required: true }}
                      defaultValue={'SACOMBANK'}
                      render={({ field }) => (
                        <React.Fragment>
                          <ReactSelect
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
                            placeholder='--- Vui lòng chọn ---'
                          />
                        </React.Fragment>
                      )}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className='methods-table-control form-group' key={indexOfMethod(+check)}>
                  <p className='inputs-group-v2__title'>{t(nameOfMethod(+check))}</p>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
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
