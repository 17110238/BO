import React, { memo, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import DatePickerBackUp from 'components/common/DatePickerCustom/DatePickerBackUp';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import ReactSelect, { SingleValue } from 'react-select';
import updateURLParameter, { customStylesV1 } from 'utils/helpers/changeUrl';
import { useDispatch } from 'react-redux';
import { getTopTransactionReportAccount } from 'redux/actions/eWalletTransactionTopReport';
import { useRouter } from 'next/router';
import { filter } from 'lodash';
import { getlistReportAgent, getlistReportSystemTransaction } from 'redux/actions/reportTop';
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
const typeDate = [
    { label: "Hôm nay", value: "NOW" },
    { label: "7 ngày gần đây", value: "SEVEN_DAYS" },
    { label: "30 ngày gần đây", value: "THIRTY_DAYS" },
    { label: "90 ngày gần đây", value: "NINETY_DAYS" },
    { label: "khoảng thời gian", value: "PERIOD" },
    { label: "theo tháng", value: "MONTH" },
]
const BoxSearchAgent = ({ loadingAccount, isShowFilter }: TypeProps) => {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const Router = useRouter();
    const defaultValue = {
        NOW: {
            from: dayjs().startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
        SEVEN_DAYS: {
            from: dayjs().subtract(6, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
        THIRTY_DAYS: {
            from: dayjs().subtract(29, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
        NINETY_DAYS: {
            from: dayjs().subtract(89, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
        typeDate: "NOW"
    }
    const [initialValue, setInitialValue] = useState<Typedefautvalue>();
    const [checkDate, setcheckDate] = useState<any>({ PERIOD: false, MONTH: false });
    const initialState = { PERIOD: false, MONTH: false }
    const { register, watch, formState: { errors, dirtyFields, touchedFields }, handleSubmit, setValue, reset, control, } = useForm<any>(
        {
            mode: 'onSubmit', reValidateMode: 'onSubmit', defaultValues: useMemo(() => {
                return initialValue;
            }, [initialValue]),
        });
    useEffect(() => { reset(); reset(initialValue); }, [initialValue]);
    const handleSubmitReport = (data: Typedefautvalue) => {
      
        // NOW SEVEN_DAYS, THIRTY_DAYS, NINETY_DAYS, PERIOD,
        let filter: any = {}
        for (const [key, value] of Object.entries(data)) {
            if (key === 'typeDate' && value) {
                switch (value) {
                    case "NOW":
                        filter['createdAt'] = defaultValue.NOW;
                        filter['typeDate'] = "DATE";
                        break;
                    case "SEVEN_DAYS":
                        filter['createdAt'] = defaultValue.SEVEN_DAYS
                        filter['typeDate'] = "DATE";
                        break;
                    case "THIRTY_DAYS":
                        filter['createdAt'] = defaultValue.THIRTY_DAYS
                        filter['typeDate'] = "DATE";
                        break;
                    case "NINETY_DAYS":
                        filter['createdAt'] = defaultValue.NINETY_DAYS
                        filter['typeDate'] = "DATE";
                        break;
                    case "PERIOD":
                        filter['typeDate'] = "DATE";
                        break;
                    case "MONTH":
                        filter['typeDate'] = "MONTH";
                        break;
                    default:
                        break;
                }
            } else {
                if (key && value?.from  && value?.to) {
                    filter[key] = value;
                }



            }
        }
        dispatch(getlistReportAgent({ filter }, (status, res) => { }))
    }
    const defaultValues = {
        createdAt: {
            from: dayjs().subtract(6, 'day').startOf('day').utc().format(),
            to: dayjs().endOf('date').utc().format(),
        },
        typeDate: "DATE"
    }
    useEffect(() => {
        dispatch(getlistReportAgent({ filter: defaultValues }, (status, res) => { }))
    }, []);
    return (
        <>{isShowFilter && <div className='quantityMerchantContainerReport-search d-flex justify-content-between align-items-center'>
            <form onSubmit={handleSubmit(handleSubmitReport)} className='quantityMerchantContainerReport-search__content'>
                <div className='quantityMerchantContainerReport-search__item-select mt-2 '>
                    <Controller
                        control={control}
                        name={'typeDate'}
                        defaultValue={"SEVEN_DAYS"}
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
                                options={typeDate}
                                value={typeDate.find((val) => val.value === value)}
                                placeholder=''
                                noOptionsMessage={() => { return t('Không có kết quả tìm kiếm') }}
                                // onChange={(e: any) => onChange(e.value)}
                                onChange={(e: SingleValue<any>) => {
                                    onChange(e.value);
                                
                                    if (e.value === 'PERIOD' || e.value === 'MONTH') {
                                        setcheckDate({ ...initialState, [e.value]: true })
                                    } else {
                                        setcheckDate({ ...initialState })
                                    }

                                    // if (e.value === DateTypeReportKycEnum.DATE) {
                                    //   setCheckMonth(false);
                                    // }
                                    // if (e.value === DateTypeReportKycEnum.MONTH) {
                                    //   setCheckMonth(true);
                                    // }
                                }}
                            />
                        )}
                    />
                </div>
                {checkDate.PERIOD && (
                    <div className='mr-2 mt-2'>
                        <div className='date-picker-custom'>
                            <DatePickerCustomV2
                                rules={{ from: { required: true }, to: { required: true } }}
                                placeholder={'dd/MM/yyyy HH:mm'}
                                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                                            ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}`}
                                control={control}
                            // dateFormat={'dd/MM/yyyy'}
                            />
                        </div>
                    </div>
                )}{checkDate.MONTH && (
                    <div className='mr-2 mt-2'>
                        <div className='date-picker-custom'>
                            <DatePickerBackUp
                                rules={{ from: { required: true }, to: { required: true } }}
                                placeholder={'MM/YYYY'}
                                className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
                                         ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '} `}
                                control={control}
                                formatToValue={(date: any) => date && dayjs(date).endOf('month').utc().format()}
                                dateFormat={'MM/yyyy'}
                                showMonth={true}
                            />
                        </div>
                    </div>
                )}
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
export default memo(BoxSearchAgent)