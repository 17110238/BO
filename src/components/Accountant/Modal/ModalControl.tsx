import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import utc from 'dayjs/plugin/utc';
import numeral from 'numeral';
import { customStylesV1 } from 'utils/helpers/changeUrl';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import formatCurrency from 'utils/helpers/formatCurrency';
import { getpaymentMethodList } from 'redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { createAccountantCrossCheck } from 'redux/actions/accountantAction';
import dayjs from 'dayjs';
import { SearchParams } from 'models';
import NumberFormat from 'react-number-format';
dayjs.extend(utc);
interface TypeModalControl {
  show: boolean;
  onHide: () => void;
  handleSubmitSearch: (data: SearchParams) => void;
}
interface FormLoginSubmit {
  merchantId: number | string;
  amount: string;
  methodList: string[];
  description: string;
  birthday: Date;
  createdAt: {
    from: Date;
    to: Date;
  };
}
interface Role {
  key?: string;
  name?: string;
  description?: string;
}
interface mapIteam {
  iteam?: {};
  index: number;
}

const ModalControl = (props: TypeModalControl) => {
  const { t } = useTranslation('common');
  const { show, onHide, handleSubmitSearch } = props;
  const dispatch = useDispatch();
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(5, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
    amount: null,
  };
  const [initialValue, setInitialValue] = useState<any>({});
  const checkPaymentMe: [] = useSelector<any, []>((state) => state?.utility?.paymentMethods);
  const asyncSelectRef = useRef<any>();
  const paymentMethods = checkPaymentMe
    .filter((item: any, index) => {
      if (item?.name && item?.payCode) {
        return item;
      }
    })
    .map((item: any, index) => {
      return { label: item.name, value: item.payCode };
    });
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

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);
  useEffect(() => {
    setInitialValue(defaultValue);
    return () => {
      const defaultValues = {
        createdAt: {
          from: dayjs().subtract(5, 'day').toISOString(),
          to: dayjs().endOf('date').toISOString(),
        },
        typeSearch: 'tranId',
      };
      return handleSubmitSearch && handleSubmitSearch(defaultValues);
    };
  }, []);

  const handleSubmitCreateCrossCheck: SubmitHandler<FormLoginSubmit> = (data, e) => {
    let payload: any = {
      merchantId: data.merchantId,
      amount: parseInt(data.amount?.split(',').join('')),
      startDay: data?.createdAt.from,
      endDay: data.createdAt.to,
      methodList: data.methodList,
      description: data.description,
    };
    dispatch(
      createAccountantCrossCheck(payload, (status: boolean, response: any) => {
        if (response.succeeded) {
          alert('success', response.message, t);
          setValue('description', '');
          setValue('amount', '');
          reset();
        } else {
          alert('error', response?.message, t);
        }
      })
    );
  };
  useEffect(() => {
    if (checkPaymentMe?.length == 0) {
      dispatch(getpaymentMethodList((status, res) => {}));
    }
  }, [show]);
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>{t('Tạo lệnh đối soát')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSubmitCreateCrossCheck)}>
            <div className='div'>
              <label>{t('Doanh nghiệp')}</label>
              <span className='text-danger'> (*)</span>
              <AsyncSelect
                asyncType='MERCHANT'
                control={control}
                clearError={clearErrors}
                keyReturn='merchantId'
                isAllowSearchAll={false}
                name='merchantId'
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
            <div className={`form-group mt-2 ${errors?.merchantId ? 'input-custom-error' : ''}`}>
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
                    maxLength={15}
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
              {errors?.amount?.type && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {'Số tiền không được rỗng'}
                </p>
              )}
            </div>
            <div className='date-picker-custom'>
            <DatePickerCustomV2
              placeholder={'DD/MM/YYYY HH:mm'}
              control={control}
              clearErrors={clearErrors}
              className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
              rules={{ from: { required: true }, to: { required: true } }}
            />
          </div>
            <div>
              <label className='mt-2' >{t('Hạn mục đối soát')}</label>
              <span className='text-danger'> (*)</span>
              <Controller
                control={control}
                name={'methodList'}
                rules={{ required: true }}
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
                    isMulti
                    maxMenuHeight={200}
                    value={paymentMethods.filter((option) => {
                      return value?.includes(option.value);
                    })}
                    onChange={(paymentMethods) => {
                      return onChange(paymentMethods?.map((option) => option.value));
                    }}
                    options={paymentMethods}
                    noOptionsMessage={() => {
                      return t('Không tìm được kết quả');
                    }}
                    styles={customStylesV1}
                    placeholder='Chọn các phương thức'
                  />
                )}
              />
              {errors?.methodList && (
                <p className='mt-10 mb-0 txt-valid'>
                  <i className='i-valid' />
                  {'Hạn mục đối soát không được rỗng'}
                </p>
              )}
            </div>
            <div className='inputs-group'style={{padding:'1rem 0px'}}>
              <div
                className={`form-group form-input-textarea ${
                  errors?.description ? 'input-custom-error' : ''
                }`}
                style={{ backgroundColor: 'rgba(184, 182, 182, 0.301)' }}>
                <label>
                  {/* {t('Expired time')} */}
                  {t('Description')}
                  <span className='text-danger'> (*)</span>
                </label>
                <textarea
                  className='input-textarea'
                  placeholder={t('Nhập mô tả')}
                  style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                  {...register('description', { required: 'Mô tả không được để trống' })}
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
            <Button variant='primary' type='submit'>
              {' '}
              <i className='fa fa-paper-plane'></i> Gửi
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalControl);
