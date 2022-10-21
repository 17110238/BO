import vi from 'date-fns/locale/vi';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker, { CalendarContainer, ReactDatePicker, registerLocale } from 'react-datepicker';

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
}

interface ControlDate {
    createdAt?: {
        from?: string;
        to?: string;
    };
}

function DatePickerCustom({
    placeholder = 'dd/MM/yyyy HH:mm',
    className = '',
    iconPrefix = false,
    inputClassName = '',
    rules,
    clearErrors,
    formatFromValue = (date: any) => date && dayjs(date).utc().format(),
    formatToValue = (date: any) => date && dayjs(date).utc().format(),
    control,
    disableFrom,
    inputNameFrom,
    inputNameTo,
    dateFormat,
}: Props) {
    // from: dayjs().subtract(5, 'day').startOf('day').utc().format().toISOString(),
    // to: dayjs().endOf('date').utc().format(),
    const lang = localStorage.getItem('NEXT_LOCALE');
    const [datePick, setDatePick] = useState<any>({});
    const [isShowCalendarFrom, setIsShowCalendarFrom] = useState<boolean>(false);
    const [isShowCalendarTo, setIsShowCalendarTo] = useState<boolean>(false);
    const fromRef = useRef<any>(null);
    const toRef = useRef<any>(null);
    const {field: { value: createdAt }} = useController({ control, name: 'createdAt' });
    const ExampleCustomTimeInput = ({ date, value, onChange, onChangeCustom }: any) => {
        return (<input
            type={'time'}
            step='2'
            value={dayjs(date).format('HH:mm:ss')||value}
            onChange={(e) => {
                let buffer: string = e.target.value;
                const [hh, mm, ss] = buffer.split(':');
                date && date.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
                return (onChangeCustom(formatFromValue(date)))
            }}
            style={{ border: 'solid 1px pink' }}
        />)
    };
    return (
        <div className='date-picker-customer'>
            <div className={`box-date-picker ${className}`}>
                {iconPrefix && <img src='/assets/icon/icon-calendar.svg' alt='' className='icon-prefix' />}
                <Controller
                    control={control}
                    name={inputNameFrom ?? 'createdAt.from'}
                    rules={rules?.from || {}}
                    render={({ field, formState }) => (
                        <DatePicker
                            isClearable={true}
                            className={inputClassName}
                            placeholderText={placeholder}
                            locale={lang || 'en'}
                            dateFormat={dateFormat || 'dd/MM/yyyy HH:mm:ss'}
                            open={true}
                            popperClassName={
                                isShowCalendarFrom
                                    ? 'some-custom-class-popper-active'
                                    : 'some-custom-class-popper-unactive'
                            }
                            calendarClassName={isShowCalendarFrom ? 'isShowVisiable' : 'unShowVisiable'}
                            maxDate={datePick?.to ? new Date(datePick?.to) : new Date()}
                            onChange={(e) => {
                                setDatePick({...datePick,from: formatFromValue(e) });
                                clearErrors && clearErrors('createdAt.from');
                                field.onChange(formatFromValue(e));
                            }}
                            selected={field?.value ? new Date(field.value) : null}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode='select'
                            disabled={disableFrom || false}
                            showTimeInput
                            onClickOutside={() => setIsShowCalendarFrom(false)}
                            ref={fromRef}
                            onSelect={() => setIsShowCalendarFrom(false)}
                            customTimeInput={<ExampleCustomTimeInput onChangeCustom={field.onChange} />}
                            customInput={
                                <MaskedInput
                                    mask={dateFormat?.replace(/\w/g, '1') || '11/11/1111 11:11:11'}
                                    placeholder={placeholder || 'dd/MM/yyyy HH:mm'}
                                />
                            }
                            timeInputLabel='Thời gian:'
                            tabIndex={1}
                        />
                    )}
                />
                <i
                    className='far fa-calendar'
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => setIsShowCalendarFrom(!isShowCalendarFrom)}></i>
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
                    render={({ field }) => {
                        return (
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
                                popperClassName={
                                    isShowCalendarTo
                                        ? 'some-custom-class-popper-active'
                                        : 'some-custom-class-popper-unactive'
                                }
                                selected={field?.value ? new Date(field.value) : null}
                                dateFormat={dateFormat || 'dd/MM/yyyy HH:mm:ss'}
                                minDate={datePick?.from ? new Date(datePick?.from) : null}
                                open={true}
                                // maxDate={new Date()}
                                onSelect={() => setIsShowCalendarTo(false)}
                                customTimeInput={<ExampleCustomTimeInput onChangeCustom={field.onChange} />}
                                calendarClassName={isShowCalendarTo ? 'isShowVisiable' : 'unShowVisiable'}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode='select'
                                disabled={disableFrom || false}
                                tabIndex={2}
                                ref={toRef}
                                showTimeInput
                                timeInputLabel='Thời gian:'
                                onClickOutside={() => setIsShowCalendarTo(false)}
                                customInput={
                                    <MaskedInput
                                        mask={dateFormat?.replace(/\w/g, '1') || '11/11/1111 11:11:11'}
                                        placeholder={placeholder || 'dd/MM/yyyy HH:mm:ss'}
                                    />
                                }
                            />
                        );
                    }}
                />
                <i
                    className='far fa-calendar'
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    onClick={() => setIsShowCalendarTo(!isShowCalendarTo)}></i>
                {/* {iconSuffix && datePick?.to && <i className='far fa-calendar'></i>} */}
                <i className='fas fa-times-circle'></i>
            </div>
        </div>
    );
}

export default DatePickerCustom;
