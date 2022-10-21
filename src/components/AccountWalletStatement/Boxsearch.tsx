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
  handleFilter: () => void;
  isLoading: boolean;
}

const BoxSearchEwalletReport: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
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
    reset(defaultValue);
  }, []);

  const searchSubmit = (e: any) => {
    e.preventDefault();
    handleFilter();
  };

  return (
    <Form className='box-search-container'>
      <div className='form-group mb-3 form-date'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
        </div>
      </div>
      <div className='d-flex align-items-center mb-3'>
        <button
          onClick={searchSubmit}
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
