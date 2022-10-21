import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { FilterListEwalletBankTransaction } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import { gatewayTypeState, searchType, transactionTypeState } from './utils/constantOptionSelect';
interface Props {
  loading?: boolean;
  handleSubmitSearch?: (a: FilterListEwalletBankTransaction) => void;
  handleClearForm?: () => void;
}

interface UserBoSelectType {
  label: string;
  value: number | null;
}

export default function BoxSearchMerchant({ loading, handleSubmitSearch, handleClearForm }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();

  const initFilter: FilterListEwalletBankTransaction = {
    transactionType: 'TOPUP',
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('date').toISOString(),
      to: dayjs().endOf('date').toISOString(),
    },
  };

  const {
    register,
    formState: { errors },
    clearErrors,
    control,
    handleSubmit,
    reset,
  } = useForm<FilterListEwalletBankTransaction>({
    defaultValues: initFilter,
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const onSubmit: SubmitHandler<FilterListEwalletBankTransaction> = (data, e) => {
    e?.preventDefault();

    if (loading) return;

    const formatData = clearFalsyObject(data);

    !formatData?.txtSearch && delete formatData.typeSearch;

    handleReplaceUrl(formatData, router);
    handleSubmitSearch && handleSubmitSearch(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (loading) return;

    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    handleClearForm && handleClearForm();
    handleSubmitSearch && handleSubmitSearch(initFilter);
  };

  // list option mechant state
  useEffect(() => {
    const params = { ...router.query };

    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const filter: FilterListEwalletBankTransaction = clearFalsyObject({
      ...params,
      createdAt: {
        from: (router.query?.from as string) ?? initFilter.createdAt?.from,
        to: (router.query?.to as string) ?? initFilter.createdAt?.from,
      },
    });

    reset(filter, { keepDefaultValues: true });
  }, []);

  const transactionTypeStateOption = transactionTypeState.map((value) => ({
    value: value,
    label: value === '' ? 'Tất cả loại giao dịch' : t(`BANK_${value}`),
  }));

  const gatewayTypeStateOptions = gatewayTypeState.map((value) => ({
    value: value,
    label: value === '' ? 'Tất cả cổng thanh toán' : value.toUpperCase(),
  }));

  const searchTypeOptions = searchType.map((value) => ({
    value: value === 'ALL' ? undefined : value,
    label: t(`BANK_${value.toUpperCase()}`),
  }));

  return (
    <div className='box-search-approval-merchant ewallet-bank-transaction__box-search'>
      <Form onSubmit={handleSubmit(onSubmit)} className='mb-3'>
        <Form.Group as={Col} className='form-search'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <div className='groups-inputs-search-type'>
            <Form.Control
              type='text'
              placeholder={t('Nhập để tìm kiếm')}
              autoComplete='off'
              {...register('txtSearch')}
            />
            <Controller
              control={control}
              name={'typeSearch'}
              defaultValue={'phone'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={customStyles}
                  className='form-control-type'
                  classNamePrefix='form-control-select'
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  isSearchable={false}
                  noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                  options={searchTypeOptions}
                  value={searchTypeOptions.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Loại giao dịch')}</Form.Label> */}
          <Controller
            control={control}
            name={'transactionType'}
            defaultValue={'TOPUP'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                isSearchable={false}
                styles={customStyles}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={transactionTypeStateOption}
                value={transactionTypeStateOption.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Cổng thanh toán')}</Form.Label> */}
          <Controller
            control={control}
            name={'gateway'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                isSearchable={false}
                styles={customStyles}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={gatewayTypeStateOptions}
                value={gatewayTypeStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='form-group form-date'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <DatePickerCustomV2
            clearErrors={clearErrors}
            className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
            rules={{ from: { required: true }, to: { required: true } }}
            placeholder={'DD/MM/YYYY HH:mm'}
            control={control}
          />
        </div>
        <div className='d-flex align-items-center search-button-group'>
          <button
            className='btn btn-primary btn-search'
            style={{ minWidth: '130px' }}
            disabled={loading}>
            {loading ? (
              <i className='fas fa-spinner fa-pulse'></i>
            ) : (
              <>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
              </>
            )}
          </button>
          <div className={`btn btn-clear ${loading && 'btn--disabled'}`} onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </Form>
    </div>
  );
}
