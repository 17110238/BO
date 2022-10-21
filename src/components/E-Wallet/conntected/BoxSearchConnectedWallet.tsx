import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SubscriptionClient } from 'graphql-subscriptions-client';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import i18next from 'i18next';
dayjs.extend(utc);

export interface SearchParams {
  search?: string | string[];
  searchType?: string | string[] | any;
  appId?: string | string[] | number;
  userId?: string | string[] | number;
  accountId?: string | string[] | number;
  phone?: string | string[];
}
interface BoxSearchConnectedWalletProps {
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  appInfoList?: any[];
  setSubmitForm: (a: boolean) => void;
  filter: any;
  isLoading: boolean;
  isShowFilter: boolean;
}

const searchTypeList = [
  'accountId',
  'phone',
  'userId',
]

export default function BoxSearchConnectedWallet({
  handleSubmitSearch,
  submitForm = false,
  appInfoList,
  isLoading,
  setSubmitForm,
  isShowFilter,
}: BoxSearchConnectedWalletProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const query = router.query;
  const defaultValue = {
    searchType: 'accountId',
  };
  const [initialValue, setInitialValue] = useState<any>({});
  const [countSubmit, setCountSubmit] = useState<number>(0);

  const { register, control, handleSubmit, reset, watch } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    setCountSubmit(countSubmit => ++countSubmit);
    const convertedData: any = removeEmpty(data);

    router.replace(`quan-ly-lien-ket-vi?${convertToQueryString(convertedData)}`, undefined, {
      shallow: true,
    });
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('quan-ly-lien-ket-vi', undefined, { shallow: true });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      if (handleSubmitSearch) {
        handleSubmitSearch({});
      }
      setInitialValue(defaultValue);

      return;
    }

    const { search, searchType, appId } = query || {};

    if (searchType === 'accountId') {
      handleSubmitSearch && handleSubmitSearch(_.pickBy({
        appId: +appId!,
        accountId: +search!,
      }, _.identity));
    }

    if (searchType === 'phone') {
      handleSubmitSearch && handleSubmitSearch(_.pickBy({
        appId: +appId!,
        phone: search,
      }, _.identity));
    }

    if (searchType === 'userId') {
      handleSubmitSearch && handleSubmitSearch(_.pickBy({
        appId: +appId!,
        userId: search,
      }, _.identity));
    }

    setInitialValue(query);
  }, [query]);

  const searchTypeOptions = searchTypeList.map((value) => ({
    value: value,
    label: t(`CONNECTED_${value}`),
  }));

  const convertedAppInfoList = [
    {
      name: 'Chọn tên ứng dụng',
      id: '',
      merchantId: '',
    },
    ...appInfoList?.[0]?.store || []
  ]

  const appInfoOptions = convertedAppInfoList?.map((value: any) => ({
    value: value['id'],
    label: <span>{value['name']} <b>{value['merchantId'] ? "#" + value['merchantId'] : ''}</b></span>,
  }));

  return (
    <>
      {
        isShowFilter &&
        <div className='box-search-multitransfer-campaign'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group as={Col} xl='3' md='6'>
              <Form.Control
                type='text'
                placeholder={`Tìm kiếm ${t('CONNECTED_' + watch('searchType')) ?? ''}`}
                autoComplete='off'
                {...register('search')}
              />
            </Form.Group>
            <Form.Group as={Col} className='form-MC-state' xl='2' md='6'>
              <Controller
                control={control}
                name={'searchType'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    defaultValue={{ label: 'AccountId', value: 'accountId' }}
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
                    options={searchTypeOptions}
                    value={searchTypeOptions.find((val) => {
                      if (typeof value === 'object') return val.value === '';
                      else {
                        return val.value === value;
                      }
                    })}
                    placeholder=''
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                    }}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <Form.Group as={Col} className='form-MC-state' xl='3' md='6'>
              <Controller
                control={control}
                name={'appId'}
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
                    noOptionsMessage={() => {
                      return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                    }}
                    defaultValue={{ value: '', label: t('ALL') } as any}
                    options={appInfoOptions}
                    value={appInfoOptions.find((val) => +val.value === +value!)}
                    onChange={(e: SingleValue<any>) => onChange(e.value)}
                  />
                )}
              />
            </Form.Group>
            <div className='d-flex ml-3 search-button-group'>
              <button className='btn btn-primary btn-search' disabled={isLoading}>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
              </button>

              <button className='btn btn-clear' disabled={isLoading}>
                <div onClick={onClearForm}>
                  <i className='fas fa-eraser mr-2'></i>
                  {t('Clear')}
                </div>
              </button>
            </div>
          </Form>
        </div>
      }
    </>
  );
}
