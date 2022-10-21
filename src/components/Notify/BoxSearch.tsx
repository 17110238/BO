import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useSelector } from 'react-redux';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
dayjs.extend(utc);
export interface SearchParams {
  search?: string;
  state?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

interface BoxSearchHistoryProps {
  showFilter?: boolean;
  showHistory?: boolean;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  setSubmitForm: (a: boolean) => void;
  getPayloadFromURL: () => any;
}

export default function BoxSearchHistory({
  showFilter,
  showHistory,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  setSubmitForm,
  getPayloadFromURL,
}: BoxSearchHistoryProps) {
  const { t } = useTranslation('common');
  const query = useRouter().query;
  const isLoading = useSelector<any, boolean>((state) => state?.notifyReducer?.loading);

  const { register, getValues, setValue, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: {},
  });

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && isLoading && e.preventDefault();
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any) => {
    handleSubmitSearch && handleSubmitSearch(data);
  };

  const stateList = [
    {
      label: t('Tất cả trạng thái'),
      value: '',
    },
    {
      label: t('Thành công'),
      value: 'SUCCESS',
    },
    {
      label: t('Thất bại'),
      value: 'FAIL',
    },
  ];

  useEffect(() => {
    const payload = getPayloadFromURL();
    reset(payload);
  }, []);

  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [query]);

  return (
    <>
      {showHistory && showFilter && (
        <div className='box-search-history-list'>
          <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <Form.Group as={Col} className='merchant-dropdown-list' xl='2' sm='3'>
              <Controller
                control={control}
                name={'state'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    defaultValue={stateList[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={stateList}
                    value={stateList.find((val) => val.value === value)}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>

            <Form.Group as={Col} className='payment-method-dropdown-list' xl='2' sm='3'>
              <Form.Control
                type='text'
                placeholder={`${t('Enter')}: ${t('SĐT')}, ${
                  t('Chiến dịch').charAt(0).toLocaleLowerCase() + t('Chiến dịch').slice(1)
                }`}
                autoComplete='off'
                {...register('search')}
                onChange={(e) => setValue('search', e.target.value.trim())}
              />
            </Form.Group>

            <div className='form-group px-3 form-date'>
              <div className='date-picker-custom'>
                <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
              </div>
            </div>

            <div className='ml-3'>
              <button className='btn btn-primary btn-search search-btn-custom' disabled={isLoading}>
                <i className='fas fa-search'></i>
                <p>{t('Tìm kiếm')}</p>
              </button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}
