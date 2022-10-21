import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import i18next from 'i18next';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
dayjs.extend(utc);


export interface SearchParams {
  search?: string | string[];
  method?: string | null;
  state?: string | string[] | any;
  createdAt?: {
    from?: any;
    to?: any;
  };
  merchantId?: number | number[];
  company?: string | string[] | any;
}
interface BoxSearchMultitransferCampaignProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  filter: any;
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

export default function BoxSearchMultitransferCampaign({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  onChangeDateSearch,
  valuesSearch,
  paymentMethodList,
  setSubmitForm,
  filter,
}: BoxSearchMultitransferCampaignProps) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const query = router.query;
  const stringifyQuery = JSON.stringify(query);
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const [initialValue, setInitialValue] = useState<any>({});

  const { register, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const convertedPaymentMethodList: any = paymentMethodList?.filter(
    (method: any) => method.payCode
  );
  const transactionMethod = [
    {
      payCode: '',
      name: 'ALL',
    },
    ...convertedPaymentMethodList,
  ];

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();

    const convertedData = removeEmpty(data);
    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));

    if (convertToQueryString(spreadCreatedAt) === '') {
      router.replace(`transaction-manage?unlimited=true`, undefined, { shallow: true });
      setInitialValue({});
      handleSubmitSearch && handleSubmitSearch({});
    } else {
      router.replace(`transaction-manage?${convertToQueryString(spreadCreatedAt)}`, undefined, {
        shallow: true,
      });
      handleSubmitSearch && handleSubmitSearch(convertedData);
    }
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('/transaction-manage', undefined, { shallow: true });
    setInitialValue(defaultValue);
    handleSubmitSearch && handleSubmitSearch(defaultValue);
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
      setInitialValue(defaultValue);
    }

    if (_.has(query, 'unlimited')) {
      handleSubmitSearch && handleSubmitSearch({});
      setInitialValue({});

      return;
    }

    if (_.has(query, 'merchantId')) {
      handleSubmitSearch && handleSubmitSearch({
        merchantId: +query.merchantId!
      });
      setInitialValue({
        search: query.merchantId
      });
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

      handleSubmitSearch && handleSubmitSearch(result);
      setInitialValue(result);
    }
  }, [submitForm, stringifyQuery]);

  const transactionStateOptions = transactionState.map((value) => ({
    value: value === 'ALL' ? '' : value,
    label: t(`${value}`),
  }));

  const transactionMethodOptions = transactionMethod.map((item) => ({
    value: item.payCode,
    label: t(`${item.name}`),
  }));

  return (
    <div className='box-search-multitransfer-campaign'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} xl='2' sm='3'>
          <Form.Label>{t('Tìm kiếm')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('Tìm kiếm')}
            autoComplete='off'
            {...register('search')}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state' xl='2' md='6' sm='4'>
          <Form.Label>{t('Công ty')}</Form.Label>
          <Controller
            control={control}
            name={'company'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
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
                options={transactionStateOptions}
                value={transactionStateOptions.find((val) => {
                  if (typeof value === 'object') return val.value === '';
                  else {
                    return val.value === value;
                  }
                })}
                placeholder=''
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <div className='d-flex align-items-center mt-md-2 ml-3 search-button-group'>
          <button className='btn btn-primary btn-search'>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>

          <div className='btn-clear' onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </Form>
    </div>
  );
}
