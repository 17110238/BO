import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
dayjs.extend(utc);

interface Props {
  handleFilter: (data: any) => void;
  isLoading: boolean;
}

const BoxsearchSalaryAdvance: FC<Props> = ({ handleFilter, isLoading }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query }: any = router;
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };

  const [initValue, setInitValue] = useState<any>({});
  const {
    control,
    register,
    reset,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return initValue;
    }, [initValue]),
  });

  useEffect(() => {
    setInitValue(defaultValue);
  }, []);

  useEffect(() => {
    if (Object.keys(initValue).length > 0) {
      reset(initValue);
      handleFilter(initValue);
    }
  }, [initValue]);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      const queryParam = { ...query, createdAt: { from: query.from, to: query.to } };
      delete queryParam.from; // delete item from object
      delete queryParam.to;
      setInitValue(queryParam);
    }
  }, [query]);

  const searchSubmit = (data: any) => {
    const queryData = { ...data, from: data.createdAt.from, to: data.createdAt.to };
    !data.merchantId && delete queryData.merchantId;
    delete queryData.createdAt;
    router.push({ query: queryData });
  };

  return (
    <Form onSubmit={handleSubmit(searchSubmit)} className='d-flex p-3 box-search-container'>
      <Form.Group as={Col} className='form-MC-state' xl='3' md='4' sm='4'>
        <AsyncSelect
          asyncType='MERCHANT'
          control={control}
          clearError={clearErrors}
          name='merchantId'
          keyReturn='merchantId'
          initLabel=''
          placeHolder='Nhập để tìm Merchant'
          {...{
            className: 'search-merchant-select',
            classNamePrefix: 'merchant-async-select',
          }}
        />
      </Form.Group>
      <div className='form-group form-date'>
        <div className='date-picker-custom'>
          <DatePickerCustomV2
            rules={{ from: { required: true }, to: { required: true } }}
            className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '} ${
              errors?.createdAt?.to ? ' date-picker-to-error' : ' '
            }`}
            placeholder={'DD/MM/YYYY HH:mm'}
            control={control}
          />
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
            handleFilter(defaultValue);
            router.replace('/cong-thanh-toan/bao-cao-ung-luong', undefined, { shallow: true });
          }}
          className='ml-2 btn btn-clear'>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </Form>
  );
};

export default BoxsearchSalaryAdvance;
