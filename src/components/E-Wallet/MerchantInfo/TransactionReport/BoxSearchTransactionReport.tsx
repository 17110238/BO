import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
dayjs.extend(utc);

export interface SearchParams {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

interface BoxSearchTransactionReportProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
}

export default function BoxSearchTransactionReport({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  valuesSearch,
  setSubmitForm,
}: BoxSearchTransactionReportProps) {
  const { t } = useTranslation('common');
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer?.loadingTransactionReport);
  const [firstUpdate, setFirstUpdate] = useState<boolean>(true);

  const defaultValues = {
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };

  const { register, getValues, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues,
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
    if (!firstUpdate) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    } else {
      setFirstUpdate(false);
    }
  }, [submitForm]);

  return (
    <div className='box-search-merchant-info bdr-none'>
      <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} className="align-items-baseline">
        <div className='form-group px-3 form-date'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <div className='date-picker-custom'>
            <DatePickerCustomV2  control={control} />
          </div>
        </div>

        <div className='d-flex align-items-center mt-md-2 ml-3 search-button-group'>
          <button className='btn btn-primary btn-search search-btn-custom' disabled={isLoading}>
            {/* <i className='fas fa-search'></i> */}
            {!isLoading && (
              <>
                <i className="fas fa-analytics"></i>
                {t('Thống kê')}
              </>
            )}
            {isLoading && <><i className='fas fa-spinner fa-pulse'></i>{t('Thống kê')}</>}
          </button>
        </div>
      </Form>
    </div>
  );
}
;