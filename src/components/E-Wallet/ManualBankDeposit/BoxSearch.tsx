import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { convertEnumtoArray } from 'utils/helpers/convertEnumtoArray';
import { EwalletPaymentBoState } from 'models';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export interface SearchParams {
  typeId?: string;
  bankTransaction?: string;
  state?: string;
  createdAt?: { from?: any; to?: any };
  bankId?: number;
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  listAccountBank: any[];
  t: (a: string) => string;
  isLoading: boolean;
}

const transactionState = ['Tất cả trạng thái', ...convertEnumtoArray(EwalletPaymentBoState)];

const BoxSearch: React.FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  submitForm,
  isLoading,
  t,
  listAccountBank,
}) => {
  const { query }: any = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } =
    useForm<SearchParams>({
      defaultValues: {
        createdAt: {
          from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('date').utc().format(),
        },
        bankTransaction: '',
      },
    });
  const accountBankArrayNew = [{ value: '', label: t('Tất cả ngân hàng') }, ...listAccountBank];
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

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };
    let payload = {
      ...data,
      bankTransaction: data.bankTransaction.trim(),
    };
    !data.createdAt?.from && delete payload.createdAt.from;
    !data.createdAt?.to && delete payload.createdAt.to;

    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        if (temp[key] === undefined) {
          delete temp[key];
        }
      }
    }

    delete temp.createdAt;

    for (const key in temp) {
      if (Array.isArray(temp[key]) && temp[key].length > 0) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key][0]))
        );
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      }
    }
    handleSubmitSearch && handleSubmitSearch(payload);
  };

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      const from = dayjs().subtract(30, 'day').toISOString();
      const to = dayjs().endOf('date').toISOString();
      if (query?.from && query?.to)
        setValue('createdAt', { from: query.from.toString(), to: query.to.toString() });
      if (query?.from && !query?.to) setValue('createdAt', { from: query.from.toString() });
      if (!query?.from && query?.to) setValue('createdAt', { to: query.to.toString() });
    }
  }, [query?.search, query?.state, query?.method, query?.from, query?.to]);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      let flag = false;
      let temp: SearchParams = {};
      let from = query?.from && query?.from !== '' ? query?.from : '';
      let to = query?.to && query?.to !== '' ? query?.to : '';
      for (const key in query) {
        if (new RegExp(`<[^>]*script`).test(query[key])) {
          flag = false;
          break;
        }
        flag = true;
      }
      if (flag) {
        temp = {
          ...temp,
          bankTransaction: query?.bankTransaction ? query?.bankTransaction : '',
        };
        if (!(from && to)) {
          temp = {
            ...temp,
            createdAt: {
              from: dayjs().subtract(30, 'day').toISOString(),
              to: dayjs().endOf('date').toISOString(),
            },
          };
        }
        if (from && to) {
          temp = {
            ...temp,
            createdAt: {
              from,
              to,
            },
          };
        }
        if (to && !from) {
          temp = {
            ...temp,
            createdAt: {
              to,
            },
          };
          delete temp?.createdAt?.from;
        }
        if (from && !to) {
          temp = {
            ...temp,
            createdAt: {
              from,
            },
          };
          delete temp?.createdAt?.to;
        }
      }
      handleSubmitSearch && handleSubmitSearch(temp);
    }
  }, [query?.search, query?.state, query?.method, query?.from, query?.to]);

  const transactionStateOptions = transactionState.map((transaction) => ({
    value: transaction === 'Tất cả trạng thái' ? '' : transaction,
    label: t(`${transaction}`),
  }));

  return (
    <div className='box-search-manual-bank-deposit'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='bankTransaction' md='2' xl='3' sm='2'>
          <Form.Control
            type='text'
            placeholder={`${t('Enter')}: ${
              t('bankTransaction').charAt(0).toLocaleLowerCase() + t('bankTransaction').slice(1)
            }`}
            autoComplete='off'
            {...register('bankTransaction')}
          />
        </Form.Group>

        <Form.Group as={Col} className='state' xl='3' md='2' sm='2'>
          <Controller
            control={control}
            name={'state'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả trạng thái') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                options={transactionStateOptions}
                value={transactionStateOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='form-group ml-3 form-date'>
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
          </div>
        </div>

        <Form.Group as={Col} className='bank' xl='2' md='2' sm='2'>
          <Controller
            control={control}
            name={'bankId'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả ngân hàng') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                options={accountBankArrayNew}
                value={accountBankArrayNew.find((val: any) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>

        <div className='d-flex ml-2 search-button-group'>
          <button className='btn btn-primary btn-search' disabled={isLoading}>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default BoxSearch;
