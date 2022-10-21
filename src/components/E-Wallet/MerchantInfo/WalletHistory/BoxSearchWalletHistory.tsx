import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useSelector } from 'react-redux';

export interface SearchParams {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

interface BoxSearchWalletHistoryProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  parentSubmit: boolean;
}

export default function BoxSearchWalletHistory({
  handleSubmitSearch,
  submitForm = false,
  valuesSearch,
  setSubmitForm,
  showFilter,
  parentSubmit,
}: BoxSearchWalletHistoryProps) {
  const { t } = useTranslation('common');
  const query = useRouter().query;
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer?.loadingWalletHistory
  );
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);

  const { register, getValues, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: {},
  });

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && isLoading && e.preventDefault();
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let payload = { ...data };

    handleSubmitSearch && handleSubmitSearch(payload);
  };

  useEffect(() => {
    if (submitForm || parentSubmit) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [parentSubmit])
  
  useEffect(() => {
    handleSubmitSearch && handleSubmitSearch(getValues());
  }, [accountId]);

  return (
    <>
      {showFilter && (
        <div className='box-search-merchant-info'>
          <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <div className='form-group px-3 form-date'>
              {/* <Form.Label>{t('Duration')}</Form.Label> */}
              <div className='date-picker-custom'>
                <DatePickerCustomV2  control={control} />
              </div>
            </div>

            <div className='d-flex align-items-start  search-button-group'>
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
