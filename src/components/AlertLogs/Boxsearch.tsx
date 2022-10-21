import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';

dayjs.extend(utc);

interface Props {
  handleFilter: (data: any) => void;
  isLoading: boolean;
}

const BoxSearchAlertLogs: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query }: any = router;
  const defaultValue = {
    tags: '',
    createdAt: {},
  };
  const [initValue, setInitValue] = useState<any>({});
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: useMemo(() => {
      return initValue;
    }, [initValue]),
  });

  useEffect(() => {
    reset();
    reset(initValue);
  }, [initValue]);

  useEffect(() => {
    const queryPayload = { tags: query.tags, createdAt: { from: query.from, to: query.to } };
    setInitValue(queryPayload);
    handleFilter(queryPayload);
  }, [query]);

  const searchSubmit = (data: any) => {
    if (data.tags || data.createdAt.from || data.createdAt.to) {
      router.push({
        query: {
          tags: data.tags,
          from: data.createdAt.from,
          to: data.createdAt.to,
        },
      });
    } else {
      router.replace('/vi-dien-tu/monitor/quan-li-logs', undefined, { shallow: true });
    }
  };

  return (
    <Form onSubmit={handleSubmit(searchSubmit)} className='box-search-container'>
      <Form.Control
        type='text'
        placeholder='Nhập tags cần tìm kiếm'
        autoComplete='off'
        className='mb-3 mr-md-2'
        {...register('tags')}
      />
      <div className='form-group mb-3 form-date'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
        </div>
      </div>
      <div className='d-flex align-items-center mb-3'>
        <button
          style={{ marginTop: 0 }}
          type='submit'
          className='btn btn-primary btn-search'
          disabled={isLoading}>
          <i className='fas fa-search'></i>
          {t('Tìm kiếm')}
        </button>

        <button
          type='button'
          className='btn-clear ml-2'
          onClick={() => {
            reset(defaultValue);
            router.replace('/vi-dien-tu/monitor/quan-li-logs', undefined, { shallow: true });
          }}
          disabled={isLoading}>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </Form>
  );
};

export default BoxSearchAlertLogs;
