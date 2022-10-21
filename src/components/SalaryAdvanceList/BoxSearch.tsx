import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
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
    searchText: '',
    searchType: 'TRANSACTION',
    isReimbursed: '',
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const searchTypes = [
    { label: 'Mã giao dịch', value: 'TRANSACTION' },
    { label: 'Doanh nghiệp', value: 'ENTERPRISE' },
  ];
  const filterStates = [
    { label: 'Tất cả trạng thái', value: '' },
    { label: 'Đã hoàn ứng', value: 'isReimbursed' },
    { label: 'Chưa hoàn ứng', value: 'isNotReimbursed' },
  ];
  const [initValue, setInitValue] = useState<any>({});

  const {
    control,
    register,
    reset,
    handleSubmit,
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
    delete queryData.createdAt;
    router.push({ query: queryData });
  };

  return (
    <Form onSubmit={handleSubmit(searchSubmit)} className='d-flex p-3 box-search-container'>
      <div className='d-flex flex-wrap'>
        <div className='form-group mr-xl-1'>
          <Form.Control
            type='text'
            placeholder={t('Tìm kiếm')}
            autoComplete='off'
            {...register('searchText')}
          />
        </div>
        <div className='form-group'>
          <Controller
            control={control}
            name='searchType'
            defaultValue={'TRANSACTION'}
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
                options={searchTypes}
                value={
                  searchTypes?.find((val: any) => {
                    return val.value === value;
                  }) || ' '
                }
                placeholder='Loại tìm kiếm'
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </div>
      </div>
      <div className='form-group'>
        <Controller
          control={control}
          name='isReimbursed'
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
              options={filterStates}
              value={
                filterStates?.find((val: any) => {
                  return val.value === value;
                }) || ' '
              }
              placeholder='Trạng thái'
              noOptionsMessage={() => {
                return t('Không có kết quả tìm kiếm');
              }}
              onChange={(e: SingleValue<any>) => onChange(e.value)}
            />
          )}
        />
      </div>
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
            router.replace('/cong-thanh-toan/danh-sach-ung-luong', undefined, { shallow: true });
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
