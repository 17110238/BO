import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import numeral from 'numeral';
import { removeUnicode } from 'utils/helpers/unicode';

function Input({
  type,
  label,
  register,
  name,
  errors,
  clearErrors,
  placeholder,
  rules,
  formGroupClassName = '',
  ...others
}) {
  const { t } = useTranslation('common');
  let valueInput = useRef('');
  const isValidSchema = useMemo(() => {
    const arrRS = { ...rules };
    if (rules.required) {
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
    if (rules.minLength) {
      arrRS.minLength = {
        value: true,
        message: `${label} ${t('tối thiểu {{minLength}} ký tự', {
          minLength: rules.minLength,
        })}`,
      };
    }
    if (rules.minLength && rules.maxLength) {
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
        message: `${label} ${t(`phải có {{minLength}} ký tự ${rules.isVNumber ? 'số' : ''}`, {
          minLength: rules.minLength,
        })}`,
      };
    }
    if (rules.min) {
      arrRS.min = {
        value: rules.min,
        message: `${label} ${t('tối thiểu {{min}}', { min: rules.min })}`,
      };
    }
    if (rules.max) {
      arrRS.max = {
        value: rules.max,
        message: `${label} ${t('tối đa {{max}}', { max: rules.max })}`,
      };
    }
    if (rules.min && rules.max) {
      arrRS.max = {
        value: rules.max,
        message: `${label} ${t('từ {{min}} đến {{max}}', {
          min: rules.min,
          max: rules.max,
        })}`,
      };
    }

    arrRS.validate = (value) => {
      if (rules.isEmail) {
        const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regexEmail.test(value)) {
          return `${label} ${t('không đúng định dạng')}`;
        }
      }
      if (rules.isUsernameBo) {
        const regexEmail = /^([a-zA-Z0-9])*$/;
        if (!regexEmail.test(value)) {
          return `${label} ${t('không đúng định dạng')}`;
        }
      }
      if (rules.isNumber) {
        const regexNumber = /^([^0-9]*)$/;
        if (!regexNumber.test(value)) {
          return `${label} ${t('không được chứa ký tự chữ số')}`;
        }
      }
      if (rules.isUserNameBo) {
        const regexUserName = /^[^\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]*$/;
        if (!regexUserName.test(value)) {
          return `${label} ${t('không được chứa ký tự đặc biệt')}`;
        }
      }
      if (rules.isUserName) {
        const regexUserName = /^[^\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]*$/;
        if (!regexUserName.test(value)) {
          return `${label} ${t('không được chứa ký tự đặc biệt')}`;
        }
      }
      if (rules.isPhoneNumber) {
        const phoneRegex = /(84|03|07|08|09|01[2|6|8|9])+([0-9]{8,9})\b/g;
        console.log('value:-----------------', value);
        if (!phoneRegex.test(value)) {
          return `${label} ${t('không đúng định dạng')}`;
        }
      }

      if (rules.trim) {
        if (value.trim().length === 0) {
          return `${label} ${t('không đúng định dạng')}`;
        }
      }
      return true;
    };
    return arrRS;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const { onChange, ...rest } = register(name, {
    valueAsNumber: type === 'number',
    ...isValidSchema,
  });

  const onChangeInput = (e) => {
    clearErrors(name);
    if (rules?.isVNumber) {
      // if (/^[0-9]*$/.test(e.target.value)) {
      //   valueInput.current = e.target.value;
      //   return;
      // }
      // e.target.value = valueInput.current || '';
      if (!/^[0-9]*$/.test(e.target.value)) {
        e.target.value = valueInput.current;
      } else {
        valueInput.current = e.target.value;
      }
    }
   

    if (rules?.isUserName) {
      const regex = /[`~,.<> ;':"/[\]|{}()=_+-]/;
      const formatValueUni = removeUnicode(e.target.value);
      if (!regex.test(formatValueUni) || e.target.value === '') {
        e.target.value = valueInput.current = formatValueUni;
      } else {
        e.target.value = valueInput.current;
      }
    }

    if (rules?.isAmount) {
      // if (!/^[0-9\b]*$/.test(e.target.value)) {
      //   e.target.value = valueInput.current ? numeral(valueInput.current).format('0,0') : '';
      // }
      console.log('e.target.value: ', e.target.value);
      console.log('valueInput.current: ', valueInput.current);
      if (!/^[0-9]*$/.test(e.target.value)) {
        e.target.value = e.target.value ? numeral(e.target.value).format('0,0') : '';
      }
    }
    // if(rules.trim) {
    //   console.log('--------------trim', e.target.value.trim().length)
    //   if(e.target.value.trim().length > 0){
    //     valueInput.current = e.target.value;
    //     return;
    //   }
    //   e.target.value = valueInput.current || '';
    // }
    onChange(e);
  };
  // console.log(errors)
  return (
    <div className={formGroupClassName} style={{ ...others.style }}>
      {label && (
        <label>
          {label}
          {rules.required && <span className='text-danger'> (*)</span>}
        </label>
      )}
      <input
        className={`${errors?.message ? 'input-error' : ''}base-input`}
        type={type}
        onChange={onChangeInput}
        placeholder={placeholder || ''}
        maxLength={rules.maxLength || null}
        {...rest}
        {...others}
      />
      {errors?.type && (
        <div className='txt-valid'>
          <i className='i-valid' />
         {placeholder}{errors?.message}
        </div>
      )}
    </div>
  );
}

export default React.memo(Input);
