import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
dayjs.extend(utc);
interface Props {
  handleSubmitSearch?: (data: any) => void;
  onChangeType?: (data: string) => void;
  loading?: boolean;
}

const BoxSearchPartnerService: React.FC<Props> = ({
  handleSubmitSearch,
  onChangeType,
  loading
}) => {
  const optionChange: any[] = [
    { value: 'ESTIO', label: 'Estio - Thanh toán hóa đơn' },
    { value: 'OCB', label: 'OCB - Thanh toán hóa đơn' },
    { value: 'SSCC', label: 'SSCC - Thanh toán học phí' },
    { value: 'GATE', label: 'Gate - Topup phone, card telco' },
    { value: 'PVCOMBANK', label: 'PVComBank' },
    { value: 'NAPAS', label: 'NAPAS' },
    { value: 'PAY_QRCODE', label: 'VNPAY - Thanh toán dịch vụ QRCODE' },
  ];
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query }: any = useRouter();
  const [initialValue, setInitialValue] = useState<any>({});
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const stringifyQuery = JSON.stringify(query);
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  };

  const [change, setChange] = useState<string>('ESTIO');

  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors, formState: { errors }, watch, setError } = useForm<any>(
    {
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    }
  );

  useEffect(() => {
    if (query?.gateway) {
      setChange(query?.gateway)
    }
  }, [])

  const onSubmit: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();

    // const formatData = JSON.parse(JSON.stringify(data));
    // handleReplaceUrl(formatData, router);
    // handleSubmitSearch && handleSubmitSearch(formatData)

    const convertFilter = {
      ...data,
      from: data?.createdAt?.from,
      to: data?.createdAt?.to,
    };

    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter, ['createdAt'])));
    //setSubmitForm(!submitForm);
    router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  //useEffect(() => {
  // onChangeType && onChangeType(change)
  // handleSubmitSearch && handleSubmitSearch(getValues())
  //}, [change]);


  useEffect(() => {
    if (_.isEmpty(query)) {
      //handleSubmitSearch && handleSubmitSearch(defaultValue);
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

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    onChangeType && onChangeType('ESTIO')
    router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac`, undefined, { shallow: true });
    reset();
  };
  return (
    <div className='box-search-partner-service'>
      <Form onSubmit={handleSubmit(onSubmit)} className='d-flex'>
        <Form.Group as={Col} xl={3} lg={12} className='form-plus-minus px-0 mb-0'>
          {/* <Form.Label>{t('Đối tác dịch vụ')}</Form.Label> */}
          <Controller
            defaultValue={'ESTIO'}
            control={control}
            name={'gateway'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={customStyles}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                classNamePrefix="select-gate-way"
                placeholder=''
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                value={optionChange.find((c: any) => c.value === value)}
                options={optionChange}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                  if (watch('createdAt').from === null) {
                    setError('createdAt.from', { type: 'required' })
                  } else if (watch('createdAt').to === null) {
                    setError('createdAt.to', { type: 'required' })
                  } else {
                    onChangeType && onChangeType(e.value)
                    // router.replace(`/vi-dien-tu/tai-khoan/vi-dien-tu/doi-tac?${e.value !== '' ? `gateway=${e.value}&` : ''}${convertToQueryString({ from: defaultValue?.createdAt?.from, to: defaultValue?.createdAt?.to })}`, undefined, {
                    //   shallow: true,
                    // });
                  }
                }}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} xl={6} lg={12} className='form-day-from-to form-day-from-to-partner-service mb-0'>
          <div className='form-group form-date mb-0'>
            {/* <Form.Label>{t('Duration')}</Form.Label> */}
            <div className='date-picker-custom'>
              <DatePickerCustomV2
                placeholder={'DD/MM/YYYY'}
                clearErrors={clearErrors}
                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
                `}
                rules={{ from: { required: true }, to: { required: true } }}
                control={control}
              />
            </div>
          </div>
        </Form.Group>
        <div className='d-flex align-items-center search-button-group search-button-group-partner-service'>
          <button className='btn btn-primary btn-search' style={{ whiteSpace: 'nowrap' }} disabled={loading}>
            {!loading && (
              <>
                <i className="fas fa-analytics"></i>
                {t('Thống kê')}
              </>
            )}
            {loading && <><i className='fas fa-spinner fa-pulse'></i>{t('Thống kê')}</>}
          </button>
          <div className='btn-clear' onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BoxSearchPartnerService;
