import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactSelect from 'react-select';
import updateURLParameter, { customStylesV1 } from 'utils/helpers/changeUrl';
import { getListTopUpPhone } from 'redux/actions/topUpPhone';
import { useDispatch } from 'react-redux';
import { dataSupplier } from './data';
import { useRouter } from 'next/router';
dayjs.extend(utc);
interface Typedefautvalue {
  createdAt: {
    from: string
    to: string
  },
  supplier?: string;
}

interface TypedefautvalueQuery {
  createdAt?: {
    from: string
    to: string
  },
  supplier?: string;
}
interface TypeProps {
  loading: boolean;
}

export default function BoxSearchTopup({ loading }:TypeProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation('common');
  const router = useRouter()
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(1, 'month').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },

  }
  const [initialValue, setInitialValue] = useState<Typedefautvalue>(defaultValue);
  const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, reset, control, } = useForm<any>(
    {
      mode: 'onSubmit', reValidateMode: 'onSubmit', defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    });

  useEffect(() => { reset(); reset(initialValue); }, [initialValue]);
  useEffect(() => { setInitialValue(defaultValue); }, []);
  useEffect(() => {
    let data: any = router.query || {}
    if (!(Object.keys(router.query).length === 0)) {
      if (!data?.from) { data.from = defaultValue.createdAt.from }
      if (!data?.to) data.to = defaultValue.createdAt.to
      if (!data?.to && !data?.from) {
        data.from = defaultValue.createdAt.from;
        data.to = defaultValue.createdAt.to;
      }
      setValue('createdAt', { from: data.from, to: data.to });
      setValue('supplier', data?.supplier);
    }
  }, []);
  const handleSubmitReport = (data: Typedefautvalue) => {
    if (!data?.createdAt.from) { data.createdAt.from = defaultValue.createdAt.from }
    if (!data?.createdAt.to) data.createdAt.to = defaultValue.createdAt.to
    if (!data?.createdAt.to && !data?.createdAt.from) data['createdAt'] = defaultValue.createdAt
    let formatDataUrl: any = { ...data };
    let newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
    newURL = updateURLParameter(newURL, 'resId', 'newResId');
    for (let obj in formatDataUrl) {
      if (obj == 'createdAt') {
        if (Object.keys(formatDataUrl[obj]).length != 0) {
          window.history.replaceState(
            '',
            '',
            updateURLParameter(
              window.location.href,
              'from',
              encodeURIComponent(formatDataUrl[obj]?.from || '')
            )
          );
          // encodeURIComponent(dayjs(formatDataUrl[obj].to).format('YYYY-MM-DD'))
          // fromat day
          window.history.replaceState(
            '',
            '',
            updateURLParameter(
              window.location.href,
              'to',
              encodeURIComponent(formatDataUrl[obj]?.to || '')
            )
          );
        }
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, obj, encodeURIComponent(formatDataUrl[obj]))
        );
      }
    }
    let payload: any = {
    }
    for (const [key, value] of Object.entries(data)) {
      if (key && value) {
        payload[key] = value
      }
    }

    setValue('createdAt', { from: payload.createdAt.from, to: payload.createdAt.to });

    dispatch(getListTopUpPhone({
      filter: {
        ...payload
      },
    }
      , (status, res) => {
      
      })
    )

  }
  const dataSupplierOption = dataSupplier.map((item) => ({
    value: item, label: item
  }))
  const dataSupplierOptionMemo = useMemo(() => [{ label: '---Tất cả nhà mạng---', value: "" }, ...dataSupplierOption], [])
  return (
    <>
      <form className='topupphone-box-search' onSubmit={handleSubmit(handleSubmitReport)}>
        <div className='topupphone-group__date  mt-1'>
          {/* <label htmlFor=''>Khoảng thời gian</label> */}
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
        </div>
        <div className='topupphone-group__search mt-1'>
          {/* <label htmlFor=''>Nhà mạng</label> */}
          <Controller
            control={control}
            name={'supplier'}
            defaultValue={""}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={customStylesV1}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                value={dataSupplierOptionMemo.find((val) => val.value === value)}
                noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                options={dataSupplierOptionMemo}
                onChange={(e) => onChange(e?.value)}
              />
            )}
          />
        </div>
        <div className='topupphone-group__btn d-flex  mt-1'>
          <label htmlFor=''></label>
          <button className='topupphone-btn-filter btn btn-primary btn-search' disabled={loading}>
          {loading?  <i className="fa fa-spinner fa-spin"></i>: <i className='fas fa-analytics'></i>}
            Thống kê</button>
        </div>
      </form>


    </>
  );
}
