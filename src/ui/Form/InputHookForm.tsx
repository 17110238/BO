import React, { useEffect, useMemo } from 'react'
import { Controller, useForm, useController } from 'react-hook-form'
import ReactDatePicker from 'react-datepicker';
import ReactSelect from 'react-select';
import dayjs from 'dayjs'
import Input from 'ui/Form/Input'
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

interface Props {
    nameNew: string;
    type?: string;
    typeInput?: string;
    options?: any;
    rules?: any;
    label?: string;
    placeholder?: string;
    config?: {
        value?: any,
        onChange?: (data: any) => void
    },
    controls?: any;
    formGroupClassName?: any;
    rest?: any;
    errors?: any;
    cursor? : boolean
}

const InputHookForm: React.FC<Props> = ({
    nameNew,
    type,
    options,
    rules,
    label,
    typeInput,
    placeholder,
    config,
    controls,
    formGroupClassName,
    errors,
    cursor,
    ...rest
}) => {
    const { t } = useTranslation('common');
    // const validationSchema = Yup.object().shape({
    //     email: Yup.string()
    //         .required('Title is required')
    // });
    const { control, clearErrors, setValue, register } = useForm({
        // resolver: yupResolver(validationSchema)
    })


    useEffect(() => {
        setValue(nameNew, config?.value)
    }, [config?.value])

    const isValidSchema = useMemo(() => {
        const arrRS = { ...rules };
        if (rules?.required) {
            arrRS.required = {
                value: true,
                message: `${label} ${t('không được rỗng')}`,
            };
        }
        // if (rules.pattern) {
        //   arrRS.pattern = {
        //     value: true,
        //     message: `${label} ${t("không được chứa ký tự đặc biệt")}`,
        //   };
        // }
        if (rules?.minLength) {
            arrRS.minLength = {
                value: true,
                message: `${label} ${t('tối thiểu {{minLength}} ký tự', {
                    minLength: rules.minLength,
                })}`,
            };
        }
        if (rules?.minLength && rules?.maxLength) {
            arrRS.minLength = {
                value: rules.minLength,
                message: `${label} ${t('tối thiểu {{minLength}} ký tự', {
                    minLength: rules.minLength,
                })}`,
            };
        }
        if (rules?.minLength && rules?.maxLength && rules?.minLength === rules?.maxLength) {
            arrRS.minLength = {
                value: rules.minLength,
                message: `${label} ${t(`phải có {{minLength}} ký tự ${rules.isVNumber ? 'số' : ''}`, {
                    minLength: rules.minLength,
                })}`,
            };
        }
        if (rules?.min) {
            arrRS.min = {
                value: true,
                message: `${label} ${t('tối thiểu {{min}}', { min: rules.min })}`,
            };
        }
        if (rules?.max) {
            arrRS.max = {
                value: true,
                message: `${label} ${t('tối đa {{max}}', { max: rules.max })}`,
            };
        }
        if (rules?.min && rules?.max) {
            arrRS.max = {
                value: true,
                message: `${label} ${t('từ {{min}} đến {{max}}', {
                    min: rules.min,
                    max: rules.max,
                })}`,
            };
        }
        arrRS.validate = (value : any) => {
            if (rules?.isEmail) {
                const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!regexEmail.test(value)) {
                    return `${label} ${t('không đúng định dạng')}`;
                }
            }
            if (rules?.isNumber) {
                const regexNumber = /^([^0-9]*)$/;
                if (!regexNumber.test(value)) {
                    return `${label} ${t('không được chứa ký tự chữ số')}`;
                }
            }
            if (rules?.isUserName) {
                const regexUserName = /^[^\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]*$/;
                if (!regexUserName.test(value)) {
                    return `${label} ${t('không được chứa ký tự đặc biệt')}`;
                }
            }
            if (rules?.isPhoneNumber) {
                const phoneRegex = /(84|03|07|08|09|01[2|6|8|9])+([0-9]{8,9})\b/g;
                if (!phoneRegex.test(value)) {
                    return `${label} ${t('không đúng định dạng')}`;
                }
            }
            if(rules?.isVNumber){
                const regexNumber = /^[0-9]*$/
                if (!regexNumber.test(value)) {
                    return `${label} ${t('không đúng định dạng')}`;
                }
            }
            return true;
        };
        return arrRS;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);
    return (
        <Controller
            control={controls}
            name={nameNew}
            rules={isValidSchema}
            render={({ field, fieldState }) => {
                config?.onChange && config?.onChange(field.value)
                switch (type) {
                    case 'select':
                        return <ReactSelect
                            className='select-input-form'
                            classNamePrefix='input-select'
                            onChange={(newData) => {
                                config?.onChange ? config?.onChange(field.value) : field.onChange(newData)
                            }}
                            options={options}
                            value={field.value}
                            // menuIsOpen={true}
                        />
                    case 'datePicker':
                        return <ReactDatePicker
                            placeholderText='DD/MM/YYYY'
                            locale={'en'}
                            onChange={(e: Date) => {
                                field.onChange(e && dayjs(e).format('DD/MM/YYYY'));
                            }}
                            selected={field.value ? dayjs(field.value).toDate() : null}
                            dateFormat='dd/MM/yyyy'
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode='select'
                            className={
                                fieldState.invalid
                                    ? field?.value
                                    ? 'style'
                                    : 'style input-error'
                                    : 'style'
                            }
                        />
                    case 'input':
                        if (typeInput === 'checkbox') {
                            // return <input
                            //     type='checkbox'
                            //     {...field}
                            //     value={field.value}
                            //     onChange={(newData) => {
                            //         field.onChange(newData)
                            //     }}
                            // />
                            return (
                                <div className={'form-group ' + formGroupClassName}>
                                    {label && (
                                        <label>
                                            {label}
                                            {rules.required && <span className='text-danger'> (*)</span>}
                                        </label>
                                    )}
                                    <input
                                        className={`form-control ${errors?.message ? 'input-error' : ''}base-input`}
                                        type={typeInput}
                                        onChange={(newData) => {
                                            clearErrors(nameNew);
                                            field.onChange(newData)
                                        }}
                                        value={field.value}
                                        placeholder={placeholder || ''}
                                        // maxLength={rules.maxLength || null}
                                        {...rest}
                                    />
                                    {errors?.type && (
                                        <p className='mt-10 mb-0 txt-valid'>
                                            <i className='i-valid' />
                                            {errors?.message}
                                        </p>
                                    )}
                                </div>
                            )
                        } else {
                            // return <input
                            //     placeholder='type..'
                            //     {...field}
                            //     value={field.value}
                            //     onChange={(newData) => {
                            //         console.log('NEW-DATA', newData)
                            //         field.onChange(newData)
                            //     }}
                            // />
                            return (
                                <div className={'form-group ' + formGroupClassName}>
                                    {label && (
                                        <label>
                                            {label}
                                            {rules.required && <span className='text-danger'> (*)</span>}
                                        </label>
                                    )}
                                    <input
                                        className={`form-control ${errors?.message ? 'input-error' : ''}base-input`}
                                        type={typeInput}
                                        onChange={(newData) => {
                                            clearErrors(nameNew);
                                            field.onChange(newData)
                                        }}
                                        value={field.value}
                                        placeholder={placeholder || ''}
                                        // maxLength={rules.maxLength || null}
                                        {...rest}
                                    />
                                    {errors?.type && (
                                        <p className='mt-10 mb-0 txt-valid'>
                                            <i className='i-valid' />
                                            {errors?.message}
                                        </p>
                                    )}
                                </div>
                            )
                        }
                    default:
                        return <></>
                }
            }}
        />
    )
}

export default InputHookForm