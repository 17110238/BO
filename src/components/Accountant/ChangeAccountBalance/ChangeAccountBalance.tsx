import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect, { SingleValue } from 'react-select';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useDispatch } from 'react-redux';
import { depositWithdrawEwalletAction } from 'redux/actions/depositWithdrawAction';
import NumberFormat from 'react-number-format';
import alert from 'utils/helpers/alert';
import LoadingInline from 'components/common/Loading/LoadingInline';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
interface FormLoginSubmit {
  action: string;
  description?: string;
  merchantId: string;
  amount: string;
}

const rulesForm = {
  merchantId: { required: true, minLength: 3, maxLength: 15 },
  action: { required: true },
  amount: { isVNumber: true, minLength: 2, maxLength: 15 },
};

const data = [
  { label: 'Cộng', value: 'DEPOSIT' },
  { label: 'Trừ', value: 'WITHDRAW' },
];
const ChangeAccountBalance = (props: any) => {
  const { t } = useTranslation('common');

  const [loading, setLoading] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState<any>({});
  const asyncSelectRef = useRef<any>();
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    reset,
    control,
  } = useForm<FormLoginSubmit>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });
  const handleCreate = (data: FormLoginSubmit) => {
   setLoading(true);
    let payload: any = {
      merchantId: parseInt(data.merchantId),
      amount: parseInt(data.amount?.split(',').join('')),
      action: data.action,
      description: data.description,
    };
    dispatch(
      depositWithdrawEwalletAction(payload, (status, res) => {
       setLoading(false);
        if (status) {
          alert('success', res.message);
          setValue('merchantId', '');
          setValue('amount', '');
          setValue('description', '');
        } else {
          alert('error', res.message);
        }
      })
    );
  };
  return (
    <>
      {loading && <LoadingInline loading={loading} />}
      <div className='changeAccountBalance'>
        <div className='changeAccountBalance__title'>
          <h5>{t('Cộng trừ số dư merchant')}</h5>
        </div>
        <div className='changeAccountBalance__content'>
          <div className='changeAccountBalance__content_form'>
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className='div mt-1'>
                <label>{t('Thao tác')}</label>
                <span className='text-danger'> (*)</span>
                <Controller
                  control={control}
                  rules={{ required: 'Description is required' }}
                  name={'action'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      noOptionsMessage={() => t('Không tìm được kết quả')}
                      styles={customStyles}
                      options={data}
                      placeholder='chọn thao tác (cộng hay trừ)'
                      value={data.find((c) => c.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
                {errors?.action && (
                  <p className='mt-10 mb-0 txt-valid'>
                    <i className='i-valid' />
                    {'Thao tác không được rỗng'}
                  </p>
                )}
              </div>
              <div className='div mt-1'>
                <label>{t('Doanh nghiệp')}</label>
                <span className='text-danger'> (*)</span>
                <AsyncSelect
                  asyncType='MERCHANT'
                  control={control}
                  clearError={clearErrors}
                  isAllowSearchAll={false}
                  name='merchantId'
                  keyReturn='merchantId'
                  rules={{ required: true, message: 'Doanh nghiệp không được để trống' }}
                  {...{
                    className: 'search-merchant-select',
                    classNamePrefix: 'account-async-select',
                  }}
                />
                {errors?.merchantId?.type && (
                  <p className='mt-10 mb-0 txt-valid'>
                    <i className='i-valid' />
                    {'Doanh nghiệp không được rỗng'}
                  </p>
                )}
              </div>
              {/* <Input
                                type='number'
                                label={t('Merchant Id')}
                                register={register}
                                name='merchantId'
                                errors={errors.merchantId}
                                clearErrors={clearErrors}
                                rules={{ isVNumber: true, minLength: 2, maxLength: 10, required: true }}
                                placeholder={t('Nhập id merchant')}

                            /> */}
              <div className='form-group mt-1'>
                <label>
                  {t('Số tiền')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Controller
                  name='amount'
                 
                 
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <NumberFormat
                      className={`form-control`}
                      placeholder={'*,000,000'}
                      thousandSeparator
                      autoComplete="off"
                      maxLength={15}
                      {...field}
                    />
                  )}
                />
              </div>
              {errors?.amount?.type && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {'Số tiền không được rỗng'}
                </p>
              )}
              {/* <div>
                                <label>{t('Merchant')}</label>
                                <span className='text-danger'> (*)</span>
                                <Controller
                                    control={control}
                                    name={'merchant'}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <ReactSelect
                                            theme={(theme) => ({
                                                ...theme, borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: '#EFF2F7',
                                                    primary: '#00be00',
                                                },
                                            })}
                                            noOptionsMessage={() => { return t('Không tìm được kết quả') }}
                                            styles={customStyles}
                                            placeholder='Chọn tên merchant'
                                        />
                                    )}
                                />
                            </div> */}
              <div className='inputs-group mt-1' style={{padding:'1rem 0px'}}>
                <div
                  className={`form-group form-input-textarea ${errors?.description ? 'input-custom-error' : ''
                    }`}
                  style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                  <label>
                    {t('Description')}
                    {/* <span className='text-danger'> (*)</span> */}
                  </label>
                  <textarea
                    className='input-textarea'
                    placeholder={t('Nhập mô tả')}
                    style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                    {...register('description')}
                  />
                  {errors?.description?.type === 'required' && (
                    <p
                      className='mt-10 mb-0 txt-valid align-items-center'
                      style={{ lineHeight: '1.25' }}>
                      <i className='i-valid' />
                      {errors?.description?.message}
                    </p>
                  )}
                </div>
              </div>

              <button className='btn btn-primary btn-search' disabled={loading}>
                {loading ? (
                  <i className='fa fa-spinner fa-spin'></i>
                ) : (
                  <i className='fa fa-paper-plane'></i>
                )}
                {t('Gửi')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ChangeAccountBalance);
