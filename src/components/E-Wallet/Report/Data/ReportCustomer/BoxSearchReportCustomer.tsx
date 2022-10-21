import React, { useState, useMemo, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useRouter } from 'next/router';
import ReactSelect, { SingleValue } from 'react-select';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash'
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
dayjs.extend(utc);

interface Props {
  handleSubmitSearch?: (a: any) => void;
  handleClearForm?: () => void;
  loading?: boolean;
  showFilter?: boolean
}
export interface SearchParams {
  createdAt?: {
    from?: string | string[];
    to?: string;
  };
}

const BoxSearchReportCustomer: React.FC<Props> = ({
  handleSubmitSearch,
  loading,
  showFilter
}) => {

  const { t } = useTranslation('common');
  const router = useRouter();
  const { query }: any = router

  const [initialValue, setInitialValue] = useState<any>({});
  const stringifyQuery = JSON.stringify(query);
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };

  const { register, control, handleSubmit, reset, getValues, clearErrors,
    formState: { errors } } = useForm<SearchParams>({
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    });



  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();

    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));
    router.replace(`/vi-dien-tu/bao-cao-he-thong?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
      setInitialValue(defaultValue);

      return;
    }

    if (query.from && !query.to) {
      const result = {
        createdAt: {
          from: query.from,
          to: dayjs().endOf('date').utc().format(),
        }
      }

      handleSubmitSearch && handleSubmitSearch(result);
      setInitialValue(result);

      return;
    }

    if (!_.isEmpty(query)) {
      const convertedQueryObj = _.omit(
        {
          ...query,
          createdAt: {
            from: query?.from,
            to: query?.to,
          },
        },
        ['from', 'to']
      );

      const result = removeEmpty(convertedQueryObj);

      handleSubmitSearch && handleSubmitSearch(result);
      setInitialValue(result);
    }
  }, [query]);

  return (
    <>
      {
        showFilter && <div className='box-search-report-customer box-search-multitransfer-campaign'>
          <Form onSubmit={handleSubmit(onSubmit)} className='row align-items-baseline'>
            <div className='form-group ml-3 form-date'>
              {/* <Form.Label>{t('Duration')}</Form.Label> */}
              <div className='date-picker-custom'>
                <DatePickerCustomV2
                  placeholder={'DD/MM/YYYY HH:MM'}
                  control={control}
                  clearErrors={clearErrors}
                  className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
                  rules={{ from: { required: true }, to: { required: true } }}
                />
              </div>
            </div>
            <div className='d-flex align-items-center ml-3 search-button-group'>
              <button className='btn btn-primary btn-search' style={{ whiteSpace: 'nowrap', minWidth: '80px' }} disabled={loading}>
                {!loading && (
                  <>
                    <i className="fas fa-analytics"></i>
                    {t('Thống kê')}
                  </>
                )}
                {loading && <><i className='fas fa-spinner fa-pulse'></i>{t('Thống kê')}</>}
              </button>
            </div>
          </Form>
        </div>
      }
    </>
  );
};

export default BoxSearchReportCustomer;
