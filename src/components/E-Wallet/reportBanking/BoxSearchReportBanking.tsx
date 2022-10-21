import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
dayjs.extend(utc);

export interface SearchParams {
  createdAt?: {
    from?: string | string[];
    to?: string;
  };
}

interface IProps {
  handleSubmitSearch?: (data: SearchParams) => void;
}

export default function BoxSearchReportBanking({ handleSubmitSearch }: IProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const query = router.query;
  const [countSubmit, setCountSubmit] = useState<number>(0);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };
  const [initialValue, setInitialValue] = useState<any>({});

  const { register, control, handleSubmit, reset, getValues } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    setCountSubmit(countSubmit => ++countSubmit);
    e?.preventDefault();

    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));

    setSubmitForm(!submitForm);
    router.replace(`bao-cao-ngan-hang?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      if (handleSubmitSearch) {
        handleSubmitSearch(defaultValue);
      }
      setInitialValue(defaultValue);

      return;
    }

    if (query.from && !query.to) {
      const result = {
        createdAt: {
          from: query.from,
          to: dayjs().endOf('date').utc().format(),
        },
      };

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
    <div className='box-search-multitransfer-campaign'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group px-3 form-date'>
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
          </div>
        </div>

        <div className='d-flex mt-0 ml-3 search-button-group'>
          <button className='btn btn-primary btn-search'>
            <i className='fas fa-search'></i>
            {t('Thống kê')}
          </button>
        </div>
      </Form>
    </div>
  );
}
