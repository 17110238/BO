import { useRouter } from 'next/router';
import React, { KeyboardEvent, useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { useSelector } from 'react-redux';
import { MerchantInfoState } from 'models/merchantInfo/merchantInfoState';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import { resetSearchMerchant, searchMerchantInfo } from 'redux/actions/merchantInfoActions';

export interface FilterSearchParams {
  id?: number[];
  state?: string[];
  accountType?: string;
  searchValue: string;
  searchType: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
}

export interface SearchParams {
  filter?: FilterSearchParams;
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
}

interface BoxSearchMerchantInfoProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
}

export default function BoxSearchMerchantInfo({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  valuesSearch,
  setSubmitForm,
}: BoxSearchMerchantInfoProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    loading,
    loadingLinkedBank,
    loadingSession,
    loadingWalletHistory,
    loadingTransactionHistory,
    loadingChangeHistory,
    loadingTransactionReport,
  } = useSelector<any, MerchantInfoState>((state) => state?.merchantInfoReducer);

  const isLoading = () => {
    return (
      loading ||
      loadingLinkedBank ||
      loadingSession ||
      loadingWalletHistory ||
      loadingTransactionHistory ||
      loadingChangeHistory ||
      loadingTransactionReport
    );
  };

  const { register, getValues, control, handleSubmit, reset, clearErrors, setValue } =
    useForm<SearchParams>({
      defaultValues: {},
    });

  const [inputSearch, setInputSearch] = useState<Boolean>(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchType = url.searchParams.get('searchType');
    const searchValue = url.searchParams.get('searchValue');
    if (searchType && searchValue) {
      reset({
        filter: {
          searchType,
          searchValue,
        },
      });
    }
  }, []);

  const updateURLParams = (filter: any) => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams();
    for (const key in filter) {
      if (filter[key]) {
        if (key === 'searchType' && filter[key] === 'FULLNAME') {
          searchParams.set(key, 'ACCOUNT_ID');
        } else {
          searchParams.set(key, filter[key]);
        }
      } else {
        searchParams.delete(key);
      }
    }
    if (filter.searchValue) {
      router.replace(path + '?' + searchParams.toString(), undefined, { shallow: true });
    } else {
      router.replace(path, undefined, { shallow: true });
    }
  };

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && isLoading() && e.preventDefault();
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let payload = { ...data };
    updateURLParams(payload.filter);
    handleSubmitSearch && handleSubmitSearch(payload);
  };

  const searchTypes = [
    {
      label: t('Số điện thoại'),
      value: 'PHONE',
    },
    {
      label: t('UserID'),
      value: 'ACCOUNT_ID',
    },
    {
      label: t('Họ tên'),
      value: 'FULLNAME',
    },
    {
      label: t('AliasName'),
      value: 'ALIASNAME',
    },
    {
      label: t('CMND'),
      value: 'IDENTIFY',
    },
  ];

  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [submitForm]);

  useEffect(() => {
    if (router?.query?.searchType === 'FULLNAME') {
      setInputSearch(true);
    }
  }, []);

  return (
    <div className='box-search-merchant-info'>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e: KeyboardEvent<HTMLFormElement>) => checkKeyDown(e)}>
        <Form.Group as={Col} className='merchant-dropdown-list' xl='2' sm='3'>
          {/* <Form.Label>{t('Trạng thái')}</Form.Label> */}
          <Form.Label></Form.Label>
          <Controller
            control={control}
            name={'filter.searchType'}
            defaultValue={searchTypes[0].value}
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
                placeholder=''
                onChange={(e: SingleValue<any>) => {
                  setValue('filter.searchValue', '');
                  router.push(router.pathname);
                  onChange(e.value);
                  if (e.value === 'FULLNAME') {
                    setInputSearch(true);
                  } else {
                    setInputSearch(false);
                  }
                }}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='payment-method-dropdown-list' xl='2' sm='3'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Label></Form.Label>
          {inputSearch ? (
            <AsyncSelect
              asyncType='INFORMERCHANT'
              control={control}
              clearError={clearErrors}
              name='filter.searchValue'
              keyReturn='id'
              returnType='text'
              initLabel='Danh sách khách hàng'
              {...{
                className: 'search-merchant-category-select',
                classNamePrefix: 'merchant-category-async-select',
              }}
            />
          ) : (
            <Form.Control
              type='text'
              placeholder={'Giá trị cần tìm'}
              autoComplete='off'
              {...register('filter.searchValue')}
            />
          )}
        </Form.Group>

        <div className='d-flex align-items-center mt-md-2 ml-3 search-button-group'>
          <button className='btn btn-primary btn-search search-btn-custom' disabled={isLoading()}>
            <i className='fas fa-search'></i>
            <p>{t('Tìm kiếm')}</p>
          </button>
        </div>
      </Form>
    </div>
  );
}
