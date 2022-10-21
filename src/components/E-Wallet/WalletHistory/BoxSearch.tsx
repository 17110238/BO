import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { GetAppInfoData } from 'models';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export interface SearchParams {
  txtSearch?: string;
  typeSearch?: string;
  change?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

interface BoxSearchWalletHistoryProps {
  showFilter?: boolean;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  getPayloadFromURL: () => any;
}

export default function BoxSearchWalletHistory({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm,
  setSubmitForm,
  getPayloadFromURL,
}: BoxSearchWalletHistoryProps) {
  const { t } = useTranslation('common');
  const query = useRouter().query;
  const isLoading = useSelector<any, boolean>((state) => state?.walletHistoryReducer?.loading);
  const [playHolderValue, setPlayHoderValue] = useState<string>(t('Phone'));
  const {
    register,
    getValues,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchParams>({
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
    mode: 'onSubmit',
  });

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && isLoading && e.preventDefault();
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any) => {
    !data.txtSearch && delete data.typeSearch;
    handleSubmitSearch && handleSubmitSearch({ ...data });
  };

  useEffect(() => {
    const payload = getPayloadFromURL();
    reset(payload);
  }, []);

  const searchTypes = [
    {
      label: t('Phone'),
      value: 'phone',
    },
    {
      label: t('UserID'),
      value: 'userId',
    },
  ];

  const transactionTypes = [
    {
      label: 'Tất cả loại GD',
      value: '',
    },
    {
      label: 'Rút ra khỏi ví',
      value: '-',
    },
    {
      label: 'Nạp vào ví',
      value: '+',
    },
  ];

  const handleChangeInput = (inputValue: any) => {
    setPlayHoderValue(inputValue);
  };

  return (
    <>
      {showFilter && (
        <div className='box-search-wallet-history-list'>
          <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <div className='search-by-type-wrapper'>
              <Form.Group as={Col} className='search-by-type' xl='2' sm='5'>
                <Controller
                  control={control}
                  name={'typeSearch'}
                  defaultValue={'phone'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={searchTypes[0]}
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
                      value={searchTypes.find((val) => val.value === value)}
                      onChange={(e: SingleValue<any>) => {
                        onChange(e.value);
                        handleChangeInput(e.label);
                      }}
                    />
                  )}
                />
              </Form.Group>
            </div>

            <Form.Group as={Col} className='payment-method-dropdown-list' xl='2' sm='3'>
              <div className='search-by-type-wrapper'></div>
              <Form.Control
                type='text'
                placeholder={`${t('Enter')}: ${
                  t(playHolderValue).charAt(0).toLocaleLowerCase() + t(playHolderValue).slice(1)
                }`}
                autoComplete='off'
                {...register('txtSearch')}
                onChange={(e) => setValue('txtSearch', e.target.value.trim())}
              />
            </Form.Group>

            <Form.Group as={Col} className='merchant-dropdown-list' xl='2' sm='2'>
              <Controller
                control={control}
                name={'change'}
                defaultValue={''}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={{
                      ...customStyles,
                      menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                      menu: (provided) => ({ ...provided, zIndex: 2 }),
                    }}
                    defaultValue={transactionTypes[0]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={transactionTypes}
                    value={transactionTypes.find((val) => val.value === value)}
                    placeholder=''
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>

            <div className='form-group px-3 form-date'>
              <div className='date-picker-custom'>
                <DatePickerCustomV2
                  placeholder={'DD/MM/YYYY'}
                  control={control}
                  className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                  ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
                  `}
                  rules={{ from: { required: true }, to: { required: true } }}
                />
              </div>
            </div>

            <div className='ml-3 search-button-group'>
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
