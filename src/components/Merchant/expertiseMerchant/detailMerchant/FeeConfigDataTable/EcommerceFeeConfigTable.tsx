import LoadingInline from 'components/common/Loading/LoadingInline';
import Nodata from 'components/common/NoData/Nodata';
import useWindowDimensions from 'hook/useWindowDimension';
import { FeeMerchantConfig, MerchantDefaultFeeItem, MerchantFeeItem } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TypeConfigFeeMcEnum } from 'redux/actions';
import { formatValueDefaultOnData } from '../utils/formatDataFee';

interface Props {
  checkAll: string;
  form: UseFormReturn<FeeMerchantConfig>;
  formLog?: UseFormReturn<Pick<MerchantFeeItem, 'logInfo'>>;
  loading: boolean;
  isSubmit: boolean;
  isSubmitBtnPressed: boolean;
  isApproveFeeConfig: boolean;
  hideCheckDefault?: boolean;
  data: FeeMerchantConfig;
  setChecked?: React.Dispatch<React.SetStateAction<string>>;
  onSubmitForm: (data: MerchantFeeItem[], type: TypeConfigFeeMcEnum, isFeeChange: boolean) => void;
  onSubmitError: SubmitErrorHandler<FeeMerchantConfig | Pick<MerchantFeeItem, 'logInfo'>>;
}

enum TypeObject {
  gatewayFee = 'gatewayFee',
  fixedGatewayFee = 'fixedGatewayFee',
  transactionFee = 'transactionFee',
  fixedTransactionFee = 'fixedTransactionFee',
}

