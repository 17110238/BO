import { SubscriptionClient } from 'graphql-subscriptions-client';
import i18next, { t } from 'i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncSelectMC from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';

export interface SearchParams {
  search?: string;
  appId?: number;
  kycState?: string;
  gender?: string;
  from?: number;
  to?: number;
  fullname?: string;
  date?: string;
  yearFrom?: number;
  yearTo?: number;
  quaterFrom?: number;
  quaterTo?: number;
  monthFrom?: number;
  monthTo?: number;
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  boxSearchRef: any;
  filter: any;
  t: (a: string) => string;
  isLoading: boolean;
}

const itemState = ['ALL', 'COUNT', 'AVG', 'AMOUNT', 'USER_AMOUNT'];
const dateState = ['DATE', 'MONTH', 'QUATER', 'YEAR'];
const monthState = ['1', '2', '3', '4', '5', '6', '7', '8', ' 9', '10', '11', '12'];
const quaterState = ['1', '2', '3', '4'];
const getYearState = () => {
  const yearArray = [];
  for (let i = 2010; i <= new Date().getFullYear(); i++) {
    yearArray.push(i.toString());
  }
  return yearArray;
};
const yearState = [...getYearState()];

const BoxSearch: React.FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm,
  boxSearchRef,
  filter,
  isLoading,
  t,
}) => {
  const router = useRouter();
  const { query }: any = useRouter();
  const dispatch = useDispatch();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [selectTime, setSelectTime] = useState<string>('');
  const [socket, setSocket] = useState('');
  const client = new SubscriptionClient(socket, {
    reconnect: true,
    lazy: true, // only connect when there is a query
    connectionCallback: (error) => {
      error && console.error(error);
    },
  });

  useEffect(() => {
    let socket = new WebSocket(`${process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS}/graphql`);
    setSocket(socket.url);
  }, []);

  const schema = yup
    .object({
      from: yup.number().required(),
      to: yup.number().required(),
    })
    .required();

  const noValidateSchema = yup.object({});

  const {
    register,
    getValues,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SearchParams>({
    mode: 'onSubmit',
    resolver: yupResolver<yup.AnyObjectSchema>(!from && !to ? noValidateSchema : schema),
  });

  const updateURLParameter = (url: string, param: any, paramVal: any): string => {
    let newAdditionalURL = '';
    let tempArray = url.split('?');
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = '';
    if (additionalURL) {
      tempArray = additionalURL.split('&');
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split('=')[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = '&';
        }
      }
    }
    let rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt;
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let temp = {
      ...data,
      from: data?.from ? data?.from : '',
      to: data?.to ? data?.to : '',
    };

    let payload = {
      ...data,
      fullname: data.fullname.trim(),
    };

    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        if (temp[key] === undefined) {
          delete temp[key];
        }
      }
    }

    for (const key in temp) {
      if (Array.isArray(temp[key]) && temp[key].length > 0) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key][0]))
        );
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      }
    }
    handleSubmitSearch && handleSubmitSearch(payload);
  };

  const itemOptions = itemState.map((item) => ({
    label: item === 'ALL' ? 'Tất cả chỉ số' : item,
    value: item,
  }));

  const dateOptions = dateState.map((item) => ({
    value: item,
    label: item,
  }));

  const quaterOptions = quaterState.map((item) => ({
    value: item,
    label: item,
  }));

  const monthOptions = monthState.map((item) => ({
    value: item,
    label: item,
  }));

  const yearOptions = yearState.map((item) => ({
    value: item,
    label: item,
  }));

  return (
    <div className='box-search-report' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='group-box-options'>
          <Form.Group as={Col} className='allParams' xl='4' md='3' sm='12'>
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
                  defaultValue={itemOptions[0]}
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
                  options={itemOptions}
                  value={itemOptions.find((val: any) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>

          <Form.Group as={Col} className='search-merchant' xl='4' md='6' sm='4'>
            <AsyncSelectMC
              asyncType='MERCHANT'
              control={control}
              clearError={clearErrors}
              name='merchantId'
              keyReturn='merchantId'
              {...{
                className: 'search-merchant-select',
                classNamePrefix: 'merchant-async-select',
              }}
            />
          </Form.Group>

          <Form.Group as={Col} className='dateFilter' xl='4' md='3' sm='12'>
            <Controller
              control={control}
              name={'kycState'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                    placeholder: (defaultStyles) => {
                      return {
                        ...defaultStyles,
                        color: '#000',
                      };
                    },
                  }}
                  placeholder={`Thời gian lọc`}
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
                  options={dateOptions}
                  value={dateOptions.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => {
                    onChange(e.value);
                    setSelectTime(e.value);
                  }}
                />
              )}
            />
          </Form.Group>
        </div>

        <div className='group-box-value'>
          {selectTime === 'DATE' && (
            <div className='form-group form-date ml-3'>
              <div className='date-picker-custom'>
                <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
              </div>
            </div>
          )}

          {selectTime === 'MONTH' && (
            <>
              <Form.Group as={Col} className='time1' xl='4' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'monthFrom'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={monthOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={monthOptions}
                      value={monthOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <Form.Group as={Col} className='time2' xl='4' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'yearFrom'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={yearOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={yearOptions}
                      value={yearOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <div className='block-icon'>
                <i className='fa fa-chevron-right next-icon' />
              </div>
              <Form.Group as={Col} className='time3' xl='4' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'monthTo'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={monthOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={monthOptions}
                      value={monthOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <Form.Group as={Col} className='time4' xl='4' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'yearTo'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={yearOptions.reverse()[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={yearOptions.reverse()}
                      value={yearOptions.reverse().find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>
            </>
          )}

          {selectTime === 'QUATER' && (
            <>
              <Form.Group as={Col} className='time1' xl='2' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'quaterFrom'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={quaterOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={quaterOptions}
                      value={quaterOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <Form.Group as={Col} className='time2' xl='2' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'yearFrom'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={yearOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={yearOptions}
                      value={yearOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <div className='block-icon'>
                <i className='fa fa-chevron-right next-icon' />
              </div>
              <Form.Group as={Col} className='time3' xl='2' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'quaterTo'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={quaterOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={quaterOptions}
                      value={quaterOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <Form.Group as={Col} className='time4' xl='2' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'yearTo'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={yearOptions.reverse()[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={yearOptions.reverse()}
                      value={yearOptions.reverse().find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>
            </>
          )}

          {selectTime === 'YEAR' && (
            <>
              <Form.Group as={Col} className='time1' xl='2' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'yearFrom'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={yearOptions[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={yearOptions}
                      value={yearOptions.find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>

              <div className='block-icon'>
                <i className='fa fa-chevron-right next-icon ' />
              </div>

              <Form.Group as={Col} className='time2' xl='2' md='3' sm='12'>
                <Controller
                  control={control}
                  name={'yearTo'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={yearOptions.reverse()[0]}
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
                        return i18next.language === 'en'
                          ? 'No options'
                          : 'Không có kết quả tìm kiếm';
                      }}
                      options={yearOptions.reverse()}
                      value={yearOptions.reverse().find((val: any) => val.value === value)}
                      onChange={(e: SingleValue<any>) => onChange(e.value)}
                    />
                  )}
                />
              </Form.Group>
            </>
          )}

          {!selectTime ? (
            ''
          ) : (
            <div className='d-flex ml-3 search-button-group'>
              <button className='btn btn-primary btn-search mr-2' disabled={isLoading as any}>
                <i className='fas fa-clipboard-list'></i>
                {t('Statistics')}
              </button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
};

export default BoxSearch;
