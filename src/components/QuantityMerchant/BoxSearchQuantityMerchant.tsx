// import AsyncSelectMerchant from 'components/common/AsyncSelect/AsyncSelect';
import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
dayjs.extend(utc);
interface BoxSearchQuantityMerchantProps {
  showFilter?: boolean;
  handleSubmitSearch?: (data: any) => void;
  submitForm: boolean;

  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any;
  checkUpdate?: boolean;
  handleCheckUpdate?: (value: boolean) => void;
  typeDate?: String;
  onResetIndexTab?: () => void;
  loading?: boolean | any;
  saleMembers?:any;
}
const BoxSearchQuantityMerchant = ({
  showFilter,
  handleSubmitSearch,
  submitForm,
  onResetIndexTab,
  setSubmitForm,
  loading,
  saleMembers
}: BoxSearchQuantityMerchantProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();

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
        from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
  });

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    onResetIndexTab && onResetIndexTab();
    handleSubmitSearch && handleSubmitSearch(getValues());
  };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
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
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      operator:+router.query?.operator!,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  return (
    <>
      {showFilter && (
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
            <AsyncSelect
              asyncType='MCCODE'
              control={control}
              clearError={clearErrors}
              name='categoryCode'
              keyReturn='code'
              returnType='text'
              initLabel='Danh sách ngành nghề'
              {...{
                className: 'search-merchant-category-select',
                classNamePrefix: 'merchant-category-async-select',
              }}
            />
          </div>

          <div className='form-search'>
            <Controller
              control={control}
              name={'operator'}
              defaultValue={''}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 99 }),
                    menu: (provided) => ({ ...provided, zIndex: 99 }),
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
                  placeholder={'Chọn nhân viên Sale'}
                  options={saleMembers}
                  value={
                    saleMembers?.find((val: any) => {
                      return val.value === value;
                    }) || ''
                  }
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
                <DatePickerCustomV2  control={control} />
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
      )}
    </>
  );
};

export default BoxSearchQuantityMerchant;
