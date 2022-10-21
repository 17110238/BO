import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { StateTransactionEnum } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import useElementSize from 'hook/useElementSize';
import useWindowDimensions from 'hook/useWindowDimension';
import i18next from 'i18next';
// import DatePickerCustomNew from 'components/common/DatePickerCustom/DatePickerCustomNew';


export interface SearchParams {
  search?: string | string[];
  method?: string | null;
  state?: string | string[] | any;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchAccountantProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any
}

const transactionState = [
  'ALL',
  'SUCCEEDED',
  'PENDING',
  'CANCELED',
  'FAILED',
  'EXPIRED',
  'REFUNDED',
  'CANCELED_SUCCEEDED',
  'RECEIVED',
  'USED',
  'ESCROW',
  'CLAIMED',
  'DENIED',
  'AUTHORIZED',
];

export default function BoxSearchAccountant({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  onChangeDateSearch,
  valuesSearch,
  paymentMethodList,
  setSubmitForm,
  boxSearchRef
}: BoxSearchAccountantProps) {
  const { t, i18n } = useTranslation('common');
  const refState = useRef({});
  const router = useRouter();
  const { query }: any = useRouter();


  const { register, getValues, control, handleSubmit, reset, setValue } = useForm<SearchParams>({
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(30, 'day').toISOString(),
        to: dayjs().endOf('date').toISOString(),
      },
      state: '',
      method: '',
    },
  });
  const convertedPaymentMethodList: any = paymentMethodList?.filter(
    (method: any) => method.payCode
  );
  const transactionMethod = [
    {
      payCode: '',
      name: 'ALL',
    },
    ...convertedPaymentMethodList,
  ];

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
    let payload = { ...data };
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

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('/transaction-manage', undefined, { shallow: true });
    reset();
    handleClearForm && handleClearForm();
    handleSubmitSearch &&
      handleSubmitSearch({
        createdAt: {
          from: dayjs().subtract(30, 'day').toISOString(),
          to: dayjs().endOf('date').toISOString(),
        },
      });
  };
  // const handleDownloadFile = (csvData: any, fileName: string) => {
  //   const fileType =
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   const fileExtension = '.xlsx';

  //   const ws = XLSX.utils.json_to_sheet(csvData);
  //   const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  //   const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, fileName + fileExtension);
  // };
  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [submitForm, showFilter]);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      const from = dayjs().subtract(30, 'day').toISOString();
      const to = dayjs().endOf('date').toISOString();
      if (query?.search) setValue('search', query.search.toString());
      if (query?.state !== undefined) setValue('state', query.state);
      if (query?.method !== undefined) setValue('method', query.method.toString());
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
          search: query?.search ? query?.search : '',
          state:
            query?.state !== 'ALL'
              ? query?.state
              : [
                'SUCCEEDED',
                'PENDING',
                'CANCELED',
                'FAILED',
                'EXPIRED',
                'REFUNDED',
                'CANCELED_SUCCEEDED',
                'RECEIVED',
                'USED',
                'ESCROW',
                'CLAIMED',
                'DENIED',
                'AUTHORIZED',
              ],
          method: query?.method !== 'ALL' ? query?.method : '',
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

  const transactionStateOptions = transactionState.map((value) => ({
    value: value === 'ALL' ? '' : value,
    label: t(`${value}`),
  }));
  // console.log(transactionStateOptions);
  const transactionMethodOptions = transactionMethod.map((item) => ({
    value: item.payCode,
    label: t(`${item.name}`),
  }));

  return (
    <div className='box-search-transaction' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search' md='5' xl='4' sm='4'>
          <Form.Label>{t('Tìm kiếm')}</Form.Label>
          <Form.Control
            type='text'
            placeholder={t('Search transaction')}
            autoComplete='off'
            {...register('search')}
          />
        </Form.Group>
        <div className='form-group ml-3 form-date'>
          <Form.Label>{t('Duration')}</Form.Label>
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
          </div>
        </div>
        <Form.Group as={Col} className='form-MC-state' xl='2' md='4' sm='4'>
          <Form.Label>{t('State')}</Form.Label>
          <Controller
            control={control}
            name={'state'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 })
                }}
                defaultValue={{ value: '', label: t('ALL') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={transactionStateOptions}
                value={transactionStateOptions.find((val) => val.value === value)}
                placeholder=''
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-type' xl='2' md='4' sm='6'>
          <Form.Label>{t('Payment method')}</Form.Label>
          <Controller
            control={control}
            name={'method'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 })
                }}
                // defaultValue={{ value: '', label: t('ALL') }}
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
                // placeholder={i18next.language === 'vi' ? 'Không tìm được kết quả' : 'No options'}
                options={transactionMethodOptions}
                value={transactionMethodOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <div className='d-flex align-items-center mt-md-2 ml-3 search-button-group'>
          <button className='btn btn-primary btn-search'>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>

          <div className='btn-clear' onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>

          {/* <button
            type='button'
            className='btn disableHover '
            onClick={() => {
              // handleDownloadFile(transactionList, 'transactionManageExport');
            }}>
            <img src={`/assets/icon/export-icon.png`} alt='export=icon' />
            {t('Xuất file')}
          </button> */}
        </div>
      </Form>
    </div>
  );
}
