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
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
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

const BoxSearchTradingStatic: React.FC<Props> = ({
  handleSubmitSearch,
  loading,
  showFilter
}) => {

  const { t } = useTranslation('common');
  const router = useRouter();
  const { query }: any = router

  // const [initialValue, setInitialValue] = useState<any>({});
  // const stringifyQuery = JSON.stringify(query);
  // const defaultValue = {
  //   createdAt: {
  //     from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
  //     to: dayjs().endOf('date').utc().format(),
  //   },
  // };

  // const { register, control, handleSubmit, reset, getValues, clearErrors,
  //   formState: { errors } } = useForm<SearchParams>({
  //     defaultValues: useMemo(() => {
  //       return initialValue;
  //     }, [initialValue]),
  //   });



  // const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
  //   e?.preventDefault();

  //   const convertFilter = {
  //     ...data
  //   };

  //   const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter)));
  //   router.replace(`/vi-dien-tu/thong-ke-giao-dich-vi?${convertToQueryString(spreadCreatedAt)}`, undefined, {
  //     shallow: true,
  //   });
  // };

  // useEffect(() => {
  //   reset();
  //   reset(initialValue);
  // }, [initialValue]);

  // useEffect(() => {
  //   if (_.isEmpty(query)) {
  //     handleSubmitSearch && handleSubmitSearch(defaultValue);
  //     setInitialValue(defaultValue);
  //     return;
  //   }

  //   if (query.from && !query.to) {
  //     const result = {
  //       createdAt: {
  //         from: query.from,
  //         to: dayjs().endOf('date').utc().format(),
  //       }
  //     }

  //     handleSubmitSearch && handleSubmitSearch(result);
  //     setInitialValue(result);

  //     return;
  //   }

  //   if (!_.isEmpty(query)) {
  //     const convertedQueryObj = _.omit(
  //       {
  //         ...query,
  //         createdAt: {
  //           from: query?.from,
  //           to: query?.to,
  //         },
  //       },
  //       ['from', 'to']
  //     );

  //     const result = removeEmpty(convertedQueryObj);

  //     handleSubmitSearch && handleSubmitSearch(result);
  //     setInitialValue(result);
  //   }
  // }, [query]);

  const {
    register,
    getValues,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
  });

  // const onClearForm: MouseEventHandler<any> = (e) => {
  //   e.preventDefault();
  //   router.replace(router.pathname, undefined, { shallow: true });
  //   reset();
  //   handleSubmitSearch && handleSubmitSearch({});
  // };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
    Object.entries(data).forEach((value) => {
      if (!value[1]) {
        delete data[value[0]];
      }
    });
    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };
    delete temp.createdAt;
    if (!temp.from) {
      delete temp.from;
    }
    if (!temp.to) {
      delete temp.to;
    }
    let payload = { ...temp };
    handleReplaceUrl(payload, router);
    console.log("data", data)
    handleSubmitSearch && handleSubmitSearch(data);
  };



  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  return (
    <>
      {
        showFilter && <div className='box-search-report-customer box-search-multitransfer-campaign' style={{ padding: '25px 25px 0'}}>
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

export default BoxSearchTradingStatic;