import LoadingInline from 'components/common/Loading/LoadingInline';
import Nodata from 'components/common/NoData/Nodata';
import { FeeMerchantConfig, MerchantDefaultFeeItem, MerchantFeeItem } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { SubmitErrorHandler, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { TypeConfigFeeMcEnum } from 'redux/actions';
import useWindowDimensions from 'hook/useWindowDimension';
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
  onSubmitForm: (data: MerchantFeeItem[], type: TypeConfigFeeMcEnum, isFeeChange: boolean) => void;
  setChecked?: React.Dispatch<React.SetStateAction<string>>;
  onSubmitError: SubmitErrorHandler<FeeMerchantConfig | Pick<MerchantFeeItem, 'logInfo'>>;
}

enum TypeObject {
  gatewayFee = 'gatewayFee',
  fixedGatewayFee = 'fixedGatewayFee',
  transactionFee = 'transactionFee',
  fixedTransactionFee = 'fixedTransactionFee',
}

const PoboFeeConfigTable: React.FC<Props> = ({
  loading = false,
  isSubmit = false,
  hideCheckDefault = false,
  checkAll = 'INIT',
  isSubmitBtnPressed,
  isApproveFeeConfig,
  data = {},
  form,
  formLog,
  onSubmitForm,
  setChecked,
  onSubmitError,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation('common');
  const lang = localStorage.getItem('NEXT_LOCALE');

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = form;

  const poboDefaultFee = useSelector<any, MerchantDefaultFeeItem[]>(
    (state) => state?.utility?.defaultMerchantFee.poboFeeList
  );
  const merchantFee = useSelector<any, FeeMerchantConfig>((state) => state?.merchantRD.merchantFee);

  const submitBtn = useRef<HTMLButtonElement>(null);

  const [columns, setColumns] = useState<TableColumn<MerchantFeeItem>[]>([]);

  const getErrorFormIndex = (index: number, type: string) => {
    const targetError = errors.poboFeeList && errors.poboFeeList[index];

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
                {t('Phí phí người dùng')}:
              </b>
              <div className='fee-input-item'>
                {!hideCheckDefault && (
                  <label className='fee-input-item__default'>
                    <input
                      type='checkbox'
                      {...register(`poboFeeList.${index}.gatewayFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'gatewayFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  className={'fee-input ' + getErrorFormIndex(index, 'gatewayFee')}
                  placeholder='Default'
                  {...register(`poboFeeList.${index}.gatewayFee.value`, {
                    // required: true,
                    valueAsNumber: true,
                  })}
                  disabled={watch(`poboFeeList.${index}.gatewayFee.isDefault`)}
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
                      {...register(`poboFeeList.${index}.fixedGatewayFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'fixedGatewayFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  className={'fee-input ' + getErrorFormIndex(index, 'fixedGatewayFee')}
                  placeholder='Default'
                  {...register(`poboFeeList.${index}.fixedGatewayFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                  })}
                  disabled={watch(`poboFeeList.${index}.fixedGatewayFee.isDefault`)}
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
                      {...register(`poboFeeList.${index}.transactionFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'transactionFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  className={'fee-input ' + getErrorFormIndex(index, 'transactionFee')}
                  placeholder='Default'
                  {...register(`poboFeeList.${index}.transactionFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                  })}
                  disabled={watch(`poboFeeList.${index}.transactionFee.isDefault`)}
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
                      {...register(`poboFeeList.${index}.fixedTransactionFee.isDefault`, {
                        onChange: (e) => handleCheckDefault(e, index, 'fixedTransactionFee'),
                      })}
                    />
                    {t('Mặc định')}
                  </label>
                )}
                <input
                  className={'fee-input ' + getErrorFormIndex(index, 'fixedTransactionFee')}
                  placeholder='Default'
                  {...register(`poboFeeList.${index}.fixedTransactionFee.value`, {
                    valueAsNumber: true,
                    // required: true,
                  })}
                  disabled={watch(`poboFeeList.${index}.fixedTransactionFee.isDefault`)}
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
    const newData = data.poboFeeList;
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
      `poboFeeList.${index}.${valueString}.value`,
      target.checked ? poboDefaultFee[index][valueString] : 0
    );
  };

  const handleSubmitForm: SubmitHandler<FeeMerchantConfig> = (data, e) => {
    e?.preventDefault();

    formLog?.clearErrors('logInfo');

    formLog
      ? formLog.handleSubmit((submitData, e) => {
          e?.preventDefault();

          const dataMerchantFee = formatValueDefaultOnData(merchantFee, 'poboFeeList');

          const isFeeChange =
            JSON.stringify(formatValueDefaultOnData(data, 'poboFeeList')) !==
            JSON.stringify(dataMerchantFee);

          // if (isFeeChange) {
          //   !submitData.logInfo?.description &&
          //     formLog.setError('logInfo.description', { type: 'required', message: '' });
          //   // !submitData.logInfo?.images?.length &&
          //   //   formLog.setError('logInfo.images', { type: 'required', message: '' });
          // }

          data.poboFeeList &&
            onSubmitForm(
              data.poboFeeList?.map((fee) => ({ ...submitData, ...fee })),
              TypeConfigFeeMcEnum.POBO,
              isFeeChange
            );
        }, onSubmitError)()
      : data.poboFeeList && onSubmitForm(data.poboFeeList, TypeConfigFeeMcEnum.POBO, true);
  };

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      const newColumn: TableColumn<MerchantFeeItem>[] = generateColumn();
      (name?.split('.').includes('isDefault') || name === 'poboFeeList' || t) &&
        setColumns([...newColumn]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (poboDefaultFee) {
      setValue('poboFeeList', [...(formatValueDefaultOnData(data, 'poboFeeList') || [])]);
      checkTableSelectAllDefault();
    }
  }, [data, poboDefaultFee]);

  useEffect(() => {
    const dataForm = getValues('poboFeeList');
    if (checkAll !== 'INIT') {
      const isCheck = checkAll === 'CHECKED';

      const newFormatValue: any = dataForm?.map((ele) => {
        const valueSelect = poboDefaultFee.find(
          (value) => value.paymentMethodId === ele.paymentMethodId
        );
        return {
          ...ele,
          fixedGatewayFee: {
            value: isCheck ? valueSelect?.fixedGatewayFee : 0,
            isDefault: isCheck,
          },
          gatewayFee: {
            value: isCheck ? valueSelect?.gatewayFee : 0,
            isDefault: isCheck,
          },
          transactionFee: {
            value: isCheck ? valueSelect?.transactionFee : 0,
            isDefault: isCheck,
          },
          fixedTransactionFee: {
            value: isCheck ? valueSelect?.fixedTransactionFee : 0,
            isDefault: isCheck,
          },
        };
      });

      setValue('poboFeeList', newFormatValue);
    }
  }, [checkAll]);

  useEffect(() => {
    if (isSubmit) {
      submitBtn.current?.click();
    }
  }, [isSubmit, isSubmitBtnPressed]);

  useEffect(() => {
    setColumns([...generateColumn()]);
  }, [t, lang, isSubmitBtnPressed, isApproveFeeConfig]);

  useEffect(() => {
    return () => {
      setValue('poboFeeList', [...(formatValueDefaultOnData(data, 'poboFeeList') || [])]);
    };
  }, []);

  return (
    <form noValidate onSubmit={handleSubmit(handleSubmitForm, onSubmitError)}>
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
            data={data.poboFeeList || []}
            columns={columns}
            className=' data-table-custom'
            noDataComponent={<Nodata imageDataEmpty='' messageDataEmpty={t('No Data')} />}
            pagination={false}
          />
        </div>
      )}
      <button hidden ref={submitBtn}></button>
    </form>
  );
};

export default PoboFeeConfigTable;
