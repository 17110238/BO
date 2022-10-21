import React, { useState, useEffect, MouseEventHandler, useRef } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactSelect, { SingleValue } from 'react-select';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useTranslation } from 'react-i18next';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { FiterHistoryMerchant, HistorySMSMerchantReposone } from 'models/emailSms/emailSms';
import { useSelector, useDispatch } from 'react-redux';
import { getEmailSmsHistory } from 'redux/actions/emailSmsAction';
import { useRouter } from 'next/router';
import { CreatedAtInput } from 'models';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { handleReplaceUrl } from 'utils/helpers/replaceUrl';
import _ from 'lodash'
dayjs.extend(utc);
interface Props {
  handleSubmitSearch?: (data: FiterHistoryMerchant) => void;
  handleClearSearch: () => void;
  showFilter?: boolean;
  submitForm?: boolean;
  dataHistory?: HistorySMSMerchantReposone[];
  loading?: boolean;
}

interface SearchParams {
  merchantId?: number;
  change?: string;
  transactionId?: string;
  createdAt?: any;
}

const optionChange = [
  { value: undefined, label: 'Cộng/Trừ' },
  { value: ' ', label: 'Cộng' },
  { value: '-', label: 'Trừ' },
];

const BoxSearchEmailSmsHistory: React.FC<Props> = ({
  handleSubmitSearch,
  handleClearSearch,
  showFilter,
  submitForm,
  dataHistory,
  loading,
}) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [start, setStart] = useState<number>(0);
  const [dataHistorySearch, setDataHistorySearch] = useState<HistorySMSMerchantReposone[]>([]);
  const [limit, setLimit] = useState<number>(dataHistorySearch?.length || 9999);
  const router = useRouter();
  const { query } : any = router
  const refSelect = useRef<any>();
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } = useForm<any>(
    {
      defaultValues: {},
    }
  );

  // const options = dataHistorySearch?.map((item) => {
  //   return {
  //     value: item.merchantId,
  //     label: item.merChantName,
  //   };
  // });

  // options &&
  //   options.unshift({
  //     value: 0,
  //     label: t(`MC_ALL`),
  //   });

  // useEffect(() => {
  //   const payload = {
  //     paging: {
  //       start,
  //       limit,
  //     },
  //     sort: {
  //       createdAt: 1,
  //     },
  //   };
  //   dispatch(
  //     getEmailSmsHistory(payload, (status, res) => {
  //       if (status) {
  //         setDataHistorySearch(res?.data);
  //       } else {
  //         setDataHistorySearch([]);
  //       }
  //     })
  //   );
  //   return () => {
  //     setDataHistorySearch([])
  //   }
  // }, []);

  const onSubmit: SubmitHandler<FiterHistoryMerchant> = (data: any, e) => {
    e?.preventDefault();
    const formatData = JSON.parse(JSON.stringify(data));    
    
    if(formatData?.change === ' '){
      formatData['change'] = '+';
    }
    handleReplaceUrl(formatData, router);    
    handleSubmitSearch && handleSubmitSearch(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('/cong-thanh-toan/email-sms/lich-su', undefined, { shallow: true });
    handleSubmitSearch && handleSubmitSearch({});
    handleClearSearch && handleClearSearch();
    reset();
  };

  useEffect(() => {
    if (!_.isEmpty(query)) {
      const params = { ...query };

      delete params.to;
      delete params.from;
      delete params.merchantId;

      const filter: any = {
        ...params,
        ...(query?.merchantId ? { merchantId: +(query?.merchantId as string) } : {}),
        createdAt: {
          from: query?.from as string,
          to: query?.to as string,
        },
      };

      reset(filter, { keepDefaultValues: true });
    }
  }, []);

  

  // useEffect(() => {
  //   if (submitForm) {
  //     handleSubmitSearch && handleSubmitSearch(getValues());
  //   }
  // }, [submitForm]);
  

  return (
    <div className='box-search-approval-merchant box-search-email-sms-history'>
      <Form onSubmit={handleSubmit(onSubmit)} className='row px-20'>
        <Form.Group as={Col} xl={3} lg={6} md={12} className='form-ma-gd'>
          {/* <Form.Label>{t('Mã GD')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Mã GD')}
            autoComplete='off'
            {...register('transactionId')}
          />
        </Form.Group>
        <Form.Group as={Col} xl={3} lg={6} md={12} className='form-all-mc'>
          {/* <Form.Label>{t('Tất cả Merchant')}</Form.Label> */}
          {/* <Controller
            control={control}
            name={'merchantId'}
            defaultValue={0}
            //defaultValue={ query?.merchantId ? +query?.merchantId : console.log('hello')}
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
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={options}
                value={options?.find((val: any) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          /> */}
          <AsyncSelect
            asyncType='MERCHANT'
            control={control}
            clearError={clearErrors}
            name='merchantId'
            keyReturn='merchantId'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </Form.Group>
        <Form.Group as={Col} xl={2} lg={6} md={6} sm={6} className='form-plus-minus'>
          {/* <Form.Label>{t('Cộng / Trừ')}</Form.Label> */}
          <Controller
            control={control}
            name={'change'}
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
                placeholder=''
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                value={optionChange.find((c: any) => c.value === value)}
                options={optionChange}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} xl={4} lg={6} md={12} className='form-day-from-to pr-0'>
          <div className='form-group form-date'>
            {/* <Form.Label>{t('Duration')}</Form.Label> */}
            <div className='date-picker-custom'>
              <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:MM'} control={control} />
            </div>
          </div>
        </Form.Group>
        <div className='d-flex align-items-center search-button-group col-xl-2 mt-0'>
          <button
            className='btn btn-primary btn-search mt-0'
            style={{ whiteSpace: 'nowrap', minWidth: '110px' }}
            disabled={loading}>
            {!loading && (
              <>
                <i className='fas fa-search'></i>
                {t('Search')}
              </>
            )}
            {loading && <i className='fas fa-spinner fa-pulse'></i>}
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

export default BoxSearchEmailSmsHistory;
