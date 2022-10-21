import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV3 from 'components/common/DatePickerCustom/DatePickerV3';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import useElementSize from 'hook/useElementSize';
import useWindowDimensions from 'hook/useWindowDimension';
import i18next from 'i18next';
import AsyncSelectMCAMuti from './AsyncSelectMulti';
// import { searchBalanceMerchantAction } from 'redux/actions/depositWithdrawAction';
import { useDispatch } from 'react-redux';
import updateURLParameter from 'utils/helpers/changeUrl';
export interface SearchParams {
  transactionId?: string;
  method?: string | null;
  change?: string | string[] | any;
  merchantId?: number,
  transactionType?: string
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchAccountantBalanceProps {
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

const transactionType = [
  { value: '', label: '-- Tất cả loại GD --' },
  { value: 'POBO', label: 'Chuyển tiền (POBO)' },
  { value: 'POBO_BULK', label: 'Tạo Ds chuyển (POBO_BULK)' },
  { value: 'WITHDRAW', label: 'Rút tiền (WITHDRAW)' },
  { value: 'TOPUP', label: 'Nạp tiền (TOPUP)' },
  { value: "CROSS_CHECK", label: 'Đối soát (CROSS_CHECK)', },
  { value: 'BUY_EMAIL', label: 'BUY_EMAIL' },
  { value: 'REFUND', label: 'REFUND' },
];

const dataType = [
  { value: '', label: '-- Cộng / trừ số dư --' },
  { value: '+', label: 'Cộng số dư' },
  { value: '-', label: 'Trừ số dư' },
];

export default function BoxSearchAccountantBalance({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  onChangeDateSearch,
  valuesSearch,
  paymentMethodList,
  setSubmitForm,
  isLoading
}: BoxSearchAccountantBalanceProps) {
  const { t, i18n } = useTranslation('common');
  const refState = useRef({});
  const router = useRouter();
  const dispatch = useDispatch()
  const { query }: any = useRouter();
  const refSelect = useRef<any>();
  const defaultValue = {
    change: '',
    method: '',
    createdAt: {
      from: dayjs().subtract(5, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },

  }
  const [initialValue, setInitialValue] = useState<any>(defaultValue)
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors, watch } =useForm<SearchParams>({
      defaultValues: useMemo(() => { return initialValue; }, [initialValue]), });
  useEffect(() => {reset();reset(initialValue);}, [initialValue]);
  useEffect(() => {
    if (!(Object.keys(router.query).length === 0)) {
      let payload: any = {
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
        crossChecktype: router.query?.crossChecktype,
        isTransferWeekend: router.query?.isTransferWeekend,
        state: router.query?.state,
        txtSearch: router.query?.txtSearch,
        transactionId: router.query?.transactionId,
        ...(Boolean(router.query?.merchantId) && { merchantId: router.query?.merchantId }),
      };
      setInitialValue(payload);
      handleSubmitSearch(payload);
    } else {
      // setSubmitForm(true);
      handleSubmitSearch && handleSubmitSearch(defaultValue);
    }
  }, []);
  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    if (!data?.createdAt.from) { data.createdAt.from = defaultValue.createdAt.from }
    if (!data?.createdAt.to) data.createdAt.to = defaultValue.createdAt.to
    if (!data?.createdAt.to && !data?.createdAt.from) data['createdAt'] = defaultValue.createdAt
    data?.merchantId === -1 && delete data.merchantId;
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
    router.replace('/cong-thanh-toan/lich-su-thay-doi-so-du', undefined, { shallow: true });
    setInitialValue(defaultValue);
    handleClearForm && handleClearForm();

  };

  useEffect(() => {
    if (!(Object.keys(router.query).length === 0)) {
      let payload: any = {
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
        crossChecktype: router.query?.crossChecktype,
        isTransferWeekend: router.query?.isTransferWeekend,
        state: router.query?.state,
        txtSearch: router.query?.txtSearch,
        transactionId: router.query?.transactionId,
        ...(Boolean(router.query?.merchantId) && { merchantId: +(router?.query?.merchantId as string) }),
      };
      setInitialValue(payload);
      handleSubmitSearch(payload);

    }

  }, [router.query]);


  return (
    <>{showFilter && <div className='box-search-transaction' >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-search' md='4' xl='2' sm='4'>
          {/* <Form.Label>{t('Tìm kiếm')}</Form.Label> */}
          <Form.Control
            type='text'
            placeholder={t('Nhập :Mã giao dịch')}
            autoComplete='off'
            {...register('transactionId')}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state' xl='3' md='4' sm='4'>
          {/* <Form.Label>{t('Tìm MerchantId')}</Form.Label> */}
          <AsyncSelect
            asyncType='MERCHANT'
            control={control}
            clearError={clearErrors}
            name='merchantId'
            keyReturn='merchantId'
            initLabel=''
            placeHolder='Nhập để tìm Merchant'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state' xl='3' md='6' sm='4'>
          {/* <Form.Label>{t('Tìm Merchant không export')}</Form.Label> */}
          <AsyncSelectMCAMuti
            control={control}
            clearError={clearErrors}
            name='excludeMerchant'
            refSelect={refSelect}
            placeHolder='Chọn merchant không export'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state' xl='2' md='3' sm='4'>
          {/* <Form.Label>{t('State')}</Form.Label> */}
          <Controller
            control={control}
            name={'change'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
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
                options={dataType}
                value={dataType.find((val) => val.value === value)}
                placeholder=''
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-type' xl='2' md='3' sm='6'>
          {/* <Form.Label>{t('Payment method')}</Form.Label> */}
          <Controller
            control={control}
            name={'transactionType'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
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
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                placeholder={'Merchant không export'}
                options={transactionType}
                value={transactionType.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <div className='form-group ml-3 form-date form-search' >
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <div className='date-picker-custom'>
            <DatePickerCustomV3 placeholder={'DD/MM/YYYY HH:mm:ss'} control={control} />
          </div>
        </div>
        <div className='d-flex align-items-center ml-3 search-button-group' style={{marginTop:'-6px '}}>
          <button className='btn btn-primary btn-search' disabled={isLoading}>
            {isLoading ? (
              <i className='fa fa-spinner fa-spin'></i>
            ) : (
              <i className='fas fa-search'></i>
            )}
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
    </div>}</>

  );
}
