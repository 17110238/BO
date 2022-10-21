import vi from 'date-fns/locale/vi';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { ReactDatePicker, registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import utc from 'dayjs/plugin/utc';
import MaskedInput from 'react-maskedinput';
import { Control, Controller, useController, UseFormClearErrors } from 'react-hook-form';
import dayjs from 'dayjs';
registerLocale('vi', vi);
dayjs.extend(utc);
interface Props {
  placeholder?: string;
  className?: string;
  iconPrefix?: boolean;
  iconSuffix?: boolean;
  inputClassName?: string;
  disableFrom?: boolean;
  maxToDate?: Date;
  minToDate?: Date;
  rules?: { from: any; to: any };
  control?: Control<any>;
  clearErrors?: UseFormClearErrors<any>;
  formatFromValue?: (data: Date | [Date | null, Date | null] | null) => string;
  formatToValue?: (data: Date | [Date | null, Date | null] | null) => string;
  inputNameFrom?: string;
  inputNameTo?: string;
  dateFormat?: string;
  showMonth?: boolean;
  fixMaxDate?: boolean;
}

interface ControlDate {
  createdAt?: {
    from?: string;
    to?: string;
  };
}

function DatePickerCustom({
  placeholder,
  className = '',
  iconPrefix = false,
  inputClassName = '',
  rules,
  clearErrors,
  formatFromValue = (date: any) => date && dayjs(date).startOf('days').utc().format(),
  formatToValue = (date: any) => date && dayjs(date).endOf('date').utc().format(),
  control,
  disableFrom,
  inputNameFrom,
  inputNameTo,
  dateFormat,
  showMonth,
  fixMaxDate = true,
}: Props) {
  // from: dayjs().subtract(5, 'day').startOf('day').utc().format().toISOString(),
  // to: dayjs().endOf('date').utc().format(),
  const lang = localStorage.getItem('NEXT_LOCALE');
  const [datePick, setDatePick] = useState<any>({});
  const fromRef = useRef<any>(null);
  const toRef = useRef<any>(null);
  const {
    field: { value: createdAt },
  } = useController({ control, name: 'createdAt' });

  useEffect(() => {
    if (createdAt?.from && fromRef.current) {
      fromRef.current.input.mask.value = dayjs(createdAt.from)
        .format(dateFormat?.toUpperCase() || 'DD/MM/YYYY')
        .split('');
    }

    if (createdAt?.to && toRef.current) {
      toRef.current.input.mask.value = dayjs(createdAt.to)
        .format(dateFormat?.toUpperCase() || 'DD/MM/YYYY')
        .split('');
    }
  }, [createdAt, dateFormat]);

  return (
    <div className='date-picker-customer'>
      <div className={`box-date-picker ${className}`}>
        {iconPrefix && <img src='/assets/icon/icon-calendar.svg' alt='' className='icon-prefix' />}
        <Controller
          control={control}
          name={inputNameFrom ?? 'createdAt.from'}
          rules={rules?.from || {}}
          render={({ field }) => (
            <DatePicker
              isClearable={true}
              className={inputClassName}
              placeholderText={placeholder}
              locale={lang || 'en'}
              dateFormat={dateFormat || 'dd/MM/yyyy'}
              maxDate={datePick?.to ? new Date(datePick?.to) : new Date()}
              onChange={(e) => {
                setDatePick({
                  ...datePick,
                  from: formatFromValue(e),
                });
                clearErrors && clearErrors('createdAt.from');
                field.onChange(formatFromValue(e));
              }}
              selected={field?.value ? new Date(field.value) : null}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              disabled={disableFrom || false}
              ref={fromRef}
              customInput={
                <MaskedInput
                  mask={dateFormat?.replace(/\w/g, '1') || '11/11/1111'}
                  placeholder={dateFormat || 'dd/MM/yyyy'}
                />
              }
              tabIndex={1}
              showMonthYearPicker={showMonth || false}
            />
          )}
        />
        {/* {iconSuffix && datePick?.from && <i className='far fa-calendar'></i>} */}
      </div>

      <div className='icon-from-to'>
        <i className='fas fa-chevron-right'></i>
      </div>
      <div className={`box-date-picker ${className}`}>
        {iconPrefix && <img src='/assets/icon/icon-calendar.svg' alt='' className='icon-prefix' />}
        <Controller
          control={control}
          name={inputNameTo ?? 'createdAt.to'}
          rules={rules?.to || {}}
          render={({ field }) => (
            <DatePicker
              isClearable={true}
              className={inputClassName}
              placeholderText={placeholder}
              locale={lang || 'en'}
              onChange={(e) => {
                setDatePick({
                  ...datePick,
                  to: formatToValue(e),
                });
                clearErrors && clearErrors('createdAt.from');
                field.onChange(formatToValue(e));
              }}
              selected={field?.value ? new Date(field.value) : null}
              dateFormat={dateFormat || 'dd/MM/yyyy'}
              minDate={datePick?.from ? new Date(datePick?.from) : null}
              maxDate={fixMaxDate ? new Date() : null}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              disabled={disableFrom || false}
              tabIndex={2}
              ref={toRef}
              showMonthYearPicker={showMonth || false}
              customInput={
                <MaskedInput
                  mask={dateFormat?.replace(/\w/g, '1') || '11/11/1111'}
                  placeholder={dateFormat || 'dd/MM/yyyy'}
                />
              }
            />
          )}
        />
        {/* {iconSuffix && datePick?.to && <i className='far fa-calendar'></i>} */}
        <i className='fas fa-times-circle'></i>
      </div>
    </div>
  );
}

export default DatePickerCustom;
