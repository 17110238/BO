import React, { useEffect, useMemo, useState } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form';
import { MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import { useSelector } from 'react-redux';
import { ProcessingFlowState } from 'models';
interface Props {
  submitForm: boolean;
  handleSubmitSearch?: (a: SearchParams) => void;
  handleClearForm?: () => void;
  setSubmitForm: (a: boolean) => void;
  isShowFilter: boolean;
}

export interface SearchParams {
  eventName?: string;
}

export default function BoxSearchProcessingFlow({
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  setSubmitForm,
  isShowFilter,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const query = router.query;
  const stringifyQuery = JSON.stringify(query);
  const isLoading = useSelector<any, boolean>(
    (state) => state?.processingFlowReducer.loading
  );
  const defaultValue = {
    eventName: '',
  };
  const [initialValue, setInitialValue] = useState<any>({});
  const { register, getValues, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });
  const [countSubmit, setCountSubmit] = useState<number>(0);

  const onSubmit: SubmitHandler<SearchParams> = (data, e) => {
    e?.preventDefault();
    setCountSubmit(countSubmit => ++countSubmit);

    router.replace(`quan-ly-quy-trinh-duyet?${convertToQueryString(data)}`, undefined, {
      shallow: true,
    });
    handleSubmitSearch && handleSubmitSearch(data);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('quan-ly-quy-trinh-duyet', undefined, { shallow: true });
    setInitialValue(defaultValue);
    if (countSubmit || !_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
    }
  };

  useEffect(() => {
    // reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
      setInitialValue(defaultValue);
    }

    if (!_.isEmpty(query)) {
      setCountSubmit(countSubmit => ++countSubmit);
      handleSubmitSearch && handleSubmitSearch({ ...query });
      setInitialValue({ ...query });
    }
  }, [query]);

  return (
    <>
      {
        isShowFilter &&
        <div className='box-search-pending-list'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group as={Col} className='mb-2' xl='3' md='4' sm='6'>
              <Form.Control
                type='text'
                placeholder={t('Enter eventName')}
                autoComplete='off'
                {...register('eventName')}
              />
            </Form.Group>
            <div className='d-flex ml-3 mb-2 search-button-group'>
              <button className='btn btn-primary btn-search' disabled={isLoading}>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
              </button>

              <button className='btn-clear' disabled={isLoading}>
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
