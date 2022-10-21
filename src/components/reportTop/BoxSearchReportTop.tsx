import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import updateURLParameter from 'utils/helpers/changeUrl';
import { getpaymentMethodList } from 'redux/actions';
export interface SearchParams {
  transactionId?: string;
  method?: string | null;
  change?: string | string[] | any;
  merchantId?: number,
  formula?: string,
  transactionType?: string,
  type?:string,
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
const formula = [
  { value: 'MAX', label: 'Giá trị giao dịch lơn nhất (MAX)' },
  { value: 'SUM', label: 'Tổng giá trị giao dịch lớn nhất(SUM)' },
  {value:'COUNT',label:'Số lượng giao dịch nhiều nhất(COUNT)'}
];
export default function BoxSearchReportTop({
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
    formula: 'MAX',
    createdAt: {
      from: dayjs().subtract(5, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
    type:"TOPUP"

  }
  const [initialValue, setInitialValue] = useState<any>(defaultValue);
  const checkPaymentMe: [] = useSelector<any, []>((state) => state?.utility?.paymentMethods);
  const paymentMethods = checkPaymentMe.filter((item: any, index) => {
    if (item?.name && item?.payCode && item.paymentType !== "FOLDER") { return item; }
  }).map((item: any, index) => {
    return { label: item.name, value: item.payCode }
  });
  const paymentMethodsMemo = useMemo(() => [{ label: " --Tất cả phương thức ---", value: "" }, ...paymentMethods], [paymentMethods]);
  const typeTransaction = useMemo(()=>[{ label: "Nạp", value: "TOPUP" },{ label: " Thanh toán", value: "PAYMENT" },{ label: "Chi hộ", value: "POBO" }],[])
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors, watch, formState: { errors } } =
    useForm<SearchParams>({
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),

    });
  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (checkPaymentMe?.length == 0) { dispatch(getpaymentMethodList((status, res) => { })); }
    if (!(Object.keys(router.query).length === 0)) {
      let payload: any = {
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
        method: router.query?.method,
        formula: router.query?.formula,
        type:router.query?.type,
        ...(Boolean(router.query?.merchantId) && { merchantId: router.query?.merchantId }),
      };
      setInitialValue(payload);
      handleSubmitSearch(payload);
    } else {
      // setSubmitForm(true);
      handleSubmitSearch && handleSubmitSearch(defaultValue);
    }
  }, []);

  //   useEffect(() => {
  //     const subscription = watch((value, { name, type }) => console.log(value, name, type));
  // }, [watch('merchantId')]);

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
    router.replace('/cong-thanh-toan/thong-ke-top', undefined, { shallow: true });
    setInitialValue(defaultValue);
    handleSubmitSearch(defaultValue);
    handleClearForm && handleClearForm();
  };

  useEffect(() => {
    if (!(Object.keys(router.query).length === 0)) {
      let payload: any = {
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
        method: router.query?.method,
        formula: router.query?.formula,
        type:router.query?.type,
        ...(Boolean(router.query?.merchantId) && { merchantId: +(router?.query?.merchantId as string) }),
      };
      setInitialValue(payload);
      handleSubmitSearch(payload);

    }

  }, [router.query]);
  useEffect(() => {
    if (checkPaymentMe?.length == 0) { dispatch(getpaymentMethodList((status, res) => { })); }

  }, []);

  return (
    <>{showFilter && <div className='box-search-transaction' >
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <Form.Group as={Col} className='form-MC-type' xl='2' md='3' sm='6'>
          {/* <Form.Label>{t('Payment method')}</Form.Label> */}
          <Controller
            control={control}
            name={'method'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
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
                placeholder={'Chọn phương thức'}
                options={paymentMethodsMemo}
                value={paymentMethodsMemo.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-type' xl='1' md='3' sm='6'>
          {/* <Form.Label>{t('Payment method')}</Form.Label> */}
          <Controller
            control={control}
            name={'type'}
           // defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
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
                placeholder={'Chọn loại giao dịch'}
                options={typeTransaction}
                value={typeTransaction.find((val) => val.value === value)|| ''}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state' xl='2' md='3' sm='4'>
          {/* <Form.Label>{t('State')}</Form.Label> */}
          <Controller
            control={control}
            name={'formula'}
            defaultValue={'MAX'}
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
                options={formula}
                value={formula.find((val) => val.value === value)}
                placeholder=''
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </Form.Group>
        <div className='form-group form-date form-search'>
          {/* <Form.Label>{t('Duration')}</Form.Label> */}
          <div className='date-picker-custom'>
            <DatePickerCustomV2 rules={{ from: { required: true }, to: { required: true } }}
              placeholder={'dd/MM/yyyy HH:mm'}
              className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                                            ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}`}
              control={control} />
          </div>
        </div>
        <div className='d-flex ml-2 search-button-group' >
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
        </div>
      </Form>
    </div>}</>

  );
}
