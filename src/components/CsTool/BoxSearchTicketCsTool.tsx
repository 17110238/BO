import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import {
  statusOptions
} from 'components/CsTool/AddTicket/index';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
dayjs.extend(utc);

const rulesForm = {
  phone: {
    isVNumber: true,
    isPhoneNumber: true,
    require: false,
  },

  email: { required: false },
};

export interface SearchParams {
  phone?: number | string;
  state?: string;
  email?: string | any;
  merchantId?: string | any;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchDashBoardSupportTicketProps {
  showFilter?: boolean;
  handleSubmitSearch?: (data: any) => void;
  submitForm: boolean;
  loading?: any;
  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any;
  checkUpdate?: boolean;
  handleCheckUpdate?: () => void;
}

export default function BoxSearchSupportTicketCsTool({
  handleSubmitSearch,
  submitForm,
  loading,
  setSubmitForm,
  boxSearchRef,

}: BoxSearchDashBoardSupportTicketProps) {
  const { t } = useTranslation('common');
  const { query }: any = useRouter();
  const router = useRouter();

  const {
    register,
    getValues,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      createdAt: {
        // from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        // to: dayjs().endOf('date').utc().format(),
      },
    },
  });

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    handleSubmitSearch && handleSubmitSearch({});
  };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
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
    handleSubmitSearch && handleSubmitSearch(data);
  };

  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [submitForm]);

  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);
  
  return (
    <div className='box-search-supplier ' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-search'>
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
        </div>

        <div className='form-search'>
          <Form.Control
            type='text'
            placeholder={t('Số điện thoại liên hệ')}
            autoComplete='off'
            {...register('phone')}
          />
        </div>

        <div className='form-search'>
          <Form.Control
            type='email'
            placeholder={t('Nhập email')}
            autoComplete='off'
            {...register('email')}
          />
        </div>

        <div className='form-search'>
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
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={statusOptions}
                value={statusOptions.find((val: any) => {
                  return val.value === value;
                }) || ""}
                placeholder="Chọn trạng thái"
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </div>

        <div className='form-search'>
          <div className=' form-date'>
            <div className='date-picker-custom'>
              <DatePickerCustomV2 control={control} />
            </div>
          </div>
        </div>

        <div className='form-search form-search-button'>
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
