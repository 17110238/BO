import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import BoxSearchUser from './BoxSearchUser';
import { useSelector } from 'react-redux';
const IcExport = '/assets/img/emailsms/export.svg';
interface DataUserProps {
  showFilter?: boolean;
  toggleFilter?: () => void;
  show?: () => void;
  handleSubmitSearch?: any;
  submitForm: boolean;
}
export default function HeaderAccount({
  showFilter,
  toggleFilter,
  handleSubmitSearch,
  submitForm,
}: DataUserProps) {
  const checkPermisson =
    useSelector<any, []>((state) => state.authReducers?.accountInfo.scope) || [];
  let checkrole = checkPermisson.find((item) => item === 'bo.account.role');
  let checkscope = checkPermisson.find((item) => item === 'bo.account.scope');
  // 'bo.account.role', 'bo.account.scope'
  const { t } = useTranslation('common');
  return (
    <>
      <div className='deposit-manage-container deposit-manage'>
        <div className='deposit-manage__header-block'>
          <h4 className='header-block__title'>{t('Quản lý người dùng')}</h4>
          <div className='header-block__group-btn'>
          {checkrole ? (
            <Link href={'/cong-thanh-toan/quan-ly-nguoi-dung/tao-tai-khoan'} passHref>
              <button className='btn btn-secondary btn-add'>
                {/* <img src='/assets/icon/ic-plus.svg' alt='s1' className='mr-1' />
                {t('Tạo tài khoản')} */}
                <i className="fa fa-user-plus mr-0" style={{ fontSize : "1.25rem"}}></i>
              </button>
            </Link>
          ) : checkscope ? (
            <Link href={'/cong-thanh-toan/quan-ly-nguoi-dung/tao-tai-khoan-theo-quyen'} passHref>
              <button className='btn btn-secondary btn-add'>
                {/* <img src='/assets/icon/ic-plus.svg' alt='s2' className='mr-1' />
                {t('Tạo tài khoản')} */}
                <i className="fa fa-user-plus mr-0" style={{ fontSize : "1.25rem"}}></i>
              </button>
            </Link>
          ) : (
            ''
          )}
          
          </div>
        </div>
        </div>
     
    </>
  );
}
