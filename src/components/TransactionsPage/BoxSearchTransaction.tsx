import AsyncSelectMCAMuti from 'components/Accountant/SearchAccountBalance/AsyncSelectMulti';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import DatePickerCustomV3 from 'components/common/DatePickerCustom/DatePickerV3';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import i18next from 'i18next';
import {
  pickBy,
  omit,
  isEmpty,
  has
} from 'lodash';
import {
  PaymentMethodFullType,
  SearchTypeEnum, TransactionState
} from 'models';
import { UserBo } from 'models/user/accountMerchant';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
dayjs.extend(utc);

export interface SearchParams {
  search?: string | string[];
  searchType?: string | string[];
  operatorAccountId?: string;
  method?: string | null;
  state?: string | string[] | any;
  finishedAt?: {
    from?: any;
    to?: any;
  };
  supplierName?: string | string[];
  issuerName?: string | string[];
  merchantId?: number | number[];
  transactionType?: string | string[];
  excludedMerchant?: string | string[];
  crosscheckFee?: boolean | string;
  loading?: any;
}
interface BoxSearchTransactionProps {
  showFilter: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: PaymentMethodFullType | any;
  setSubmitForm: (a: boolean) => void;
  filter: any;
  saleMembers?: UserBo[];
  loading?: any;
}
interface OptionsProps {
  label?: any;
  value?: any;
}

const transactionState = [
  'ALL',
  'SUCCEEDED',
  'PENDING',
  'CANCELED',
  'FAILED',
  'EXPIRED',
  'REFUNDED',
  'CANCELED_SUCCEEDED',
  'RECEIVED',
  'USED',
  'ESCROW',
  'CLAIMED',
  'DENIED',
  'AUTHORIZED',
];

const transactionType = [
  'ALL',
  'PAYMENT',
  'TOPUP',
]

const transactionCrossCheck = [
  'ALL',
  'CROSSCHECK',
  'NO_CROSSCHECK',
]

const searchTypeList = [...Object.values(SearchTypeEnum)];

