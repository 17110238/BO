import { checkValidatePhone, saveState } from 'utils/helpers/utils';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { forgotPassVerifyOtp } from 'redux/actions/gapi.action';
import router from 'next/router';
import alert from 'utils/helpers/alert';

function OTPForm({ username, clientId }) {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [validation, setValidation] = useState({
    otp: false,
    otpLength: false,
  });
  const isPhoneNumber = useMemo(() => {
    return checkValidatePhone(username)?.isValid || false;
  }, [username]);

  const handleChangeOtp = (e) => {
    if (/^[0-9]*$/.test(e.target.value)) {
      setOtp(e.target.value);
    }
    setValidation({
      ...validation,
      otpLength: false,
    });
  };

  const handleSubmitConfirmOTP = (e) => {
    e.preventDefault();
    setValidation({
      otp: otp === '',
      otpLength: otp !== '' && otp.length < 6,
    });
    if (otp !== '' && otp.length === 6) {
      dispatch(
        forgotPassVerifyOtp(username, otp, clientId, (status, data) => {
          if (status) {
            saveState('dataFormForgot', { username, otp, clientId });
            router.push('/password/reset');
          } else {
            alert('error', data?.message, t);
          }
        })
      );
    }
  };

  return (
    <div className='card-sign-in card-otp-confirm'>
      <h1 className='card-title'>{t('Reset your PayME password')}</h1>
      <p className='description'>
        {t(
          'A verification code has been sent to _. Please enter 6 digits verification code to reset your password.',
          {
            username: isPhoneNumber
              ? `******${username?.slice(username?.length - 4, username?.length)}`
              : username,
          }
        )}
      </p>
      <form className='form-login' onSubmit={handleSubmitConfirmOTP} noValidate>
        <div className='form-group'>
          <label>{t('Verification code')}</label>
          <input
            className={`form-control ${
              (validation.otp || validation.otpLength) && 'input-error'
            }`}
            name='text'
            placeholder={t('Enter the verification code')}
            value={otp}
            onChange={handleChangeOtp}
            maxLength={6}
          />

          {validation.otp && otp === '' && (
            <p className='mt-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Vui lòng nhập otp')}
            </p>
          )}
          {validation.otpLength && (
            <p className='mt-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Otp phải có 6 số')}
            </p>
          )}
        </div>
        <div className='form-group mb-xl-45'>
          <button type='submit' className='btn btn-success w-100'>
            {t('Confirm')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OTPForm;
