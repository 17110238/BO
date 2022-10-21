import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import DatePickerCustomV3 from 'components/common/DatePickerCustom/DatePickerV3';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { customStylesV1 } from 'utils/helpers/changeUrl';
dayjs.extend(utc);


export interface SearchParams {
  merchantId?: number;
  crossChecktype?: string;
  paymentMethod?: string;
  isTransferWeekend?: boolean;
  txtSearch?: string;
  typeSearch?: string;
  search?: string | string[];
  state?: string;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchAccountantProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  isLoading: boolean;
}

const transactionState = [
  { label: ' ---- Tất cả GD  ----', value: '' },
  { label: 'Chờ thanh toán', value: 'PENDING' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Đã gửi tiền', value: 'DEPOSITED' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
  { label: 'Hủy thanh toán', value: 'CANCELED' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Tạm ngưng', value: 'PAUSED' },
];

const transcactionType = [
  { label: ' Mã Giao dịch đối soát', value: 'tranId' },
  { label: ' Tên đăng nhập doanh nghiệp', value: 'mcUsername' },
  { label: ' Tên tài khoản doanh nghiệp', value: 'mcAccountName' },
  { label: ' Số tài khoản ngân hàng doanh nghiệp', value: 'mcBankNumber' },
  { label: ' Mã giao dịch ngân hàng', value: 'tranBank' },
];
const weekendType = [
  { label: ' Có', value: true },
  { label: 'Không', value: false },
];
const transactionDeposit = [
  { label: ' Tất cả', value: '' },
  { label: 'Tự động', value: 'AUTO' },
  { label: ' Thông thường', value: 'MANUAL' },
  { label: ' Tắt', value: 'OFF' },
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
  isLoading,
}: BoxSearchAccountantProps) {
  const { t, i18n } = useTranslation('common');
  const refState = useRef({});
  const router = useRouter();
  const { query }: any = useRouter();
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
    typeSearch: 'tranId',
    state: '',
  }
  const [initialValue, setInitialValue] = useState<any>(defaultValue)
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors, watch } = useForm<SearchParams>({ defaultValues: defaultValue});
  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);
  const convertedPaymentMethodList: any = paymentMethodList?.filter(
    (method: any) => method.payCode
  );
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
    if (!data?.createdAt.from) { data.createdAt.from = defaultValue.createdAt.from }
    if (!data?.createdAt.to) data.createdAt.to = defaultValue.createdAt.to
    if (!data?.createdAt.to && !data?.createdAt.from) data['createdAt'] = defaultValue.createdAt
    let payload: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key && value) {
        payload[key] = value;
      }
    }
    let temp = {
      ...payload,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };

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
    setValue('createdAt', { from: payload.createdAt.from, to: payload.createdAt.to });

    handleSubmitSearch && handleSubmitSearch(payload);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('/cong-thanh-toan/doi-soat-doanh-nghiep', undefined, { shallow: true });
    reset();
    setInitialValue(defaultValue);
    handleClearForm && handleClearForm();
    handleSubmitSearch && handleSubmitSearch(defaultValue);
  };
  useEffect(() => {
    if (!(Object.keys(router.query).length === 0)) {
      let payload: any = {
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
        typeSearch: router.query?.typeSearch,
        crossChecktype: router.query?.crossChecktype,
        isTransferWeekend: router.query?.isTransferWeekend,
        state: router.query?.state,
        txtSearch: router.query?.txtSearch,
        ...(Boolean(router.query?.merchantId) && { merchantId: router.query?.merchantId }),
      };
      setInitialValue(payload)
      handleSubmitSearch(payload);
    }

  }, [router.query]);


  useEffect(() => {
    if (!(Object.keys(router.query).length === 0)) {
      let payload: any = {
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
        typeSearch: router.query?.typeSearch,
        crossChecktype: router.query?.crossChecktype,
        isTransferWeekend: router.query?.isTransferWeekend,
        state: router.query?.state,
        txtSearch: router.query?.txtSearch,
        ...(Boolean(router.query?.merchantId) && { merchantId: router.query?.merchantId }),
      };
      setInitialValue(payload)


      handleSubmitSearch(payload);
    } else {
      handleSubmitSearch && handleSubmitSearch(defaultValue);
    }
    //  setSubmitForm(true);
    //   let payload: any = {
    //     createdAt: {
    //       from: router.query?.from,
    //       to: router.query?.to,
    //     },
    //     crossChecktype: router.query?.crossChecktype,
    //     isTransferWeekend: router.query?.isTransferWeekend,
    //     state: router.query?.state,
    //     txtSearch: router.query?.txtSearch,
    //     ...(Boolean(router.query?.merchantId) && { merchantId: router.query?.merchantId }),
    //   };
    //   handleSubmitSearch && handleSubmitSearch(payload);
  }, []);
  return (
    <>
      {showFilter && <div className='box-search-transaction'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Col} className='form-search' md='5' xl='4' sm='4'>
            {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
            <Form.Control
              type='text'
              placeholder={t('Tìm kiếm: mã GD, tài khoản MC')}
              autoComplete='off'
              {...register('txtSearch')}
            />
          </Form.Group>
          <Form.Group as={Col} className='form-MC-state' xl='2' md='4' sm='4'>
            {/* <Form.Label>{t('Mã giao dịch đối soát')}</Form.Label> */}
            <Controller
              control={control}
              name={'typeSearch'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStylesV1,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={transcactionType}
                  value={transcactionType.find((val) => val.value === value)}
                  placeholder=''
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} className='form-MC-state' xl='2' md='4' sm='4'>
            {/* <Form.Label>{t('Doanh nghiệp')}</Form.Label> */}
            <AsyncSelect
              asyncType='MERCHANT'
              control={control}
              clearError={clearErrors}
              name='merchantId'
              keyReturn='merchantId'
              {...{
                className: 'search-merchant-select',
                classNamePrefix: 'account-async-select',
              }}
            />
          </Form.Group>

          <Form.Group as={Col} className='form-MC-state' xl='2' md='4' sm='4'>
            {/* <Form.Label>{t('Loại giao dịch')}</Form.Label> */}
            <Controller
              control={control}
              name={'state'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStylesV1,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={transactionState}
                  value={transactionState.find((val) => val.value === value)}
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} className='form-MC-type' xl='2' md='4' sm='6'>
            {/* <Form.Label>{t('Loại đối soát')}</Form.Label> */}
            <Controller
              control={control}
              name={'crossChecktype'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStylesV1,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  placeholder={'Loại đối soát'}
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  options={transactionDeposit}
                  value={transactionDeposit.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} className='form-MC-type' xl='2' md='4' sm='6'>
            {/* <Form.Label>{t('Chuyển cuối tuần')}</Form.Label> */}
            <Controller
              control={control}
              name={'isTransferWeekend'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStylesV1,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
                  }}
                  // defaultValue={weekendType[0]}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  placeholder={'Chuyển cuối tuần'}
                  noOptionsMessage={() => {
                    return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                  }}
                  options={weekendType}
                  value={weekendType.find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <div className='form-group form-date'>
            {/* <Form.Label>{t('Duration')}</Form.Label> */}
            <div className='date-picker-custom'>
              <DatePickerCustomV3 placeholder={'DD/MM/YYYY HH:mm:ss'} control={control} />
            </div>
          </div>
          <div className='d-flex   ml-3 search-button-group'>
            <button className='btn btn-primary btn-search' disabled={isLoading}>
              {isLoading ? (
                <i className='fa fa-spinner fa-spin'></i>
              ) : (
                <i className='fas fa-search'></i>
              )}
              {/* <i className='fas fa-search'></i> */}
              {t('Tìm kiếm')}
            </button>
            <div className='btn-clear' onClick={onClearForm}>
              <i className='fas fa-eraser mr-2'></i>
              {t('Clear')}
            </div>
          </div>
        </Form>
      </div>

      }</>

  );
}
