import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function InputPassword({
  type,
  label,
  labelHtml,
  register,
  name,
  errors,
  setError,
  clearErrors,
  placeholder,
  rules = {},
}) {
  const { t } = useTranslation('common');
  const [typeInput, setTypeInput] = useState('password');
  let valueInput = useRef('');

  const isValidSchema = useMemo(() => {
    const arrRS = { ...rules };
    if (rules.required) {
      arrRS.required = { value: true, message: `${label} ${t('không được rỗng')}` };
    }
    if (rules.minLength && !rules.maxLength) {
      arrRS.minLength = {
        value: rules.minLength,
        message: `${label} ${t('tối thiểu {{minLength}} ký tự', {
          minLength: rules.minLength,
        })}`,
      };
    }
    if (rules.minLength && rules.maxLength && rules.minLength === rules.maxLength) {
      arrRS.minLength = {
        value: rules.minLength,
        message: `${label} ${t(
          `phải có {{minLength}} ký tự ${rules?.isVNumber ? 'số' : ''}`,
          { minLength: rules.minLength }
        )}`,
      };
    }
    if (rules.min) {
      arrRS.min = {
        value: true,
        message: `${label} ${t('tối thiểu {{min}}', { min: rules.min })}`,
      };
    }
    if (rules.max) {
      arrRS.max = {
        value: true,
        message: `${label} ${t('tối đa {{max}}', { max: rules.max })}`,
      };
    }
    if (rules.min && rules.max) {
      arrRS.max = {
        value: true,
        message: `${label} ${t('từ {{min}} đến {{max}}', {
          min: rules.min,
          max: rules.max,
        })}`,
      };
    }
    // if(rules.pattern){
    //     arrRS.pattern = rules.pattern;
    // }
    // if(rules.valueAsNumber){
    //     arrRS.valueAsNumber = true;
    // }
    arrRS.validate = (value) => {
      if (rules.isVEmail) {
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regexEmail.test(value)) {
          return `${label} ${t('không đúng định dạng')}`;
        }
      }
      return true;
    };
    return arrRS;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const { onChange, ...rest } = register(name, isValidSchema);

  const onChangeInput = (e) => {
    clearErrors(name);
    if (rules?.isVNumber) {
      if (/^[0-9]*$/.test(e.target.value)) {
        valueInput.current = e.target.value;
        onChange(e);
        return;
      }
      setError(name, { type: 'isVNumber', message: `${label} ${t('phải là số')}` });
      e.target.value = valueInput.current || '';
    }
    onChange(e);
  };

  return (
    <div className='form-group'>
      {labelHtml ? labelHtml : <label>{label}</label>}
      <div className='password-group'>
        <input
          className={`form-control ${errors?.message ? 'input-error' : ''}`}
          type={typeInput}
          onChange={onChangeInput}
          placeholder={placeholder || ''}
          maxLength={rules.maxLength || null}
          inputMode='numeric'
          {...rest}
        />
        {typeInput === 'password' && (
          <img
            src='/assets/images/icon-eye.png'
            alt=''
            className='icon-lock icon-eye'
            onClick={() => {
              setTypeInput('text');
            }}
          />
        )}
        {typeInput === 'text' && (
          <img
            src='/assets/images/icon_eye_open.png'
            alt=''
            className='icon-unlock icon-eye'
            onClick={() => {
              setTypeInput('password');
            }}
          />
        )}
      </div>
      {errors && errors?.type && errors?.type !== 'required' && (
        <p className='mt-10 mb-0 txt-valid'>
          <i className='i-valid' />
          {errors?.message}
        </p>
      )}
    </div>
  );
}

export default React.memo(InputPassword);
