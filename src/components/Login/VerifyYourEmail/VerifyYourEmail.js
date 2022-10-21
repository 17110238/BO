/* eslint-disable react-hooks/exhaustive-deps */
import Loading from '../shared/Loading';
import alert from 'utils/helpers/alert';
import { clearState, loadState } from 'utils/helpers/utils';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
// import { signup, signupSendActiveCode } from '../../../../redux/actions/gapi.action';

function VerifyYourEmail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation('common');
  const dataForm = loadState('dataSignUp');

  const signUpEmailState = useSelector((state) => state.signUp.signUpEmail);
  const sendActiveCodeState = useSelector((state) => state.signUp.sendActiveCode);
  const [isShowAlertPos, setIsShowAlertPos] = useState(true);
  const [activeCode, setActiveCode] = useState('');
  const [counter, setCounter] = useState(0);
  const [validation, setValidation] = useState({
    activeCode: false,
    activeCodeLength: false,
  });

  const handleSubmitVerify = (e) => {
    e.preventDefault();
    if ((!(activeCode === '') && activeCode?.length !== 6) || activeCode === '') {
      setValidation({
        ...validation,
        activeCodeLength: !(activeCode === '') && activeCode?.length !== 6,
        activeCode: activeCode === '',
      });
      return;
    }
    if (activeCode !== '' && !validation.activeCodeLength) {
      //TODO API NEW
      // dispatch(
      //   signup(
      //     dataForm.email,
      //     activeCode,
      //     dataForm.password,
      //     dataForm.clientId,
      //     dataForm.isPhoneNumber
      //   )
      // );
    }
  };

  const handleChangeActiveCode = (e) => {
    let value = e.target.value.trim();
    const regexNumber = /^[0-9]*$/;

    setValidation({
      ...validation,
      activeCodeLength: false,
      activeCode: false,
    });

    if ((regexNumber.test(value) || value === '') && value.length <= 6) {
      setActiveCode(value);
    }
  };

  const handleResendEmail = () => {
    if (counter === 0) {
      setCounter(60);
      setActiveCode('');
      //TODO API NEW
      // dispatch(
      //   signupSendActiveCode(
      //     dataForm.email,
      //     dataForm.clientId,
      //     dataForm.password,
      //     dataForm.isPhoneNumber,
      //     (status, data) => {
      //       alert(status ? 'success' : 'error', data.message, t);
      //     }
      //   )
      // );
    }
  };

  useEffect(() => {
    if (!dataForm?.email) {
      router.push('/signup');
    }
  }, [dataForm?.email]);

  useEffect(() => {
    if (signUpEmailState?.code) {
      if (signUpEmailState?.code === 100200) {
        const appReg = localStorage.getItem('appReg');
        if (appReg === 'pos') {
          router.push('/signup/success');
        } else {
          const decodeUrl = loadState('decodeUrl') || process.gapi.urlDashboard;
          clearState('decodeUrl');
          router.replace(`${decodeUrl}?accessToken=${signUpEmailState.data.accessToken}`);
        }
      } else {
        alert('error', signUpEmailState.error?.message, t);
      }
    }
  }, [signUpEmailState?.code]);

  // Third Attempts
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className='card-verify-email'>
      <Loading isLoading={signUpEmailState?.loading || sendActiveCodeState?.loading} />
      <h1 className='card-title'>
        {dataForm?.isPhoneNumber ? t('Verify your phone number') : t('Verify your email')}
      </h1>
      <p className='description'>
        {t('A verification code has been sent to')} {dataForm?.email || ''}
      </p>
      <form className='form-login' onSubmit={handleSubmitVerify} noValidate>
        <div className='form-group  mb-15'>
          <label>{t('Verification code')}</label>
          <input
            type='text'
            className={`form-control ${
              validation.activeCode || validation.activeCodeLength ? 'input-error' : ''
            }`}
            placeholder={t('6 digit verification code')}
            value={activeCode}
            maxLength={6}
            onChange={handleChangeActiveCode}
          />
          {validation.activeCode && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Vui lòng nhập mã xác nhận')}
            </div>
          )}
          {validation.activeCodeLength && (
            <div className='text-danger mt-10 ml-10 mb-0 txt-valid'>
              <i className='i-valid' />
              {t('Mã xác nhận phải có 6 số')}
            </div>
          )}
        </div>
        <p className='resend-email'>
          {t("Didn't receive the code")}?{' '}
          <a onClick={handleResendEmail} style={{ cursor: 'pointer' }}>
            {t('resend')}
            {counter > 0 && ` (${counter}s)`}
          </a>
        </p>
        <div className='form-group mb-50'>
          <button type='submit' className='btn btn-success w-100'>
            {dataForm?.isPhoneNumber ? t('Verify phone number') : t('Verify Email')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifyYourEmail;
