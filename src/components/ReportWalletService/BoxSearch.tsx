import dayjs from 'dayjs';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import utc from 'dayjs/plugin/utc';
import { useDispatch } from 'react-redux';
import { getAppInfo, getEwalletEnumServicesAction } from 'redux/actions';
import _ from 'lodash';
import { useRouter } from 'next/router';

dayjs.extend(utc);

interface Props {
  handleFilter: (data: any) => void;
  loading: boolean;
}

const ReportWalletServiceBoxSearch: FC<Props> = ({ handleFilter, loading }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const defaultValue = {
    name: 'SOCIAL_PAYMENT',
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const router = useRouter();
  const { query }: any = router;
  const [optionsApplication, setDataApplication] = useState<any>([]);
  const [optionsServices, setOptionsServices] = useState<any>();
  const [initValue, setInitValue] = useState<any>();
  const {
    reset,
    handleSubmit,
    control,
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
    const filter = {
      createdAt: {
        from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    };

    dispatch(
      getEwalletEnumServicesAction({ filter }, (state, payload) => {
        if (state) {
          const { dataEnumServices } = payload;
          let optionDataServices = [
            ...dataEnumServices?.map((service: any) => ({
              value: service.key,
              label: service.value,
            })),
          ];
          setOptionsServices(optionDataServices);
        }
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getAppInfo((status, response) => {
        if (status) {
          const { store } = response[0];
          let optionDataApplication = [
            { value: '', label: 'Tất cả App ID' },
            ...store?.map((el: any) => ({ value: el.id, label: el.name })),
          ];
          setDataApplication(optionDataApplication);
        }
      })
    );
  }, []);

  useEffect(() => {
    reset();
    reset(initValue);
  }, [initValue]);

  useEffect(() => {
    const _query = { ...query, appId: parseInt(query.appId) };
    const queryValue = _.chain(_query)
      .assign({ createdAt: { from: query.from, to: query.to } })
      .omit(['from', 'to'])
      .value();
    if (_.isEmpty(query)) {
      handleFilter && handleFilter(defaultValue);
      setInitValue(defaultValue);
      return;
    }
    setInitValue(queryValue);
    handleFilter(queryValue);
  }, [query]);

  const onSubmit = (data: any) => {
    const queryParams = {
      ...data,
      from: data.createdAt.from,
      to: data.createdAt.to,
    };
    delete queryParams.createdAt;
    if (queryParams.from && queryParams.to) {
      router.push({ query: { ...queryParams } });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='box-search-container'>
      <div className='form-group mb-3'>
        <Controller
          control={control}
          name='name'
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
              options={optionsServices}
              value={
                optionsServices?.find((val: any) => {
                  return val.value === value;
                }) || ' '
              }
              placeholder='Tên dịch vụ'
              noOptionsMessage={() => {
                return t('Không có kết quả tìm kiếm');
              }}
              onChange={(e: SingleValue<any>) => onChange(e.value)}
            />
          )}
        />
      </div>
      <div className='form-group mb-3'>
        <Controller
          control={control}
          name={'appId'}
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
              options={optionsApplication}
              value={
                optionsApplication?.find((val: any) => {
                  return val.value === value;
                }) || ' '
              }
              placeholder={'App ID'}
              noOptionsMessage={() => {
                return t('Không có kết quả tìm kiếm');
              }}
              onChange={(e: SingleValue<any>) => onChange(e.value)}
            />
          )}
        />
      </div>
      <div className='form-group mb-3 form-date'>
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
      <div className='d-flex align-items-center mb-3'>
        <button style={{ marginTop: 0 }} className='btn btn-primary btn-search' disabled={loading}>
          <i className='fas fa-analytics'></i>
          <p style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>{t('Thống kê')}</p>
        </button>
        <button
          className='btn btn-clear ml-2'
          type='button'
          style={{ marginTop: 0 }}
          onClick={() => {
            reset(defaultValue);
            router.replace('/vi-dien-tu/thong-ke-vi/dich-vu-vi', undefined, { shallow: true });
          }}
          disabled={loading}>
          <i className='fas fa-eraser mr-2'></i>
          {t('Clear')}
        </button>
      </div>
    </Form>
  );
};

export default ReportWalletServiceBoxSearch;
