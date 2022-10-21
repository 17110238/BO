import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue, components  } from 'react-select';
import { clearDataSupplierManage } from 'redux/actions/supplierManageActions';
import customStyless from 'utils/helpers/customStylesForReactSelect';
import { customStyles } from 'components/common/ModalCustomerSupport/ModalUpdateTicketCustomerSupport';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
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

const supplierTypeCode = [
  { label: 'Mã đơn hàng', value: 'transactionId' },
  { label: 'Mã thanh toán', value: 'paymentId' },
  { label: 'Mã giao dịch nhà cung cấp', value: 'supplierTransaction' },
  { label: 'Mã giao dịch đối tác', value: 'partnerTransaction' },
  { label: 'Số tiền', value: 'amount' },
];

export interface SearchParams {
  supplierId?: number | string;
  merchantId?: number | string;
  searchText?: string | string[];
  searchType?:string |any;
  method?: string | null;
  state?: string | string[] | any;
  createdAt?: {
    from?: any;
    to?: any;
  };
  loading?: any;
}
interface BoxSearchSupplierProps {
  showFilter?: boolean;
  valuesSearch?: any;
  submitForm?: boolean;
  handleSubmitSearch?: (data: any) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any;
  handleClearSupplierManage?: () => void;
  loading?: any;
}

function BoxSearchSupplier({
  handleSubmitSearch,
  boxSearchRef,
  handleClearForm,
  submitForm,
  handleClearSupplierManage,
  setSubmitForm,
  loading,
}: BoxSearchSupplierProps) {
  const { t } = useTranslation('common');
  const { query }: any = useRouter();
  const router = useRouter();
  const dispatch = useDispatch();
  const refSelect = useRef<any>();
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } = useForm<any>(
    {
      defaultValues: {
        createdAt: {
          from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('date').utc().format(),
        },
      },
    }
  );

  const supplierList: any = useSelector<any>(
    (state) => state?.supplierManageReducers?.supplierInfoArray
  );
  const [supplierId, setSupplierId] = useState(null);
  const [methodOptions, setMethodOptions] = useState([]);
  const [merchant, setMerchantOption] = useState([]);

  useEffect(() => {
    let supid = supplierId || query?.supplierId;
    let findd = supplierList.find((e: any) => e.id === +supid);

    let methodOtions = findd?.issuerList.map((e: any) => ({
      label: e.methodName,
      value: e.payCode,
    }));

    setMethodOptions(methodOtions);
  }, [supplierId, query?.supplierId]);

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    dispatch(clearDataSupplierManage());
    handleClearSupplierManage && handleClearSupplierManage();
    reset();

    handleClearForm && handleClearForm();
    setMerchantOption([]);
    setMethodOptions([]);
    handleSubmitSearch &&
      handleSubmitSearch({
        createdAt: {
          // from: dayjs().subtract(30, 'day').toISOString(),
          // to: dayjs().endOf('date').toISOString(),
        },
      });
  };

  const onSubmit: SubmitHandler<any> = async (data: any, e) => {
    e?.preventDefault();
    //xóa đi những giá trị mình không có để làm navigate link cho đẹp hơn
    if (!data.supplierId) return;
    Object.entries(data).forEach((value) => {
      if (!value[1]) {
        delete data[value[0]];
      }
    });

    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };

    delete temp.createdAt;
    if (!temp.from) {
      delete temp.from;
    }
    if (!temp.to) {
      delete temp.to;
    }
    let payload = { ...temp };
     handleReplaceUrl(payload, router);
    // console.log('=============data', data);
    handleSubmitSearch && handleSubmitSearch(data);
  };

  let optionsSupplier: any = supplierList?.map((data: any) => ({
    value: data.id,
    label: t(data.supplierName),
  }));

  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      supplierId: +router.query?.supplierId!,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  const transactionStateOptions = transactionState.map((value) => ({
    value: value === 'ALL' ? '' : value,
    label: value === "ALL"?"Tất cả trạng thái" : t(`${value}`),
  }));

  return (
    <div className='box-search-supplier' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-search'>
          {' '}
        
          <Controller
            control={control}
            name={'supplierId'}
            defaultValue={''}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 9999999 }),
                  menu: (provided) => ({ ...provided, zIndex: 9999999 }),
                  control: (provided, state) => ({
                    ...provided,
                    border: `${error ? '1px solid red' : 'none'}`,
                    background: '#EFF2F7 !important',
                    borderRadius: '12px',
                    padding: '0px 10px',
                    color: `${error ? 'red' : 'none'}`,
                    height: '40px',
                    minWidth: '107px',
                  }),
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
                onMenuOpen={() => {
                  clearErrors('supplierId');
                  
                }}
                options={optionsSupplier}
                value={
                  optionsSupplier?.find((val: any) => {
                    return val.value === value;
                  }) || ''
                }
                placeholder={t('Chọn nhà cung cấp')}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                  setSupplierId(e.value);
                  setValue('method', '');
                }}
              />
            )}
          />
        </div>

        <div className='form-search'>
          {' '}
          
          <Controller
            control={control}
            name={'method'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyless,
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
                options={methodOptions}
                value={
                  methodOptions?.find((val: any) => {
                    return val.value === value;
                  }) || ''
                }
                placeholder={t('Tất cả Phương thức')}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </div>

        <div className='form-search'>
          {' '}
     
          <AsyncSelect
            control={control}
            clearError={clearErrors}
            name='merchantId'
            keyReturn='merchantId'
            placeHolder='Nhập để tìm Merchant'
            asyncType='MERCHANT'
            {...{
              className: 'search-merchant-select',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </div>

        <div className='form-search'>
   
          <div className='groups-inputs-search-type'>
            <Form.Control
              type='text'
              placeholder={t('Tìm kiếm')}
              autoComplete='off'
              className='form'
              {...register('searchText')}
            />
            <Controller
              control={control}
              name={'searchType'}
              // defaultValue={supplierTypeCode[0].value}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  className="react-select-groups"
                  classNamePrefix="react-select-groups"
                  styles={{
                    ...customStyles,
                    control: (provided: any, state: any) => ({
                      ...provided,
                      border: 'none',
                      background: 'none',
                      borderRadius: '12px',
                      color: '#00be00',
                      height: '40px',
                      boxShadow: 'none',
                      
                    }),
                  }}
                  options={supplierTypeCode}
                  value={supplierTypeCode.find((val: any) => val.value === value)}
                  placeholder={t('Chọn mã ')}
                  noOptionsMessage={() => {
                    return t('Không có kết quả tìm kiếm');
                  }}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </div>
        </div>

        <div className='form-search'>
          <div className=' form-date'>
        
            <div className='date-picker-custom'>
              <DatePickerCustomV2  control={control} />
            </div>
          </div>
        </div>
        <div className='form-search'>
       
          <Controller
            control={control}
            name={'state'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyless,
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
                options={transactionStateOptions}
                value={transactionStateOptions.find((val: any) => {
                  return val.value === value;
                })}
                placeholder={t('All')}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </div>

        <div className='d-flex align-items-end form-search'>
          <button className='btn btn-primary btn-search' disabled={loading}>
            {!loading && (
              <>
                <i className='fas fa-search'></i>
                Tìm kiếm
              </>
            )}
            {loading && <i className='fas fa-spinner fa-pulse'></i>}
          </button>
          <div
            className={`btn btn-clear btn-search ${loading ? 'btn--disabled' : ''}`}
            onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>Xóa
          </div>
        </div>
      </Form>
    </div>
  );
}

export default BoxSearchSupplier;
