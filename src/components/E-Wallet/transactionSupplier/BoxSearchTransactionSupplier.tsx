import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { SupplierTransSearchTypeEnum, SupplierTransServiceEnum } from 'models';
dayjs.extend(utc);

export interface SearchParams {
  searchValue?: string | string[];
  searchType?: string | string[] | any;
  service?: string | null;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchMultitransferCampaignProps {
  showFilter: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  filter: any;
  isLoading: boolean;
}

const getSearchTypeOptions = (service: string | string[]) => {
  let result = [];

  switch (service) {
    case 'BILL_SSCC':
      result = ['TRANSACTION', 'SSCC_ID', 'PHONE'];
      break;
    case 'BILL_OCB':
    case 'BILL_ESTIO':
      result = [
        'TRANSACTION',
        'TRANSACTION_TYPE',
        'PHONE',
        'CUSTOMER_ID',
        'CUSTOMER_NAME',
        'BANK_TRANSACTION',
        'SUPPLIER_CODE',
      ];
      break;
    case 'BS_WITHDRAW':
      result = ['TRANSACTION', 'PHONE', 'BANK_TRANSACTION', 'BANK_ACCOUNT'];
      break;
    case 'GATE_CARD':
      result = ['TRANSACTION', 'PHONE', 'SERIAL', 'SUPPLIER'];
      break;
    case 'GATE_TOPUP':
      result = ['TRANSACTION', 'PHONE', 'SUPPLIER'];
      break;
    case 'NAPAS':
    case 'PVCOMBANK':
      result = ['TRANSACTION', 'PHONE', 'BANK_ACCOUNT'];
      break;
    case 'OCBBANK':
    case 'BIDVBANK':
      result = ['TRANSACTION', 'BANK_TRANSACTION', 'BANK_ACCOUNT'];
      break;
    default:
      return [];
  }

  return result;
};

export default function BoxSearchMultitransferCampaign({
  handleSubmitSearch,
  showFilter,
  isLoading,
}: BoxSearchMultitransferCampaignProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [countSubmit, setCountSubmit] = useState<number>(0);
  const query = router.query;
  const [initialValue, setInitialValue] = useState<any>({});
  const { register, control, handleSubmit, reset, getValues, setValue, watch } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const [searchTypeList, setSearchTypeList] = useState<any[]>([]);

  const serviceOptions = [...Object.values(SupplierTransServiceEnum)].map((value) => ({
    value,
    label: t(`${value}`),
  }));

  const searchTypeOptions = searchTypeList?.map((value) => ({
    value,
    label: t(`${value}`),
  }));

  const defaultValue = {
    service: 'GATE_CARD',
    searchType: 'TRANSACTION',
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    // setCountSubmit(countSubmit => ++countSubmit);
    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));

    router.replace(`giao-dich-nha-cung-cap?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(
      `giao-dich-nha-cung-cap?service=${getValues('service')}&searchType=${searchTypeOptions[0]?.value
      }`,
      undefined,
      { shallow: true }
    );
    setInitialValue({
      ...defaultValue,
      service: getValues('service'),
      searchType: searchTypeOptions[0],
    });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      // if (handleSubmitSearch && countSubmit) {
      //   handleSubmitSearch(defaultValue);
      // }
      handleSubmitSearch && handleSubmitSearch(defaultValue);
      setSearchTypeList([...getSearchTypeOptions(defaultValue.service!)]);
      setValue('searchType', searchTypeOptions[0]?.value);
      setInitialValue(defaultValue);

      return;
    }

    if (_.has(query, 'unlimited')) {
      handleSubmitSearch && handleSubmitSearch({});
      setInitialValue({});

      return;
    }

    if (!_.isEmpty(query)) {
      const convertedQueryObj = _.omit(
        {
          ...query,
          createdAt: {
            from: query?.from,
            to: query?.to,
          },
        },
        ['from', 'to']
      );

      const result = removeEmpty(convertedQueryObj);
      if (query.service) {
        setSearchTypeList([...getSearchTypeOptions(query.service!)]);
        setValue('searchType', searchTypeOptions[0]?.value);
      }

      handleSubmitSearch && handleSubmitSearch(result);
      setInitialValue(result);
    }
  }, [query]);

  return (
    <>
      {showFilter && (
        <div className='box-search-multitransfer-campaign'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group as={Col} className='form-MC-state' xl='3' sm='4' md='6'>
              <Controller
                control={control}
                name={'service'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    defaultValue={{ value: 'GATE_CARD', label: t('GATE_CARD') }}
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
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
                    options={serviceOptions}
                    value={serviceOptions.find((val) => val.value === value)}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value);
                      setSearchTypeList([...getSearchTypeOptions(e.value)]);
                      setValue('searchType', searchTypeOptions[0]?.value);
                      router.replace(
                        `giao-dich-nha-cung-cap?service=${e.value}&searchType=${searchTypeOptions[0]?.value}`,
                        undefined,
                        {
                          shallow: true,
                        }
                      );
                    }}
                  />
                )}
              />
            </Form.Group>
            <Form.Group as={Col} className='form-MC-state' xl='2' sm='4' md='6'>
              <Form.Control
                type='text'
                placeholder={`Tìm kiếm ${t(watch('searchType')) ?? ''}`}
                autoComplete='off'
                {...register('searchValue')}
              />
            </Form.Group>
            {getValues('service') && (
              <Form.Group as={Col} className='form-MC-state' xl='2'>
                <Controller
                  control={control}
                  name={'searchType'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      defaultValue={searchTypeOptions[0]}
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
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
                      value={searchTypeOptions.find((val) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>
            )}
            <div className='form-group ml-3 form-date'>
              <div className='date-picker-custom'>
                <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
              </div>
            </div>
            <div className='d-flex ml-3 search-button-group'>
              <button className='btn btn-primary btn-search' disabled={isLoading}>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
              </button>

              <button className='btn btn-clear' disabled={isLoading}>
                <div onClick={onClearForm}>
                  <i className='fas fa-eraser mr-2'></i>
                  {t('Clear')}
                </div>
              </button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}
