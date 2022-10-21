import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePicker from 'components/common/DatePickerCustom/DatePickerV3';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { PaymentMethod } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';

export interface PayloadRevenueMCFilterType {
  merchantId?: number;
  method?: string;
  createdAt?: {
    from: string;
    to: string;
  };
}

interface PaymentMethodSelect extends PaymentMethod {
  label: string;
  value: string;
}

interface Props {
  loading: boolean;
  onSubmitForm: (data: PayloadRevenueMCFilterType | {}) => void;
}

const BoxSearchRevenueStatistics: React.FC<Props> = ({ loading, onSubmitForm }) => {
  const router = useRouter();

  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  ).filter((method) => method.paymentType !== 'FOLDER');

  const methodsOptions: any[] = [
    { label: `ALL\t\t      \tTất cả`, value: '' },
    ...paymentMethods.map((method) => ({
      ...method,
      label: `${method.id}\t\t      \t${method.name}`,
      value: method.payCode,
    })),
  ];

  const {
    control,
    clearErrors,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<PayloadRevenueMCFilterType>({
    shouldFocusError: false,
    reValidateMode: 'onSubmit',
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(7, 'day').startOf('date').toISOString(),
        to: dayjs().endOf('date').toISOString(),
      },
    },
  });

  const handleSubmitSearchForm: SubmitHandler<PayloadRevenueMCFilterType> = (data, e) => {
    e?.preventDefault();
    if (loading) return;
    const formatData = clearFalsyObject(data);

    formatData?.merchantId === -1 && delete formatData.merchantId;

    handleReplaceUrl(formatData, router);
    onSubmitForm && onSubmitForm(formatData);
  };

  function compare(a: any, b: any) {
    return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
  }

  useEffect(() => {
    const params = { ...router.query };

    delete params.to;
    delete params.from;
    delete params.merchantId;

    const filter: PayloadRevenueMCFilterType = clearFalsyObject({
      ...params,
      ...(router?.query?.merchantId ? { merchantId: +(router?.query?.merchantId as string) } : {}),
      createdAt: {
        from: router.query?.from
          ? (router.query?.from as string)
          : dayjs().subtract(7, 'day').startOf('date').toISOString(),
        to: router.query?.to ? (router.query?.to as string) : dayjs().endOf('date').toISOString(),
      },
    });

    reset(filter, { keepDefaultValues: true });
  }, []);

  return (
    <div className='revenue-statistics__box-search'>
      <form onSubmit={handleSubmit(handleSubmitSearchForm)}>
        <div className='form-group form-search'>
          {/* <label>{t('Danh sách Merchant')}</label> */}
          <AsyncSelect
            asyncType='MERCHANT'
            control={control}
            clearError={clearErrors}
            name='merchantId'
            keyReturn='merchantId'
            placeHolder='Nhập để tìm kiếm'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </div>
        <div className='form-group form-method'>
          {/* <label>{t('Phương thức thanh toán')}</label> */}
          <Controller
            control={control}
            name='method'
            render={({ field }) => {
              return (
                <ReactSelect
                  value={methodsOptions.find((method) => method.value === field.value) || null}
                  options={methodsOptions.sort(compare)}
                  onChange={(newValue: SingleValue<PaymentMethodSelect>) => {
                    field.onChange(newValue?.value);
                  }}
                  isClearable
                  placeholder='Phương thức thanh toán'
                  className='search-method-select search-merchant-select'
                  classNamePrefix='payment-method-select'
                />
              );
            }}
          />
        </div>
        <div className='form-group form-date'>
          {/* <label>{t('Thời gian')}</label> */}
          <DatePicker
            clearErrors={clearErrors}
            className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
            rules={{ from: { required: true }, to: { required: true } }}
            placeholder={'DD/MM/YYYY HH:mm:ss'}
            control={control}
          />
        </div>

        <div className='form-btn'>
          <button
            className='btn btn-primary btn-search'
            disabled={loading}
            style={{ minWidth: '130px' }}>
            {loading ? (
              <i className='fas fa-spinner fa-pulse'></i>
            ) : (
              <>
                <i className='fas fa-clipboard-list'></i>
                {t('Thống kê')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoxSearchRevenueStatistics;
