import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerBackUp';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
dayjs.extend(utc);

interface Props {
  handleFilter: (data: any) => void;
  isLoading: boolean;
}

const BoxSearchTopTransfer: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const query: any = router.query;
  const defaultValue = {
    createdAt: {
      from: dayjs().date(1).startOf('date').toISOString(),
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
    <Form onSubmit={handleSubmit(searchSubmit)} className='d-flex p-3 box-search-container'>
      <div className='form-group form-date' style={{ zIndex: '100' }}>
        <div className='date-picker-custom'>
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
        </div>
      </div>
      <div className='d-flex align-items-center'>
        <button type='submit' disabled={isLoading} className='btn btn-primary btn-search'>
          <i className='fas fa-search'></i>
          {t('Tìm kiếm')}
        </button>

        <button
          type='button'
          disabled={isLoading}
          onClick={() => {
            reset(defaultValue);
            router.replace('/cong-thanh-toan/giao-dich-nhieu-nhat', undefined, { shallow: true });
          }}
          className='ml-2 btn btn-clear'>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </Form>
  );
};

export default BoxSearchTopTransfer;
