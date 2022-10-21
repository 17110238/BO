import React, { MouseEventHandler, useRef, useEffect, useState } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { FilterDateISO, AccountMerchant } from 'models/account/accountMerchant';
import { useRouter } from 'next/router';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import Router from 'next/router';
import { searchAccountMc } from 'redux/actions';
import { useDispatch } from 'react-redux';

// import FileSaver, { saveAs } from 'file-saver';
interface BoxSearchAccountMcProps {
  dataSearch: number | string | any;
  showFilter: boolean;
  submitForm: boolean;
  submitFormTran: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearSearch: () => void;
  infoAccount?: AccountMerchant;
}

export interface SearchParams {
  id?: number | null;
  search?: string;
}

export default function BoxSearchAccount({
  dataSearch,
  showFilter,
  handleSubmitSearch,
  handleClearSearch,
  submitForm = false,
  submitFormTran = false,
  infoAccount,
}: BoxSearchAccountMcProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

  const [infoAccountv2, setInfoAccountv2] = useState<AccountMerchant[]>([]);
  const { control, reset, setValue, getValues, clearErrors, handleSubmit, watch, register } =
    useForm<SearchParams>({
      shouldFocusError: false,
      reValidateMode: 'onSubmit',
    });
  const onSubmit: SubmitHandler<SearchParams> = (data, e) => {
    e?.preventDefault();
    handleSubmitSearch && handleSubmitSearch(data);
    //router.push(`/accounts/${data.search}`);
  };

  const onClearForm: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    reset();
    handleClearSearch && handleClearSearch();
  };

  useEffect(() => {
    setValue('search', dataSearch);
  }, [dataSearch]);

  useEffect(() => {
    if (submitForm) {
      // handleSubmitSearch && handleSubmitSearch({ id: +watch('id')! });
      handleSubmitSearch && handleSubmitSearch({ search: watch('search')! });
    }
  }, [submitForm]);

  // if use async by open
  // useEffect(() => {
  //   if (watch('search')) {
  //     // handleSubmitSearch && handleSubmitSearch({ id: +watch('id')! });
  //     handleSubmitSearch && handleSubmitSearch({ search: watch('search')! });
  //   } else {
  //     handleClearSearch && handleClearSearch();
  //   }
  // }, [watch('search')]);

  // useEffect(() => {
  //   if (submitFormTran) {
  //     handleSubmitSearch && handleSubmitSearch(getValues());
  //   }
  // },[submitFormTran])
  return (
    <Form className='box-search-account-mc' onSubmit={handleSubmit(onSubmit)}>
      <Row className={`box-search mt-4 ${showFilter ? '' : 'd-none'}`}>
        <Form.Group as={Col} xl='3' md='6' sm='6'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <div className='clearable'>
            <Form.Control
              type='search'
              className='form-search-account-mc'
              style={{height : '42px'}}
              placeholder={t('Nhập: Tên đăng nhập, Số điện thoại, Email')}
              autoComplete='off'
              {...register('search')}
            />
          </div>
          {/* <AsyncSelect
            keyReturn='accountId'
            asyncType='ACCOUNT_MERCHANT'
            control={control}
            clearError={clearErrors}
            name='id'
            initLabel='Danh sách tài khoản'
            isAllowSearchAll={false}
            formatLabel={(account: AccountMerchant) => (
              <p className='m-0'>
                {`${account.accountId} - `}
                {account?.phone ? (
                  <span className='font-weight-bold'>{`${account?.phone} `}</span>
                ) : (
                  <span className='font-italic text-light-blur'>{`[ Rỗng ] `}</span>
                )}
                {account?.email ? (
                  `- ${account?.email}`
                ) : (
                  <span className='font-italic text-light-blur'>{`[ Rỗng ] `}</span>
                )}
              </p>
            )}
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          /> */}
        </Form.Group>
        <Form.Group className='d-flex align-items-end'>
          <button className='btn btn-primary btn-search mt-0'>
            <i className='fas fa-search'></i>
            {t('Search')}
          </button>
        </Form.Group>
      </Row>
    </Form>
  );
}
