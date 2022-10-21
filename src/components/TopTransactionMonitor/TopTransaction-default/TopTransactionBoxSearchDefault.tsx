import React, { memo, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactSelect, { SingleValue } from 'react-select';
import updateURLParameter, { customStylesV1 } from 'utils/helpers/changeUrl';
import { useDispatch } from 'react-redux';
import { getAppInfo } from 'redux/actions';
import { Form } from 'react-bootstrap';
import { getTopTransactionReportAccount, getTopTransactionReportAccountAmount, getTopTransactionReportDate } from 'redux/actions/eWalletTransactionTopReport';
import { typeGetTopTransactionByDateInput } from 'models';
import { Router, useRouter } from 'next/router';
dayjs.extend(utc);
interface Typedefautvalue {
    createdAt?: {
        from: string
        to: string
    },
}
interface TypeProps {
    loading: boolean;
    isShowFilter: boolean;
}
const TopTransactionBoxSearchDefault = ({loading,isShowFilter}:TypeProps) => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const Router = useRouter()
    const [dataApplication, setDataApplication] = useState<any>([])
    const defaultValue = {
        createdAt: {
            from: dayjs().subtract(5, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
    }
    const [initialValue, setInitialValue] = useState<Typedefautvalue>({});
    const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, reset, control, } = useForm<any>(
        {
            mode: 'onSubmit', reValidateMode: 'onSubmit', defaultValues: useMemo(() => {
                return initialValue;
            }, [initialValue]),
        });
    const tags = [
        { value: "", label: "-- Tất cả loại giao dịch --" },
        { label: "Nạp tiền", value: "DEPOSIT" },
        { label: "Rút tiền", value: "WITHDRAW" },
        { label: "ISEC", value: "ISEC" },
        { label: "TOPUP", value: "MOBILE_TOPUP" },
        { label: "Thẻ", value: "MOBILE_CARD" },
    ]
    useEffect(() => { reset(); reset(initialValue); }, [initialValue]);
    useEffect(() => { setInitialValue(defaultValue); }, []);
    useEffect(() => {
        Router.replace('/vi-dien-tu/quan-ly-top-giao-dich')
        dispatch(
            getAppInfo((status, response) => {
                if (status) {
                    const { store } = response[0];
                    let optionDataApplication = [{ value: "", label: "-- Tất cả ứng dụng --" }, ...store?.map((el: any) => ({ value: el.id, label: el.name }))]
                    setDataApplication(optionDataApplication)
                }
            })
        );
        dispatch(getTopTransactionReportDate(defaultValue, (status, res) => {
        }))
        dispatch(getTopTransactionReportAccount({ ...defaultValue, sort: { amount: -1 } }, (status, res) => {
        }))
        dispatch(getTopTransactionReportAccountAmount({ ...defaultValue, sort: { count: -1 } }, (status, res) => {
        }))

    }, []);
   
    const handleSubmitReport = (data: typeGetTopTransactionByDateInput) => {

        if (!data?.createdAt.from) { data.createdAt.from = defaultValue.createdAt.from }
        if (!data?.createdAt.to) data.createdAt.to = defaultValue.createdAt.to
        if (!data?.createdAt.to && !data?.createdAt.from) data['createdAt'] = defaultValue.createdAt
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
        dispatch(getTopTransactionReportDate(payload, (status, res) => { }))
        dispatch(getTopTransactionReportAccount({ ...payload, sort: { amount: -1 } }, (status, res) => { }))
        dispatch(getTopTransactionReportAccountAmount({ ...payload, sort: { count: -1 } }, (status, res) => {
        }))
    }
    return (
        <>
            {isShowFilter &&
        <div className='topTransaction-search'>
        <form onSubmit={handleSubmit(handleSubmitReport)} className='topTransaction-search__content'>
            <div className='topTransaction-search__item-select mt-2'>
                <Controller
                    control={control}
                    name={'tags'}
                    defaultValue={""}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <ReactSelect
                            styles={{
                                ...customStylesV1,
                                menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                                menu: (provided) => ({ ...provided, zIndex: 2 })
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
                            options={tags}
                            value={tags.find((val) => val.value === value)}
                            placeholder=''
                            noOptionsMessage={() => {
                                return t('Không có kết quả tìm kiếm')
                            }}
                            onChange={(e: any) => onChange(e.value)}
                        />
                    )}
                />
            </div>
            <div className='topTransaction-search__item-select mt-2'>
                <Controller
                    control={control}
                    name={'appId'}
                    defaultValue={""}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <ReactSelect
                            styles={{
                                ...customStylesV1,
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
                            options={dataApplication}
                            value={dataApplication?.find((val: any) => {
                                return val.value === value;
                            })}
                            placeholder={"Điều kiện tìm"}
                            noOptionsMessage={() => { return t('Không có kết quả tìm kiếm'); }}
                            onChange={(e: SingleValue<any>) => onChange(e.value)}
                        />
                    )}
                />

            </div>
            <div className='mr-2 mt-2 day__picker'>
                <DatePickerCustomV2 control={control} placeholder={'DD/MM/YYYY HH:mm'} />
            </div>
            <div>
                <button className='btn btn-primary btn-search mt-2'disabled={loading} >
                {loading?  <i className="fa fa-spinner fa-spin"></i>: <i className='fas fa-analytics'></i>}
                    {t('Thống kê')}
                </button>
            </div>
        </form >

    </div >
        }</>
        
    );
}
export default memo(TopTransactionBoxSearchDefault)