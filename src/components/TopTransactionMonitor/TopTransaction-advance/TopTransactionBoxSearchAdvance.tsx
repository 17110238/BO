import React, { memo, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactSelect from 'react-select';
import updateURLParameter, { customStylesV1 } from 'utils/helpers/changeUrl';
import { useDispatch } from 'react-redux';
import { getTopTransactionReportAccount } from 'redux/actions/eWalletTransactionTopReport';
import { useRouter } from 'next/router';
dayjs.extend(utc);
interface Typedefautvalue {
    createdAt: {
        from: string
        to: string
    },
}
interface TypeSort {
    count?: number;
    amount?: number;
    max?: number;
    average?: number;

}
interface TypeProps {
    loadingAccount: boolean;
    isShowFilter: boolean;
}
interface TypeSelect {
    value: string,
    label: string,
}
const tags = [
    { label: "Nạp tiền", value: "DEPOSIT" },
    { label: "Rút tiền", value: "WITHDRAW" },
    { label: "ISEC", value: "ISEC" },
    { label: "TOPUP", value: "TOPUP" },
    { label: "Thẻ", value: "CARD" },
    { label: "SECTION", value: "SECTION" },
]
const valueSelectVND = [
    { value: "MAX", label: "MAX-Lớn" },
    { value: "SUM", label: "SUM-Tổng" },
    { value: "AVG", label: "AVG-Trung bình" },
]
const valueSelectMAGD = [
    { value: "COUNT", label: "COUNT" },]
const valueSelectTIME = [
    { value: "MAX", label: "MAX-Lớn" },
]
const TopTransactionBoxSearchAdvance = ({ loadingAccount, isShowFilter }: TypeProps) => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const Router = useRouter();
    const defaultValue = {
        createdAt: {
            from: dayjs().subtract(5, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
        tags: "DEPOSIT"
    }
    const valueSelect = [
        { value: "VND", label: "VND" },
        { value: "MAGD", label: "Mã giao dịch" },
        { value: "TIME", label: "Thời gian" },
    ]
    const [initialValue, setInitialValue] = useState<Typedefautvalue>();
    const [initialValueSelect, setInitialValueSelect] = useState<any>("VND");
    const { register, watch, formState: { errors, dirtyFields, touchedFields }, handleSubmit, setValue, reset, control, } = useForm<any>(
        {
            mode: 'onSubmit', reValidateMode: 'onSubmit', defaultValues: useMemo(() => {
                return initialValue;
            }, [initialValue]),
        });
    useEffect(() => {
        setInitialValueSelect(watch('typeSelect'));
        if (watch('typeSelect') === 'MAGD') {
            setValue('typeSort', 'COUNT')
        } else {
            setValue('typeSort', 'MAX')
        }
    }, [watch('typeSelect')]);
    useEffect(() => { reset(); reset(initialValue); }, [initialValue]);
    useEffect(() => {
        Router.replace('/vi-dien-tu/quan-ly-top-giao-dich')
        setInitialValue(defaultValue);
        dispatch(getTopTransactionReportAccount({ ...defaultValue, sort: { max: -1 } }, (status, res) => { }))
    }, []);
    const handleSubmitReport = (data: Typedefautvalue) => {
        console.log('data', data);
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
        let payload: any = {}
        let sort: TypeSort = {}
        for (const [key, value] of Object.entries(data)) {
            if (key != 'typeSelect' && value) {
                if (key === 'typeSort') {
                    switch (value) {
                        case "MAX":
                            sort.max = -1
                            break;
                        case "AVG":
                            sort.average = -1
                            break;
                        case "SUM":
                            sort.amount = -1
                            break;
                        case "COUNT":
                            sort.count = -1
                            break;

                        default:
                            break;
                    }

                } else {
                    payload[key] = value
                }

            }
        }

        // console.log("🚀 ~ file: TopTransactionBoxSearchAdvance.tsx ~ line 87 ~ handleSubmitReport ~ payload", payload, sort)
        dispatch(getTopTransactionReportAccount({ ...payload, sort }, (status, res) => {
        }))
    }
    return (
        <>{isShowFilter && <div className='topTransaction-search'>
            <form onSubmit={handleSubmit(handleSubmitReport)} className='topTransaction-search__content'>
                <div className='topTransaction-search__item-select mt-2'>
                    <Controller
                        control={control}
                        name={'tags'}
                        defaultValue={"DEPOSIT"}
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
                        name={'typeSelect'}
                        defaultValue={"VND"}
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
                                options={valueSelect}
                                value={valueSelect.find((val) => val.value === value)}
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
                    {initialValueSelect === 'VND' && <Controller
                        control={control}
                        name={'typeSort'}
                        defaultValue={valueSelectVND[0].value}
                        render={({ field: { onChange, value }, fieldState: { error } }) => {

                            return (
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

                                    options={valueSelectVND}
                                    value={valueSelectVND.find((val) => val.value === value)}
                                    placeholder=''
                                    noOptionsMessage={() => {
                                        return t('Không có kết quả tìm kiếm')
                                    }}
                                    onChange={(e: any) => onChange(e.value)}
                                />
                            )

                        }}
                    />}
                    {initialValueSelect === 'MAGD' && <Controller
                        control={control}
                        name={'typeSort'}
                        defaultValue={"COUNT"}
                        render={({ field: { onChange, value }, fieldState: { error } }) => {

                            return (
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
                                    options={valueSelectMAGD}
                                    value={valueSelectMAGD.find((val) => val.value === value)}
                                    placeholder=''
                                    noOptionsMessage={() => {
                                        return t('Không có kết quả tìm kiếm')
                                    }}
                                    onChange={(e: any) => onChange(e.value)}
                                />
                            )

                        }}
                    />}
                    {initialValueSelect === 'TIME' && <Controller
                        control={control}
                        name={'typeSort'}
                        defaultValue={"MAX"}
                        render={({ field: { onChange, value }, fieldState: { error } }) => {

                            return (
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
                                    options={valueSelectTIME}
                                    value={valueSelectTIME.find((val) => val.value === value)}
                                    placeholder=''
                                    noOptionsMessage={() => {
                                        return t('Không có kết quả tìm kiếm')
                                    }}
                                    onChange={(e: any) => onChange(e.value)}
                                />
                            )

                        }}
                    />}
                </div>
                <div className='mr-2 mt-2 day__picker'> <DatePickerCustomV2 control={control} placeholder={'DD/MM/YYYY HH:mm'} />  </div>
                <div>
                    <button className='btn btn-primary btn-search mt-2' disabled={loadingAccount}>
                        {loadingAccount ? <i className="fa fa-spinner fa-spin"></i> : <i className='fas fa-analytics'></i>} 
                        {t('Thống kê')}
                    </button>
                </div>
            </form>

        </div>}</>

    );
}
export default memo(TopTransactionBoxSearchAdvance)