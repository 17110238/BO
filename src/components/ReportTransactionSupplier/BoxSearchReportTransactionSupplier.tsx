import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { OptionsOrGroups, SingleValue } from 'react-select';
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

  // fullname: { required: true, minLength: 3, maxLength: 30, isUserName: true, trim: true, },
  // email: { required: true, isEmail: true },
};

// import DatePickerCustomNew from 'components/common/DatePickerCustom/DatePickerCustomNew';
export interface SearchParams {
  apiType?: string | any;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchReportSupplierProps {
  showFilter?: boolean;
  handleSubmitSearch?: (data: any) => void;
  submitForm: boolean;
  setSubmitForm?: (a: boolean) => void;
  boxSearchRef?: any;
  checkUpdate?: boolean;
  handleCheckUpdate?: (value: boolean) => void;
  optionsApplication?: string[] | any;
  onReSet?: () => void;
  loading?: any;
}

export default function BoxSearchReportSupplier({
  handleSubmitSearch,
  submitForm,
  optionsApplication,

  boxSearchRef,
  loading,
  onReSet,
}: BoxSearchReportSupplierProps) {
  const { t } = useTranslation('common');
  const { query }: any = useRouter();
  const router = useRouter();
  const dispatch = useDispatch();
  const refSelect = useRef<any>();

  const stateOption: OptionsOrGroups<any, any> | undefined = [];
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
  } = useForm<any>({
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
  });

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
    // console.log(`${ baseURL + '?' + newAdditionalURL + rows_txt}`,"dollllllllllllllllllllllllllllllllllllll")
    return baseURL + '?' + newAdditionalURL + rows_txt;
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    onReSet && onReSet()
    handleSubmitSearch && handleSubmitSearch({});
  };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
    //xóa đi những giá trị mình không có để làm navigate link cho đẹp hơn
    Object.entries(data).forEach((value) => {
      // console.log(value);
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
    <div className=' ' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-search'>
          <Controller
            control={control}
            name={'apiType'}
            defaultValue={''}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              // console.log('errrrrrrrrrrrrr', error);
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
                  className='classname'
                  options={optionsApplication}
                  value={
                    optionsApplication?.find((val: any) => {
                      return val.value === value;
                    }) || ''
                  }
                  placeholder={'--Tất cả nhà cung cấp--'}
                  noOptionsMessage={() => {
                    return t('Không có kết quả tìm kiếm');
                  }}
                  onMenuOpen={() => {
                    clearErrors('apiType');
                  }}
                  onChange={(e: SingleValue<any>) => {
                    onChange(e.value);
                    clearErrors('apiType');
                  }}
                />
              );
            }}
          />
        </div>

        <div className='form-search'>
          <div className=' form-date'>
            <div className='date-picker-custom'>
              <DatePickerCustomV2
                rules={{ from: { required: true }, to: { required: true } }}
             
                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
                `}
                control={control}
                dateFormat={'dd/MM/yyyy'}
              />
            </div>
          </div>
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