const EcommerceFeeConfigTable: React.FC<Props> = ({
  loading = false,
  checkAll = 'INIT',
  isSubmit = false,
  isSubmitBtnPressed,
  isApproveFeeConfig,
  hideCheckDefault = false,
  data = {},
  form,
  formLog,
  onSubmitForm,
  setChecked,
  onSubmitError,
  ...rest
}) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
  } = form;
  const { t } = useTranslation('common');

  const ecommerceDefaultFee = useSelector<any, MerchantDefaultFeeItem[]>(
    (state) => state?.utility?.defaultMerchantFee.ecommerceFeeList
  );
  const merchantFee = useSelector<any, FeeMerchantConfig>((state) => state?.merchantRD.merchantFee);

  const { width: screenWidth } = useWindowDimensions();
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [columns, setColumns] = useState<TableColumn<MerchantFeeItem>[]>([]);

  const submitBtn = useRef<HTMLButtonElement>(null);

  const getErrorFormIndex = (index: number, type: string) => {
    const targetError = errors.ecommerceFeeList && errors.ecommerceFeeList[index];

    if (!targetError) return '';

    return targetError[type as keyof MerchantFeeItem] ? 'input-custom-error' : '';
  };

  const generateColumn = () => {
    const column: TableColumn<MerchantFeeItem>[] = [
      {
        name: t('Phương thức TT'),
        minWidth: '100px',
        maxWidth: '150px',
        cell: (row: any, index: number) => (
          <>
            <b
              className='data-table-label'
              style={{ color: '#00be00', marginRight: '8px', display: 'none' }}>
              {t('Phương thức')}:
            </b>
            <div style={{ fontWeight: 'bold' }} className='position-relative'>
              {row.paymentMethodName}
            </div>
          </>
        ),
      },
      {
        name: t('Phí người dùng'),
        minWidth: '150px',
        cell: (row, index) => {
          return (
            <>
              <b className='data-table-label' style={{ marginRight: '8px', display: 'none' }}>
                {t('Phí người dùng')}:
              </b>

              <div className='fee-input-item'>
                {!hideCheckDefault && (
                  <label className='fee-input-item__default'>
                    <input
                      type='checkbox'
                      {...register(`ecommerceFeeList.${index}.gatewayFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'gatewayFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}

                <input
                  type='number'
                  className={'fee-input ' + getErrorFormIndex(index, 'gatewayFee')}
                  placeholder='Default'
                  {...register(`ecommerceFeeList.${index}.gatewayFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                    onChange: (e) => {
                      clearErrors(`ecommerceFeeList.${index}.gatewayFee.value`);
                    },
                  })}
                  disabled={watch(`ecommerceFeeList.${index}.gatewayFee.isDefault`)}
                />
              </div>
            </>
          );
        },
      },
      {
        name: t('Phí người dùng cố định'),
        minWidth: '150px',
        cell: (row, index) => {
          return (
            <>
              <b className='data-table-label' style={{ marginRight: '8px', display: 'none' }}>
                {t('Phí người dùng cố định')}:
              </b>

              <div className='fee-input-item'>
                {!hideCheckDefault && (
                  <label className='fee-input-item__default'>
                    <input
                      type='checkbox'
                      {...register(`ecommerceFeeList.${index}.fixedGatewayFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'fixedGatewayFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  type='number'
                  className={'fee-input ' + getErrorFormIndex(index, 'fixedGatewayFee')}
                  placeholder='Default'
                  {...register(`ecommerceFeeList.${index}.fixedGatewayFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                    onChange: (e) => {
                      clearErrors(`ecommerceFeeList.${index}.fixedGatewayFee.value`);
                    },
                  })}
                  disabled={watch(`ecommerceFeeList.${index}.fixedGatewayFee.isDefault`)}
                />
              </div>
            </>
          );
        },
      },
      {
        name: t('Phí đối soát'),
        minWidth: '150px',
        cell: (row, index) => {
          return (
            <>
              <b className='data-table-label' style={{ marginRight: '8px', display: 'none' }}>
                {t('Phí đối soát')}:
              </b>
              <div className='fee-input-item'>
                {!hideCheckDefault && (
                  <label className='fee-input-item__default'>
                    <input
                      type='checkbox'
                      {...register(`ecommerceFeeList.${index}.transactionFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'transactionFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  type='number'
                  className={'fee-input ' + getErrorFormIndex(index, 'transactionFee')}
                  placeholder='Default'
                  {...register(`ecommerceFeeList.${index}.transactionFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                    onChange: (e) => {
                      clearErrors(`ecommerceFeeList.${index}.transactionFee.value`);
                    },
                  })}
                  disabled={watch(`ecommerceFeeList.${index}.transactionFee.isDefault`)}
                />
              </div>
            </>
          );
        },
      },
      {
        name: t('Phí đối soát cố định'),
        minWidth: '150px',

        cell: (row, index) => {
          return (
            <>
              <b className='data-table-label' style={{ marginRight: '8px', display: 'none' }}>
                {t('Phí đối soát cố định')}:
              </b>
              <div className='fee-input-item'>
                {!hideCheckDefault && (
                  <label className='fee-input-item__default'>
                    <input
                      type='checkbox'
                      {...register(`ecommerceFeeList.${index}.fixedTransactionFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'fixedTransactionFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  type='number'
                  className={'fee-input ' + getErrorFormIndex(index, 'fixedTransactionFee')}
                  placeholder='Default'
                  {...register(`ecommerceFeeList.${index}.fixedTransactionFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                    onChange: (e) => {
                      clearErrors(`ecommerceFeeList.${index}.fixedTransactionFee.value`);
                    },
                  })}
                  disabled={watch(`ecommerceFeeList.${index}.fixedTransactionFee.isDefault`)}
                />
              </div>
            </>
          );
        },
      },
    ];

    return column;
  };

  const checkTableSelectAllDefault = () => {
    const newData = data.ecommerceFeeList;
    let index = 0;
    const result = newData?.reduce((prev, value) => {
      index += 4;

      return (
        prev +
        +(value.gatewayFee?.isDefault || 0) +
        +(value.fixedGatewayFee?.isDefault || 0) +
        +(value.transactionFee?.isDefault || 0) +
        +(value.fixedTransactionFee?.isDefault || 0)
      );
    }, 0);

    setChecked && setChecked(result === index ? 'CHECKED' : 'INIT');
  };

  const handleCheckDefault: any = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    valueString: TypeObject
  ) => {
    const target = e.target as HTMLInputElement;

    setValue(
      `ecommerceFeeList.${index}.${valueString}.value`,
      target.checked ? ecommerceDefaultFee[index][valueString] : 0
    );
  };

  const handleSubmitForm: SubmitHandler<FeeMerchantConfig> = async (data, e) => {
    e?.preventDefault();
    formLog?.clearErrors('logInfo');
    formLog
      ? formLog.handleSubmit((submitData, e) => {
          e?.preventDefault();

          const dataMerchantFee = formatValueDefaultOnData(merchantFee, 'ecommerceFeeList');

          const isFeeChange =
            JSON.stringify(formatValueDefaultOnData(data, 'ecommerceFeeList')) !==
            JSON.stringify(dataMerchantFee);

          // if (isFeeChange) {
          //   !submitData.logInfo?.description &&
          //     formLog.setError('logInfo.description', { type: 'required', message: '' });
          //   // !submitData.logInfo?.images?.length &&
          //   //   formLog.setError('logInfo.images', { type: 'required', message: '' });
          // } else {
          //   formLog.clearErrors('logInfo');
          // }

          data.ecommerceFeeList &&
            onSubmitForm(
              data.ecommerceFeeList?.map((fee) => ({ ...submitData, ...fee })),
              TypeConfigFeeMcEnum.ECOMMERCE,
              isFeeChange
            );
        }, onSubmitError)()
      : data.ecommerceFeeList &&
        onSubmitForm(data.ecommerceFeeList, TypeConfigFeeMcEnum.ECOMMERCE, true);
  };

  useEffect(() => {
    const subscription = watch((data, { name, type }) => {
      const newColumn: TableColumn<MerchantFeeItem>[] = generateColumn();
      (name?.split('.').includes('isDefault') || name === 'ecommerceFeeList') &&
        setColumns([...newColumn]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    setColumns([...generateColumn()]);
  }, [t, lang, isSubmitBtnPressed, isApproveFeeConfig]);

  useEffect(() => {
    if (ecommerceDefaultFee) {
      setValue('ecommerceFeeList', [...(formatValueDefaultOnData(data, 'ecommerceFeeList') || [])]);
      !hideCheckDefault && checkTableSelectAllDefault();
    }
  }, [data, ecommerceDefaultFee]);

  useEffect(() => {
    if (checkAll !== 'INIT') {
      const isCheck = checkAll === 'CHECKED';
      const dataForm = getValues('ecommerceFeeList');
      const newFormatValue: any = dataForm?.map((ele) => {
        const defaultSelect = ecommerceDefaultFee.find(
          (value) => value.paymentMethodId === ele.paymentMethodId
        );
        return {
          ...ele,
          fixedGatewayFee: {
            value: isCheck ? defaultSelect?.fixedGatewayFee : 0,
            isDefault: isCheck,
          },
          gatewayFee: {
            value: isCheck ? defaultSelect?.gatewayFee : 0,
            isDefault: isCheck,
          },
          transactionFee: {
            value: isCheck ? defaultSelect?.transactionFee : 0,
            isDefault: isCheck,
          },
          fixedTransactionFee: {
            value: isCheck ? defaultSelect?.fixedTransactionFee : 0,
            isDefault: isCheck,
          },
        };
      });
      setValue('ecommerceFeeList', newFormatValue);
    }
  }, [checkAll]);

  useEffect(() => {
    if (isSubmit) {
      submitBtn.current?.click();
    }
  }, [isSubmit, isSubmitBtnPressed]);

  useEffect(() => {
    return () => {
      setValue('ecommerceFeeList', [...(formatValueDefaultOnData(data, 'ecommerceFeeList') || [])]);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(handleSubmitForm, onSubmitError)} noValidate>
      {loading ? (
        <div className='loading-block' style={{ minHeight: '350px', marginBottom: '2rem' }}>
          <LoadingInline loading={loading} />
        </div>
      ) : (
        <div
          className={`table-payment cls-datatable datatable-fee-config ${
            screenWidth <= 768 ? 'datatable-vertical' : ''
          }`}>
          <DataTable
            data={data.ecommerceFeeList || []}
            columns={columns}
            className='datatable-fee-config'
            noDataComponent={<Nodata imageDataEmpty='' messageDataEmpty={t('No Data')} />}
            pagination={false}
            {...rest}
          />
        </div>
      )}
      <button hidden ref={submitBtn}></button>
    </form>
  );
};

export default EcommerceFeeConfigTable;
