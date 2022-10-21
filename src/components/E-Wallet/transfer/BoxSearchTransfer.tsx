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
dayjs.extend(utc);

export interface SearchParams {
  txtSearch?: string | string[];
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

export default function BoxSearchMultitransferCampaign({
  handleSubmitSearch,
  submitForm = false,
  setSubmitForm,
  showFilter,
  isLoading,
}: BoxSearchMultitransferCampaignProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [countSubmit, setCountSubmit] = useState<number>(0);
  const query = router.query;
  const defaultValue = {

  };
  const [initialValue, setInitialValue] = useState<any>({});

  const { register, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    setCountSubmit(countSubmit => ++countSubmit);
    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));

    router.replace(`chuyen-vi?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('chuyen-vi', undefined, { shallow: true });
    setInitialValue(defaultValue);
    if (countSubmit || !_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
    }
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      if (handleSubmitSearch) {
        handleSubmitSearch(defaultValue);
      }
      setInitialValue(defaultValue);

      return;
    }

    if (!_.isEmpty(query)) {
      setCountSubmit(countSubmit => ++countSubmit);
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
  }, [query]);

  return (
    <>
      {
        showFilter &&
        <div className='box-search-multitransfer-campaign'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group as={Col} xl='2' sm='3'>
              <Form.Control
                type='text'
                placeholder={t('Tìm kiếm')}
                autoComplete='off'
                {...register('txtSearch')}
              />
            </Form.Group>
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
