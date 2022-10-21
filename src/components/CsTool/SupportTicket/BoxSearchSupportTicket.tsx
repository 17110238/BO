import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { statusOptions, assignTargetOptions } from 'components/CsTool/AddTicket/index';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
dayjs.extend(utc);
export interface ReactSelectConfig {
  value:string;
  label:string;
  data?:any;
}
export interface SearchParams {
  id?: number | any;
  contactPhone?: number | string;
  status?: string;
  ticketType?: string | any;
  assignTarget?: string | any;
  method?: string;
  classify?: string;
  category?: string;
  createdAt?: {
    from?: any;
    to?: any;
  };
}
interface BoxSearchSupportTicketProps {
  showFilter?: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  submitForm: boolean;
  loading?: any;
  setSubmitForm?: (a: boolean) => void;
  boxSearchRef: any;
  supportStaff?: string[];
}

export default function BoxSearchSupportTicket({
  showFilter,
  handleSubmitSearch,
  submitForm,
  loading,
  setSubmitForm,
  boxSearchRef,
  supportStaff,
}: BoxSearchSupportTicketProps) {
  const { t } = useTranslation('common');
  const { query }: any = useRouter();
  const router = useRouter();
  const dataFilterValue: any = useSelector<any>((state) => state?.customerSupport?.listFilterValue);
  const [classify, setClassify] = useState<ReactSelectConfig[]>([]);
  const [cateGory, setCateGory] = useState<ReactSelectConfig[]>([]);
  const [method, setMethod] = useState<ReactSelectConfig[]>([]);

  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } = useForm<any>(
    {
      defaultValues: {
        createdAt: {
          // from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
          // to: dayjs().endOf('date').utc().format(),
        },
      },
    }
  );

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    setCateGory([]);
    setMethod([]);
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

  useEffect(() => {
    let classifyChane = dataFilterValue?.map((el: any) => ({
      value: el.key,
      label: el.value,
    }));
    setClassify(classifyChane);
    if (query?.classify) {
      let a;
      a = dataFilterValue.find((el: any) => {
        return el.key === query?.classify;
      });

      setCateGory(
        a?.classifyData.map((el: any) => ({
          value: el.key,
          label: el.value,
          data: el.methodData,
        }))
      );

      let b = a?.classifyData
        ?.find((el: any) => {
          return el.key === query?.category;
        })
        ?.methodData?.map((el: any) => ({
          value: el.key,
          label: el.value,
        }));
      b?.length > 0 && setMethod(b);
    }
  }, []);

  return (
    <div className='box-search-suport-ticket' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-search'>
          <Form.Control
            type='text'
            placeholder={t('Nhập Ticket ID')}
            autoComplete='off'
            {...register('ticketId')}
          />
        </div>
        <div className='form-search'>
          <Form.Control
            type='text'
            placeholder={t('Nhập SĐT liên hệ')}
            autoComplete='off'
            {...register('contactPhone')}
          />
        </div>
        <div className='form-search'>
          <Form.Control
            type='text'
            placeholder={t('Nhập SĐT tài khoản')}
            autoComplete='off'
            {...register('customerPhone')}
          />
        </div>

        <div className='form-search'>
          <Form.Control
            type='text'
            placeholder={t('Nhập email')}
            autoComplete='off'
            {...register('customerEmail')}
          />
        </div>

        <div className='form-search'>
          <Controller
            control={control}
            name={'classify'}
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
                className='react-select'
                classNamePrefix={'react-select'}
                options={classify}
                value={classify?.find((val: any) => val.value === value) || ''}
                placeholder={'Chọn danh mục'}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                  console.log(e.value, dataFilterValue);

                  let choseclassIf = dataFilterValue?.filter((el: any) => {
                    return el.key === e.value;
                  });
                  let chooseCateGory = choseclassIf[0]?.classifyData?.map(
                    (el: any, index: number) => ({
                      value: el.key,
                      label: el.value,
                      data: el.methodData,
                    })
                  );
                  setCateGory(chooseCateGory);
                  setMethod([]);
                  setValue('method', '');
                  setValue('category', '');
                }}
              />
            )}
          />
        </div>

        <div className='form-search'>
          <Controller
            control={control}
            name={'category'}
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
                className='react-select'
                classNamePrefix={'react-select'}
                options={cateGory}
                value={cateGory?.find((val: any) => val.value === value) || ''}
                placeholder={'Chọn phân loại'}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                  let methodchoose = cateGory?.find((el: any) => {
                    return el.value === e.value;
                  });
                  setMethod(
                    methodchoose?.data?.map((el: any) => ({
                      value: el.key,
                      label: el.value,
                    }))
                  );
                  setValue('method', '');
                }}
              />
            )}
          />
        </div>

        <div className='form-search'>
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
                classNamePrefix={'react-select'}
                options={method}
                value={method?.find((val: any) => val.value === value) || ''}
                placeholder={'Chọn phương thức'}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                }}
              />
            )}
          />
        </div>
        <div className='form-search'>
          <Controller
            control={control}
            name={'status'}
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
                className='react-select'
                classNamePrefix={'react-select'}
                placeholder='Chọn trạng thái'
                options={statusOptions}
                value={
                  statusOptions.find((val: any) => {
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
          <Controller
            control={control}
            name={'assignTarget'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                className='react-select'
                classNamePrefix='react-select'
                noOptionsMessage={() => {
                  return 'Không có kết quả tìm kiếm';
                }}
                styles={customStyles}
                placeholder='Chọn bộ phận xử lý'
                value={assignTargetOptions.find((c) => c.value === value) || ''}
                options={assignTargetOptions}
                onChange={(e: SingleValue<any>) => onChange(e.value)}
              />
            )}
          />
        </div>

        <div className='form-search'>
          <Controller
            control={control}
            name={'supportStaff'}
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
                className='react-select'
                classNamePrefix={'react-select'}
                options={supportStaff}
                value={supportStaff?.find((val: any) => val.value === value) || ''}
                placeholder={'Nhập nhân viên tiếp nhận'}
                noOptionsMessage={() => {
                  return t('Không có kết quả tìm kiếm');
                }}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                }}
              />
            )}
          />
        </div>

        <div className='form-search datatime'>
          <div className='form-date'>
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
