import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { TypeSearchHistoryReport } from 'models/ewalletPartnerService';
import React, { useState, useEffect, useMemo, MouseEventHandler } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { searchTypeHistoryReport } from '../../utils/constantOptionSelect';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash'
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
dayjs.extend(utc);

interface Props {
  handleSearchForm: (data: any) => void;
  loading?: boolean;
  submitForm: boolean,
  setSubmitForm: (a: boolean) => void;
  showFilter?: boolean
}

const BoxSearchEwalletHistoryReport: React.FC<Props> = ({
  handleSearchForm,
  loading,
  submitForm = false,
  setSubmitForm,
  showFilter
}) => {
  const { t } = useTranslation('common');
  const [typeSearch, setTypeSearch] = useState<string>('phone')
  const router = useRouter();
  const { query }: any = router
  const [initialValue, setInitialValue] = useState<any>({});
  const [select, setSelect] = useState<any>({})

  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } = useForm<any>(
    {
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    }
  );

  const searchTypeOptions = searchTypeHistoryReport.map((value) => ({
    value: value,
    label: t(value),
  }));

  const onSubmit: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    const newData: any = {
      ...data,
      select: {
        [data?.typeSelect]: data?.searchValue
      }
    }

    // if (newData?.select[data?.typeSelect] === "") {
    //   delete newData?.select
    // }
    // delete newData?.searchValue
    // delete newData?.typeSelect


    const convertFilter = {
      ...newData,
      from: newData?.createdAt?.from,
      to: newData?.createdAt?.to,
      type: data?.typeSelect
    };

    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt', 'select'])));

    router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-vnpay?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
    // handleSearchForm && handleSearchForm(newData)
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSearchForm && handleSearchForm(defaultValue);
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

      handleSearchForm && handleSearchForm(result);
      setInitialValue(result);

      return;
    }

    if (!_.isEmpty(query)) {
      let convertedQueryObj: any = {}
      if (query?.type === "phone") {
        convertedQueryObj = _.omit(
          {
            ...query,
            createdAt: {
              from: query?.from,
              to: query?.to,
            },
            select: {
              phone: query.searchValue
            }
          },
          ['from', 'to', "type"]
        );
        
      } else {
        convertedQueryObj = _.omit(
          {
            ...query,
            createdAt: {
              from: query?.from,
              to: query?.to,
            },
            select: {
              transactionId: query.searchValue
            }
          },
          ['from', 'to', "type"]
        );
      }

      const result = removeEmpty(convertedQueryObj);

      handleSearchForm && handleSearchForm(_.omit(result, ['searchValue', 'typeSelect']));
      setInitialValue(result);
    }
  }, [query]);


  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac/chi-tiet-vnpay`, undefined, { shallow: true });
  };

  return (
    <>
      {showFilter && <div className='box-search-partner-service'>
        <Form onSubmit={handleSubmit(onSubmit)} className='d-flex row'>
          <Form.Group as={Col} xl={4} className='form-search'>
            <div className='groups-inputs-search-type'>
              <Form.Control
                type='text'
                placeholder={t('Nhập để tìm kiếm')}
                autoComplete='off'
                {...register(`searchValue`)}
              />
              <Controller
                control={control}
                name={'typeSelect'}
                defaultValue={TypeSearchHistoryReport.PHONE}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={customStyles}
                    className='form-control-type'
                    classNamePrefix='form-control-select'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    isSearchable={false}
                    noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                    options={searchTypeOptions}
                    value={searchTypeOptions.find((val) => val.value === value)}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value)
                    }}
                  />
                )}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} xl={6} className='form-day-from-to'>
            <div className='form-group form-date'>
              <div className='date-picker-custom'>
                <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:MM'} control={control} />
              </div>
            </div>
          </Form.Group>
          <div className='d-flex align-items-center search-button-group'>
            <button className='btn btn-primary btn-search' style={{ whiteSpace: 'nowrap', minWidth: '80px' }} disabled={loading} >
              {!loading && (
                <>
                  <i className='fas fa-search'></i>
                  {t('Tìm')}
                </>
              )}
              {loading && <><i className='fas fa-spinner fa-pulse'></i>{t('Tìm')}</>}
            </button>
            <div className='btn-clear' onClick={onClearForm}>
              <i className='fas fa-eraser mr-2'></i>
              {t('Clear')}
            </div>
          </div>
        </Form>
      </div>}
    </>
  )
}

export default BoxSearchEwalletHistoryReport