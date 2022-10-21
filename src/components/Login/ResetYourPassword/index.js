import OTPForm from '../OTPForm';
import SignInLayout from '../layouts/SignInLayout';
import ResetYourPassword from '../ResetYourPassword/ResetYourPassword';
import Loading from '../shared/Loading';
import { checkValidatePhone } from 'utils/helpers/utils';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { forgotPasswordSendEmail } from 'redux/actions/gapi.action';
import alert from 'utils/helpers/alert';
import { useTranslation } from 'react-i18next';

function Forgot({ clientId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [sendMailSuccess, setSendMailSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState({
    email: false,
    emailFormat: false,
  });

  const { app } = router.query;
  useEffect(() => {
    localStorage.setItem('appForgot', app);
  }, [app]);

  const sendEmailForgotPass = useSelector(
    (state) => state.loginEmail.sendMaiForgotPassword
  );

  const verifyOtp = useSelector((state) => state.loginEmail.verifyOtp);

  const handleChangeEmail = (e) => {
    setValidation({
      emailFormat: false,
      email: false,
    });
    setEmail(e.target.value);
  };

  const handleSubmitSendEmail = (e) => {
    e.preventDefault();
    const isPhoneNumber = checkValidatePhone(email)?.isValid || false;
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (
      (!isPhoneNumber && !(email === '') && !re.test(String(email).toLowerCase())) ||
      (!isPhoneNumber && email === '')
    ) {
      setValidation({
        emailFormat:
          !isPhoneNumber && !(email === '') && !re.test(String(email).toLowerCase()),
        email: !isPhoneNumber && email === '',
      });
      return;
    }
    if (email !== '' && !validation.emailFormat) {
      //TODO API
      // dispatch(forgotPasswordSendEmail(email, clientId));
    }
  };

  useEffect(() => {
    if (sendEmailForgotPass?.code) {
      if (sendEmailForgotPass?.code === 100800) {
        if (sendMailSuccess) {
          alert('success', sendEmailForgotPass.data?.message, t);
        }
        setSendMailSuccess(true);
      } else {
        alert('error', sendEmailForgotPass.error?.message, t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendEmailForgotPass?.code]);

  return (
    <SignInLayout isDisplaySignUpLink={!sendMailSuccess} app={app}>
      <Loading isLoading={sendEmailForgotPass?.loading || verifyOtp?.loading} />
      {sendMailSuccess ? (
        <OTPForm username={email} clientId={clientId} />
      ) : (
        <ResetYourPassword
          email={email}
          validation={validation}
          onChangeEmail={handleChangeEmail}
          onSubmitSendEmail={handleSubmitSendEmail}
        />
      )}
    </SignInLayout>
  );
}

export default Forgot;
