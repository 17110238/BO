import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useSelector } from 'react-redux';

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

interface BoxSearchSessionProps {
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

export default function BoxSearchSession({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  valuesSearch,
  setSubmitForm,
  parentSubmit,
}: BoxSearchSessionProps) {
  const { t } = useTranslation('common');
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer?.loadingSession
  );

  const { register, getValues, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: {},
  });
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);

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
  }, [parentSubmit]);

  useEffect(() => {
    handleSubmitSearch && handleSubmitSearch(getValues());
  }, [accountId]);

  return (
    <>
      {showFilter && (
        <div className='box-search-merchant-info bdr-none'>
          <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
            <div className='form-group px-3 form-date'>
              {/* <Form.Label>{t('Duration')}</Form.Label> */}
              <div className='date-picker-custom'>
                <DatePickerCustomV2  control={control} />
              </div>
            </div>

            <div className='d-flex align-items-start search-button-group'>
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