export default function BoxSearchTransaction({
  handleSubmitSearch,
  submitForm = false,
  paymentMethodList,
  filter,
  saleMembers,
  setSubmitForm,
  loading,
  showFilter,
}: BoxSearchTransactionProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isLoading = useSelector<any, TransactionState>((state) => state?.transactions.loading);

  const query: any = router.query;
  const defaultValue = {
    finishedAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const refSelect = useRef<any>();
  const excludedMerchantList = query.excludedMerchant ? query.excludedMerchant.split(',').map((mc: any) => Number(mc)) : [];
  const [initialValue, setInitialValue] = useState<any>({});
  const [defaultStateOptions, setDefaultStateOptions] = useState<[{ label?: string; value?: string }] | []>([]);

  const { register, control, handleSubmit, reset, getValues, setValue, clearErrors } =
    useForm<SearchParams>({
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    });

  const textBoxSearchPlaceHolder = !getValues('searchType') || getValues('searchType') === 'ALL_ID'
    ? t('Search transaction')
    : `T??m ki???m ${t(`${getValues('searchType')}`)}`;

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    if (!defaultStateOptions.length) {
      setDefaultStateOptions([
        {
          label: t('ALL'),
          value: '',
        },
      ]);
    }

    const convertedState =
      data?.state === ''
        ? []
        : defaultStateOptions
          ?.map((item: OptionsProps) => item.value)
          .filter((item: OptionsProps) => item !== '');
    const convertedExcludedMerchant = () => {
      const excludedMerchants = data.excludedMerchant;
      if (Array.isArray(data.excludedMerchant)) {
        return excludedMerchants.join()
      } else if (typeof excludedMerchants === 'string') {
        return excludedMerchants;
      } else {
        return null;
      }
    }

    data.state = convertedState?.join();
    data.excludedMerchant = convertedExcludedMerchant();

    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };

    const { search, searchType } = convertFilter || {};

    const spreadCreatedAt = search === '' && searchType === 'ALL_ID'
      ? removeEmpty(pickBy(omit(convertFilter, ['finishedAt', 'createdAt', 'searchType'])))
      : removeEmpty(pickBy(omit(convertFilter, ['finishedAt', 'createdAt'])));

    if (convertToQueryString(spreadCreatedAt) === '') {
      router.replace(`quan-ly-giao-dich?unlimited=true`, undefined, { shallow: true });
      setInitialValue({});
    } else {
      router.replace(`quan-ly-giao-dich?${convertToQueryString(spreadCreatedAt)}`, undefined, {
        shallow: true,
      });
    }
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDefaultStateOptions([]);
    router.replace('quan-ly-giao-dich', undefined, { shallow: true });
    setInitialValue(defaultValue);
    setValue('excludedMerchant', []);
    reset();
    handleSubmitSearch(defaultValue);
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEmpty(query)) {
      handleSubmitSearch(defaultValue);
      setInitialValue(omit({
        ...defaultValue,
        createdAt: defaultValue?.finishedAt,
      }, ['finishedAt']));

      return;
    }

    if (has(query, 'unlimited')) {
      handleSubmitSearch({});
      setInitialValue({});

      return;
    }

    if (has(query, 'merchantId')) {
      handleSubmitSearch({
        merchantId: +query.merchantId!,
      });
      setInitialValue({
        search: query.merchantId,
      });
      return;
    }

    if (!isEmpty(query)) {
      if (query?.state) {
        setDefaultStateOptions(
          query.state.split(',').map((item: any) => ({
            label: t(item),
            value: item,
          }))
        );
      }

      if (query.search && query.searchType === 'MERCHANT_ID') {
        setValue('search', query.search);
      }

      const convertedQueryObj = omit(
        {
          ...query,
          operatorAccountId: query?.operatorAccountId ? +query?.operatorAccountId! : undefined,
          finishedAt: {
            from: query?.from,
            to: query?.to,
          },
        },
        ['from', 'to']
      );
      const removeFalsyData = removeEmpty(convertedQueryObj);

      let result = {};

      // handle query state options - excluded merchant - crosscheck options
      if (query?.state && !query?.excludedMerchant) {
        result = {
          ...removeFalsyData,
          state: query.state.split(','),
        };
      } else if (query?.excludedMerchant && !query?.state) {
        result = {
          ...removeFalsyData,
          excludedMerchant: excludedMerchantList,
        };
      } else if (query?.state && query?.excludedMerchant) {
        result = {
          ...removeFalsyData,
          state: query.state.split(','),
          excludedMerchant: excludedMerchantList,
        };
      } else {
        result = {
          ...removeFalsyData,
        };
      }

      if (query?.crosscheckFee) { // check cross-check fee
        result = {
          ...result,
          crosscheckFee: query.crosscheckFee === 'true',
        }
      }
      // ----------------------------------------------------------

      handleSubmitSearch(result);
      setInitialValue(omit({
        ...result,
        crosscheckFee: convertedQueryObj?.crosscheckFee ?? '',
        createdAt: convertedQueryObj.finishedAt,
      }, ['finishedAt']));
    }
  }, [query]);

  const saleMemberOptions = saleMembers?.map((member) => {
    return {
      label: member.fullname,
      value: +member.accountId!,
    };
  });
  saleMemberOptions?.unshift({ label: 'Ch???n nh??n vi??n ph??t tri???n', value: + '' });

  const transactionStateOptions = transactionState.map((value) => ({
    value: value === 'ALL' ? '' : value,
    label: t(`${value}`),
  }));

  const transactionTypeOptions = transactionType.map((value) => ({
    value: value === 'ALL' ? '' : value,
    label: value === 'ALL' ? 'Ch???n lo???i giao d???ch' : t(`TRANSACTION_${value}`),
  }));

  const transactionCrossCheckFeeOptions = transactionCrossCheck.map((value) => ({
    value: value === 'ALL' ? '' : value === 'CROSSCHECK' ? 'true' : 'false',
    label: value === 'ALL' ? 'Ch???n ph?? ?????i so??t' : t(`TRANSACTION_${value}`),
  }))

  const searchTypeOptions = searchTypeList.map((value) => ({
    value: value,
    label: t(`${value}`),
  }));

  const transactionMethodOptions = paymentMethodList?.paymentMethod?.map((item: any) => ({
    value: item.payCode,
    label: t(`${item.name}`),
  }));
  transactionMethodOptions?.unshift({
    value: '',
    label: 'Ch???n PTTT',
  })

  const transactionSupplierOptions = paymentMethodList?.supplier?.map((item: any) => ({
    value: item,
    label: item,
  }));
  transactionSupplierOptions?.unshift({
    value: '',
    label: 'Ch???n NCC',
  })

  const transactionIssuerOptions = paymentMethodList?.issuer?.map((item: any) => ({
    value: item,
    label: item,
  }));
  transactionIssuerOptions?.unshift({
    value: '',
    label: 'Ch???n NPH',
  })

  return (
    <>
      {
        showFilter &&
        <div className='box-search-transaction'>
          <Form className="box-search-transaction-form" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="form-group-search">
              {getValues('searchType') !== 'MERCHANT_ID' ? (
                <Form.Control
                  type='text'
                  placeholder={textBoxSearchPlaceHolder}
                  autoComplete='off'
                  {...register('search')}
                />
              ) : (
                <AsyncSelect
                  asyncType='MERCHANT'
                  control={control}
                  clearError={clearErrors}
                  name='search'
                  keyReturn='merchantId'
                  {...{
                    className: 'search-merchant-select',
                    classNamePrefix: 'merchant-async-select',
                  }}
                />
              )}
            </Form.Group>
            <Form.Group>
              <Controller
                control={control}
                name={'searchType'}
                defaultValue={'ALL_ID'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={searchTypeOptions}
                    value={searchTypeOptions.find((val) => {
                      if (typeof value === 'object') return val.value === 'ALL_ID';
                      else {
                        return val.value === value;
                      }
                    })}
                    placeholder=''
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value);
                      setInitialValue({
                        ...getValues(),
                        searchType: e.value,
                      });
                    }}
                  />
                )}
              />
            </Form.Group>
            <div className='form-group form-date-transaction'>
              <div className='date-picker-custom'>
                <DatePickerCustomV3 placeholder={'DD/MM/YYYY HH:mm:ss'} control={control} />
              </div>
            </div>
            <Form.Group className='form-group-member'>
              <Controller
                control={control}
                name={'operatorAccountId'}
                defaultValue=''
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    theme={(theme: any) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    options={saleMemberOptions}
                    value={saleMemberOptions?.find((c) => c.value === +value!) || null}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group className='form-group-member'>
              <Controller
                control={control}
                name={'transactionType'}
                defaultValue=''
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    theme={(theme: any) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    options={transactionTypeOptions}
                    value={transactionTypeOptions?.find((state) => state.value === value) || null}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group className='form-group-member'>
              <Controller
                control={control}
                name={'crosscheckFee'}
                defaultValue=''
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    theme={(theme: any) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    options={transactionCrossCheckFeeOptions}
                    value={transactionCrossCheckFeeOptions?.find((state) => state.value === value) || null}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group className='form-MC-state'>
              <Controller
                control={control}
                name={'state'}
                key={new Date().getTime()}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    isMulti
                    className='select-input-form'
                    classNamePrefix='input-select'
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    options={transactionStateOptions}
                    defaultValue={defaultStateOptions}
                    placeholder='Tr???ng th??i thanh to??n'
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    onChange={(value: any) => {
                      onChange(value);
                      setDefaultStateOptions(value);
                    }}
                  />
                )}
              />
            </Form.Group>
            <Form.Group>
              {/* <Form.Label>{t('Payment method')}</Form.Label> */}
              <Controller
                control={control}
                name={'method'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    options={transactionMethodOptions}
                    value={transactionMethodOptions?.find((val: any) => val.value === value)}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group>
              <Controller
                control={control}
                name={'supplierName'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    options={transactionSupplierOptions}
                    value={transactionSupplierOptions?.find((val: any) => val.value === value)}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group>
              <Controller
                control={control}
                name={'issuerName'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 3 }),
                      menu: (provided) => ({ ...provided, zIndex: 3 }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Kh??ng c?? k???t qu??? t??m ki???m';
                    }}
                    options={transactionIssuerOptions}
                    value={transactionIssuerOptions?.find((val: any) => val.value === value)}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group className="form-group-merchant">
              <AsyncSelectMCAMuti
                data={excludedMerchantList}
                control={control}
                clearError={clearErrors}
                name='excludedMerchant'
                refSelect={refSelect}
                placeHolder='Ch???n merchant kh??ng export'
                {...{
                  className: 'search-merchant-select',
                  classNamePrefix: 'input-select',
                }}
              />
            </Form.Group>
            <div className='form-group d-flex align-items-center search-button-group'>
              <button className='btn btn-primary btn-search mt-0' type='submit' disabled={isLoading as any}>
                {t('T??m ki???m')}
              </button>

              <button className='btn btn-clear' disabled={isLoading as any}>
                <div onClick={onClearForm}>
                  <i className='fas fa-eraser mr-2'></i>
                  {t('Clear')}
                </div>
              </button>
            </div>
          </Form>
        </div>
      }
    </>
  );
}
