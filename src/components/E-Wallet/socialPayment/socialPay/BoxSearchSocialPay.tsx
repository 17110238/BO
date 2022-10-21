import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import {
  FilterEwalletReportSocialPayment,
  stateMcEnum,
  TypeSearchEWalletSocialPaymentEnum,
} from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import { searchType, transactionState, transactionTypeState } from './utils/constantOptionSelect';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
interface Props {
  loading?: boolean;
  handleSubmitSearch?: (a: FilterEwalletReportSocialPayment) => void;
  handleClearForm?: () => void;
}

interface UserBoSelectType {
  label: string;
  value: number | null;
}

export default function BoxSearchMerchant({ loading, handleSubmitSearch, handleClearForm }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const initValueForm = useMemo(
    () => ({
      createdAt: {
        from: dayjs().subtract(30, 'day').startOf('date').toISOString(),
        to: dayjs().endOf('date').toISOString(),
      },
    }),
    []
  );
  const {
    register,
    clearErrors,
    formState: { errors },
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<FilterEwalletReportSocialPayment>({
    defaultValues: initValueForm,
    reValidateMode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<FilterEwalletReportSocialPayment> = (data, e) => {
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
    handleSubmitSearch && handleSubmitSearch(initValueForm);
  };

  const transactionTypeStateOption = transactionTypeState.map((value) => ({
    value: value === 'ALL' ? undefined : value,
    label: value === 'ALL' ? 'Tất cả trạng thái' : t(value),
  }));

  const transactionStateOptions = transactionState.map((value) => ({
    value: value === 'ALL' ? undefined : value,
    label: value === 'ALL' ? 'Tất cả hình thức' : t(`SOCIAL_${value}`),
  }));

  const searchTypeOptions = searchType.map((value) => ({
    value: value.toUpperCase(),
    label: t(`SOCIAL_${value.toUpperCase()}`),
  }));

  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;

    delete params.to;
    delete params.from;

    const filter: any = clearFalsyObject({
      ...params,
      createdAt: {
        from: (router.query?.from as string) ?? initValueForm.createdAt.from,
        to: (router.query?.to as string) ?? initValueForm.createdAt.to,
      },
    });

    reset(filter, { keepDefaultValues: true });
  }, []);

  return (
    <div className='socialpay-container__box-search box-search-approval-merchant'>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
              defaultValue={TypeSearchEWalletSocialPaymentEnum.TOKEN_LINK}
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
          {/* <Form.Label>{t('Hình thức duyệt')}</Form.Label> */}
          <Controller
            control={control}
            name={'type'}
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
                placeholder={'Tất cả hình thức'}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={transactionStateOptions}
                value={transactionStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='form-MC-state'>
          {/* <Form.Label>{t('Trạng Thái')}</Form.Label> */}
          <Controller
            control={control}
            name={'state'}
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
                placeholder={'Tất cả trạng thái'}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={transactionTypeStateOption}
                value={transactionTypeStateOption.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='form-group form-date'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
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
