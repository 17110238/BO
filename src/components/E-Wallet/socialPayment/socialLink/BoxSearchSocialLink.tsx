import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { stateMcEnum } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

interface Props {
  handleSubmitSearch?: (a: any) => void;
  handleClearForm?: () => void;
}

interface UserBoSelectType {
  label: string;
  value: number | null;
}

const transactionState = ['ALL', 'SEND_MONEY', 'REQUEST_MONEY', 'DOANTE_MONEY'];
const transactionTypeState = [
  'ALL',
  'USED',
  'FAILED',
  'EXPIRED',
  'CANCELED',
  'RECEIVED',
  'SUCCEEDED',
  'PENDING',
];

export default function BoxSearchSocialLink({ handleSubmitSearch, handleClearForm }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {
      createdAt: {},
      state: 'PENDING',
    },
  });
  const { query } = useRouter();

  const updateURLParameter = (url: string, param: any, paramVal: any): string => {
    let newAdditionalURL = '';
    let tempArray = url.split('?');
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = '';
    if (additionalURL) {
      tempArray = additionalURL.split('&');
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split('=')[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = '&';
        }
      }
    }
    let rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt;
  };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
    let temp = {
      ...data,
      from: data.createdAt?.from,
      to: data.createdAt?.to,
    };
    let payload = { ...data };
    delete temp.createdAt;
    for (const key in temp) {
      if (key === 'state') {
        if (temp[key] === 'ALL') {
          delete payload.state;
        } else
          payload = {
            ...payload,
            state: temp[key],
          };
      }
      if (temp[key]) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      } else {
        const parseUrl = window.location.search.split('?')[1];
        const params = new URLSearchParams(parseUrl);
        params.delete(key);
        window.history.replaceState('', '', `/payme/approval-kyc?${params.toString()}`);
      }
    }
    handleSubmitSearch && handleSubmitSearch(payload);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('/payme/approval-kyc', undefined, { shallow: true });
    reset();
    handleClearForm && handleClearForm();
    handleSubmitSearch &&
      handleSubmitSearch({
        state: stateMcEnum.PENDING,
      });
  };

  // list option mechant state
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      if (query?.searchString) setValue('searchString', query.searchString.toString());
      if (query?.state !== undefined) setValue('state', query.state);
      if (query?.from && query?.to)
        setValue('createdAt', { from: query.from.toString(), to: query.to.toString() });
      if (query?.from && !query?.to) setValue('createdAt', { from: query.from.toString() });
      if (!query?.to && query?.to) setValue('createdAt', { to: query.to.toString() });
    }
  }, [query?.searchString, query?.state, query?.from, query?.to]);

  const transactionTypeStateOption = transactionTypeState.map((value) => ({
    value: value,
    label: t(`MC_${value}`),
  }));

  const transactionStateOptions = transactionState.map((value) => ({
    value: value,
    label: t(`MC_${value}`),
  }));

  return (
    <div className='box-search-approval-merchant approval-wallet-kyc-container__box-search'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search'>
          <Form.Label>{t('Tìm kiếm')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('MC ID, MC Name, Phone, Email')}
            autoComplete='off'
            {...register('searchString')}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state'>
          <Form.Label>{t('Loại giao dịch')}</Form.Label>
          <Controller
            control={control}
            name={'state'}
            defaultValue={'AUTO_APPROVED'}
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
                options={transactionStateOptions}
                value={transactionStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='form-MC-state'>
          <Form.Label>{t('Trạng Thái')}</Form.Label>
          <Controller
            control={control}
            name={'state'}
            defaultValue={'APPROVED'}
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
                options={transactionTypeStateOption}
                value={transactionTypeStateOption.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='form-group ml-3 form-date'>
          <Form.Label>{t('Duration')}</Form.Label>
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
          </div>
        </div>
        <div className='d-flex align-items-center ml-3 search-button-group'>
          <button className='btn btn-primary btn-search'>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>
          <div className='btn btn-clear' onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </Form>
    </div>
  );
}
