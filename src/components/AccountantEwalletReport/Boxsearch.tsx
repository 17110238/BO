import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface Props {
  handleFilter: (data: any) => void;
  isLoading: boolean;
}

const BoxSearchEwalletReport: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query }: any = router;
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const [initValue, setInitValue] = useState<any>({});
  const { control, reset, handleSubmit } = useForm({
    defaultValues: useMemo(() => {
      return initValue;
    }, [initValue]),
  });

  useEffect(() => {
    setInitValue(defaultValue);
  }, []);

  useEffect(() => {
    reset(initValue);
    handleFilter(initValue);
  }, [initValue]);

  useEffect(() => {
    if (query.from && query.to) {
      setInitValue({ createdAt: { ...query } });
    } else {
      setInitValue(defaultValue);
    }
  }, [query]);

  const searchSubmit = (data: any) => {
    const { createdAt } = data;
    if (!createdAt.from || !createdAt.to || !dayjs(createdAt.from).isBefore(dayjs(createdAt.to))) {
      setInitValue({ ...initValue });
      router.push({
        query: { ...defaultValue.createdAt },
      });
      return;
    }
    router.push({
      query: { ...createdAt },
    });
  };

  return (
    <Form onSubmit={handleSubmit(searchSubmit)} className='box-search-container'>
      <div className='form-group mb-3 form-date'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
        </div>
      </div>
      <div className='d-flex align-items-center mb-3'>
        <button
          type='submit'
          disabled={isLoading}
          style={{ marginTop: 0 }}
          className='btn btn-primary btn-search'>
          <i className='fas fa-search'></i>
          {t('Tìm kiếm')}
        </button>

        <button
          type='button'
          disabled={isLoading}
          onClick={() => {
            reset(defaultValue);
            router.replace('/vi-dien-tu/tai-khoan/vi-dien-tu/bao-cao', undefined, {
              shallow: true,
            });
          }}
          className='btn-clear ml-2'>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </Form>
  );
};

export default BoxSearchEwalletReport;
