import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import i18next from 'i18next';
import {
  MerchantState,
  ProcessingFlowResponse
} from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import _ from 'lodash';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const pendingMerchantState = [
  'ALL',
  'PENDING',
  'REJECTED',
  'APPROVED',
  'FAILED',
];
interface Props {
  submitForm: boolean;
  handleSubmitSearch?: (a: SearchParams) => void;
  handleClearForm?: () => void;
  pendingList: ProcessingFlowResponse[];
  setSubmitForm: (a: boolean) => void;
  isShowFilter: boolean;
  isLoading: boolean
}

export interface SearchParams {
  requestId?: number | number[];
  targetCode?: string | string[];
  code?: string | null;
  state?: string | string[] | any;
  createdAt?: {
    from?: any;
    to?: any;
  };
}

export default function BoxSearchMerchant({
  handleSubmitSearch,
  pendingList,
  isShowFilter,
  isLoading,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const query = router.query;
  const defaultValue = {
    state: 'PENDING'
  }
  const [initialValue, setInitialValue] = useState<any>({});
  const { register, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const eventNameList = [
    {
      eventId: '',
      eventName: 'Chọn nội dung yêu cầu'
    },
    ...pendingList
  ];
  const [countSubmit, setCountSubmit] = useState<number>(0);

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    setCountSubmit(countSubmit => ++countSubmit);

    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };

    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));

    if (convertToQueryString(spreadCreatedAt) === '') {
      router.replace(`danh-sach-cho-duyet?state=ALL`, undefined, { shallow: true });
      setInitialValue({})
    } else {
      router.replace(`danh-sach-cho-duyet?${convertToQueryString(spreadCreatedAt)}`, undefined, { shallow: true });
    }
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('danh-sach-cho-duyet', undefined, { shallow: true });
    setInitialValue(defaultValue);
    if (countSubmit || !_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
    }
  }

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
      setInitialValue(defaultValue)
    }

    if (query.state === 'ALL') {
      handleSubmitSearch && handleSubmitSearch({});
      setInitialValue({})
      return;
    }

    if (_.has(query, 'requestId')) {
      handleSubmitSearch &&
        handleSubmitSearch({
          requestId: +query.requestId!,
        });

      return;
    }

    if (!_.isEmpty(query)) {
      setCountSubmit(countSubmit => ++countSubmit);
      const convertedQueryObj = _.omit({
        ...query,
        createdAt: {
          from: query?.from,
          to: query?.to,
        },
      }, ['from', 'to']);
      let result = removeEmpty(convertedQueryObj);
      if (convertedQueryObj?.createdAt?.from && !convertedQueryObj?.createdAt.to) {
        result = {
          ...result, 
          createdAt: {
            from: convertedQueryObj.createdAt.from,
            to: dayjs().endOf('date').utc().format(),
          }
        }
      }

      handleSubmitSearch && handleSubmitSearch(result);
      setInitialValue(result);
    }
  }, [query]);

  const pendingMerchantStateOptions = pendingMerchantState.map((value) => (
    value === 'PENDING' ? {
      value: value,
      label: t(`${value}_APPROVE`)
    }
      :
      {
        value: value === 'ALL' ? '' : value,
        label: t(`${value}_PENDING_LIST`),
      }
  ));
  const pendingMerchantEventNameOptions = eventNameList.map((item) => ({
    value: item.eventId,
    label: t(`${item.eventName}`),
  }));

  return (
    <>
      {
        isShowFilter &&
        <div className='box-search-pending-list'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group as={Col} className='mb-2' xl='2' md='6' sm='12'>
              <Form.Control
                type='text'
                placeholder={t('Enter merchant Id')}
                autoComplete='off'
                {...register('targetCode')}
              />
            </Form.Group>
            <Form.Group as={Col} xl='2' md='3' sm='6'>
              <Controller
                control={control}
                name={'state'}
                defaultValue={''}
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
                    styles={customStyles}
                    placeholder=''
                    options={pendingMerchantStateOptions}
                    value={pendingMerchantStateOptions.find((val) => val.value === value)}
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                    }}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group as={Col} md='3' sm='6'>
              <Controller
                control={control}
                name={'code'}
                defaultValue={''}
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
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                    }}
                    styles={customStyles}
                    placeholder={t('Select...')}
                    value={pendingMerchantEventNameOptions.find((c) => c.value === value)}
                    options={pendingMerchantEventNameOptions}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <div className='form-group ml-3'>
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
      }
    </>
  );
}
