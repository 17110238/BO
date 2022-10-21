import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { getListReportBill } from 'redux/actions/reportBill';
import { useDispatch } from 'react-redux';
import updateURLParameter from 'utils/helpers/changeUrl';
import { useRouter } from 'next/router';
dayjs.extend(utc);
interface Typedefautvalue {
  createdAt: {
    from: string
    to: string
  },
}
interface TypeProps {
  loading: boolean
}
export default function BoxSearchReportTransaction({ loading }: TypeProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const defaultValue = {
    createdAt: {
      from: dayjs().subtract(2, 'month').startOf('month').utc().format(),
      to: dayjs().endOf('month').utc().format(),
    },
  }
  const [initialValue, setInitialValue] = useState<Typedefautvalue>(defaultValue);
  const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, reset, control, } = useForm<any>(
    {
      mode: 'onSubmit', reValidateMode: 'onSubmit', defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    }
  );

  useEffect(() => { reset(); reset(initialValue); }, [initialValue]);

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
      setInitialValue({ createdAt: { from: data.from, to: data.to } })
      dispatch(getListReportBill({ createdAt: { from: data.from, to: data.to } }))
    } else {
      dispatch(getListReportBill(defaultValue))
    }
  }, []);
  const handleSubmitReport = (data: Typedefautvalue) => {
    let payload: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (key && value) {
        payload[key] = value
      }

    }
    let formatDataUrl: any = { ...payload };
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
    setValue('createdAt', { from: payload.createdAt.from, to: payload.createdAt.to });
    dispatch(getListReportBill(payload))

  }
  return (
    <div className='reportTransaction-search'>

      <form onSubmit={handleSubmit(handleSubmitReport)} className='reportTransaction-search__content'>
        <div className='reportTransaction-search__group'>
        <DatePickerCustomV2
              placeholder={'DD/MM/YYYY HH:mm'}
              control={control}
              clearErrors={clearErrors}
              className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
              rules={{ from: { required: true }, to: { required: true } }}
            />
          {/* <DatePickerCustomV2 control={control} placeholder={'DD/MM/YYYY HH:mm'} /> */}
        </div>
        <div className='reportTransaction-search__search'>
          <button className='btn btn-primary btn-search' disabled={loading}>
            {loading ? <i className="fa fa-spinner fa-spin"></i> : <i className='fas fa-analytics'></i>}
            {t('Thống kê')}
          </button>
        </div>
      </form>

    </div>
  );
}
