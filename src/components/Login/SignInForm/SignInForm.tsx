import Loading from 'components/Login/shared/Loading';
import alert from 'utils/helpers/alert';
import { b64_to_utf8, clearState, loadState, saveState } from 'utils/helpers/utils';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Input, InputPassword } from 'ui/Form';
// import { actionLogin } from "api/graphql/actions/user.actions";
import { actionLogin } from 'redux/actions/authAction';
import { setCookie } from 'utils/helpers/utils';
import { SHA256 } from 'crypto-js';

import permissionRoleConstant from 'constants/permissionRoleConstant';
import checkPermission from 'utils/helpers/checkPermission';
import { CLOSING } from 'ws';
import { scopeUserProps } from 'layouts/Header';
// import { loginEmail } from '../../../../redux/actions/gapi.action';

const BANK_ACCOUNT = 'nhnngiamsat';
interface FormLoginSubmit {
  email: string;
  password: string;
}
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: any = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const rulesForm = {
  email: { required: true },
  password: { required: true, maxLength: 25, minLength: 6 },
};
function checkPermissionPath() {

  let scope: any = []
  for (let index in permissionRoleConstant.ScopePath) {
    scope.push({ index, path: permissionRoleConstant.ScopePath[index] })
  }
  return scope
}

const SignInForm = () => {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState<boolean>(false);
  const router: any = useRouter();
  const accountInfo = useSelector<any, any>((state) => state?.authReducers?.accountInfo);
  const dispatch = useDispatch();
  const { register, getValues,formState: { errors }, handleSubmit,clearErrors,setError,setFocus,unregister,} = useForm<FormLoginSubmit>({ mode: 'onSubmit',reValidateMode: 'onSubmit', });

  //TODO API NEW
  // const loginEmailState = useSelector((state) => state.loginEmail);
  const loginEmailState = useSelector((state: any) => state.loginEmail);
  let a = document.getElementById('idAlert');

  const handleSubmitLogin: SubmitHandler<FormLoginSubmit> = (data, e) => {
    //TODO API NEW
    setCookie('accessToken', '', -1);
    const params = {
      username: data?.email,
      password: SHA256(data?.password).toString(),
    };
    setLoading(true)
    dispatch(
      actionLogin(params, (status: boolean, response: any) => {
        setLoading(false)
        if (response.succeeded) {
          setCookie('accessToken', response.accessToken, 1);
          setCookie('checkAccessToken', true, { path: `/`, HttpOnly: false })
          localStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('check', 'true');
          const checkBackUrl: any = localStorage.getItem('backUrl');
          const listScope = response.scope || [];
          let flag = false;
          if (listScope.length !== 0) {
            let listRoleDashboard = checkPermissionPath()
            listRoleDashboard.find((item: any) => {
              if (checkBackUrl) {
                if (checkPermission(listScope, [item.index])) {
                  for (let obj of item.path) {
                    if (obj === '/cong-thanh-toan/doi-soat-doanh-nghiep/chuyen-tien') {
                      let position = checkBackUrl.search("/cong-thanh-toan/doi-soat-doanh-nghiep/chuyen-tien");
                      if (position !== -1) {
                        flag = true;
                        return router.push(checkBackUrl);
                      }
                    } else {
                      if (obj === checkBackUrl) {
                        flag = true;
                        return router.push(checkBackUrl);
                      }
                    }
                  }
                }
              }
            })
            if (!flag) {
              listRoleDashboard.find((item: any) => {
                if (getValues('email') === BANK_ACCOUNT) {
                  return router.push('/vi-dien-tu/bao-cao-giao-dich');
                } else if (checkPermission(listScope, [item.index])) {
                  return router.push(item.path[0]);
                }
              })
            }

          }
        } else {
          if (response?.message) {
           // unregister('password')
          
           // setFocus("email" ,)
            alert('error', response.message, t);
          } else {
            alert('error', 'Lỗi kết nối Server', t);
          }
          router.push('/login');
        }
      })
    );
  };
 

  useEffect(() => {
    if (typeof router.query.urlRedirect !== 'undefined') {
      saveState('decodeUrl', b64_to_utf8(router.query.urlRedirect));
    }
  }, [router.query.urlRedirect]);

  const labelPass = useMemo(() => {
    return (
      <div className='clearfix'>
        <label className='float-left'>{t('Password')}</label>
        {/* <Link href='/password/forgot'>
          <a className='float-right link-forgot'>{t('Forgot password')}?</a>
        </Link> */}
      </div>
    );
  }, [t]);
  const checkKeyDown = (e:KeyboardEvent) => {
    let a = document.getElementById('idAlert');
    if (e.code === 'Enter' && !!a ) e.preventDefault();
  };

  return (
    <>
      {loading && <LoadingFullScreen />}
      <div className='card-sign-in'>
        <Loading isLoading={loginEmailState?.loading} />
        <h1 className='card-title'>{t('Sign in to your account')}</h1>
        <form className='form-login' onSubmit={handleSubmit(handleSubmitLogin)} noValidate onKeyDown={(e:any) => checkKeyDown(e)} >
          <Input
            type='email'
            label={t('Account ID')}
            register={register}
            name='email'
            errors={errors.email}
            clearErrors={clearErrors}
            rules={rulesForm?.email}
            placeholder={t('Username')}
          />
          <Input
            type='password'
            label={t('Password')}
            register={register}
            name='password'
            errors={errors.password}
            clearErrors={clearErrors}
            setError={setError}
            rules={rulesForm.password}
            labelHtml={labelPass}
            placeholder={t('Enter password')}
          />
          <div className='mb-30 form- '>
            <input id='c1' type='checkbox' />
            <label htmlFor='c1'>{t('Save password for next login')}</label>
          </div>
          <div className='form-group mb-xl-45'>
            <button type='submit' className='btn btn-success w-100'>
              {t('Continue')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};




export default SignInForm;
function shouldSelect(arg0: string, shouldSelect: any, arg2: boolean) {
  throw new Error('Function not implemented.');
}

