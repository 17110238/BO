import DatePickerBackUp from 'components/common/DatePickerCustom/DatePickerBackUp';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useState } from 'react';
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
enum DateTypeReportKycEnum {
  DATE = 'DATE',
  MONTH = 'MONTH',
}
const stateOption = [
  { label: 'Ngày', value: DateTypeReportKycEnum.DATE },
  { label: 'Tháng', value: DateTypeReportKycEnum.MONTH },
];
export interface SearchParams {
  dateType?: string | any;
  appId?: string | any;

  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchReportKycProps {
  showFilter?: boolean;
  handleSubmitSearch?: (data: any) => void;
  submitForm: boolean;
  setSubmitForm?: (a: boolean) => void;
  boxSearchRef?: any;
  checkUpdate?: boolean;
  handleCheckUpdate?: (value: boolean) => void;
  optionsApplication?: string[] | any;
  onReSetKYC?: () => void;
  loading?: any;
}

export default function BoxSearchLoginHistory({
  handleSubmitSearch,
  submitForm,
  optionsApplication,

  boxSearchRef,
  loading,
  onReSetKYC,
}: BoxSearchReportKycProps) {
  const { t } = useTranslation('common');
  const { query }: any = useRouter();
  const router = useRouter();
  const [checkMonth, setCheckMonth] = useState<boolean>(false);

  const {
    register,
    getValues,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<SearchParams>({
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
  });

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    onReSetKYC && onReSetKYC();
    setCheckMonth(false);
    handleSubmitSearch && handleSubmitSearch({});
  };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
    //xóa đi những giá trị mình không có để làm navigate link cho đẹp hơn
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
      appId: +router.query?.appId!,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  useEffect(() => {
    if (query?.dateType === DateTypeReportKycEnum.DATE) {
      setCheckMonth(false);
    }
    if (query?.dateType === DateTypeReportKycEnum.MONTH) {
      setCheckMonth(true);
    }
  }, []);

  return (
    <div className='box-search-login-history ' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-search'>
          <Controller
            control={control}
            name={'dateType'}
            defaultValue={stateOption[0]?.value}
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
                options={stateOption}
                value={stateOption.find((val: any) => {
                  return val.value === value;
                })}
                placeholder={'Điều kiện tìm'}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                  if (e.value === DateTypeReportKycEnum.DATE) {
                    setCheckMonth(false);
                  }
                  if (e.value === DateTypeReportKycEnum.MONTH) {
                    setCheckMonth(true);
                  }
                }}
              />
            )}
          />
        </div>

        <div className='form-search'>
          <div className=' form-date'>
            <div className='date-picker-custom'>
              {!checkMonth ? (
                <DatePickerCustomV2
                  rules={{ from: { required: true }, to: { required: true } }}
                  placeholder={'dd/MM/yyyy HH:mm'}
                  className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
                `}
                  control={control}
                />
              ) : (
                <DatePickerBackUp
                  rules={{ from: { required: true }, to: { required: true } }}
                  placeholder={'MM/YYYY'}
                  className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
                `}
                  control={control}
                  dateFormat={'MM/yyyy'}
                />
              )}
            </div>
          </div>
        </div>

        <div className='form-search'>
          <Controller
            control={control}
            name={'appId'}
            defaultValue={''}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 }),
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
                  className='react-select'
                  classNamePrefix='react-select'
                  options={optionsApplication}
                  value={
                    optionsApplication?.find((val: any) => {
                      return val.value === value;
                    }) || ''
                  }
                  placeholder={'--Tất cả ứng dụng--'}
                  noOptionsMessage={() => {
                    return t('Không có kết quả tìm kiếm');
                  }}
                  onMenuOpen={() => {
                    clearErrors('appId');
                  }}
                  onChange={(e: SingleValue<any>) => {
                    onChange(e.value);
                    clearErrors('appId');
                  }}
                />
              );
            }}
          />
        </div>

        <div className='form-search form-search-button'>
          <button className='btn btn-primary btn-search' disabled={loading}>
            {!loading && (
              <>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
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
