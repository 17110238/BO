import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { formatPhone } from 'utils/helpers';
import utc from 'dayjs/plugin/utc';
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';
dayjs.extend(utc);
interface TypeProfile {
  accountId?: number;
  id?: string;
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role?: any;
  group?: string[] | any;
  link?: string;
  refcode?: string
  operator?: string[] | any
}
const DetailAuth = () => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const [copied, setCopied] = useState<boolean>(true);
  const accountProfile = useSelector<any, TypeProfile>((state) => state.authReducers?.accountInfo.profile) || {};
  const link = useSelector<any, TypeProfile>((state) => state.authReducers?.accountInfo.link) || {};
  const handleBackUrl =()=>{ router.back()}
  return (
    <>
      <button onClick={handleBackUrl} className="back-url">
        <div className='back-settings'>
          <img src='/assets/icon/back-ward.svg' alt='back-user' />
          <h5 className='text'>{t('Back')} </h5>
        </div>
      </button>
      <div className='d-flex profile--auth'>
        <div className="title">
          <h5> {t("Thông tin tài khoản")}</h5>
        </div>
        <div className="content__auth">
          <div className="d-flex content__auth__item">
            <div className="content__auth__title">
              <h5> {t("AccountId")} </h5>
            </div>
            <div className="content__auth__value">
              <strong> {accountProfile?.accountId}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5> {t("Tên đăng nhập")}</h5>
            </div>
            <div className="content__auth__value">
              <strong> {accountProfile?.username}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5>{t("Họ và tên")}</h5>
            </div>
            <div className="content__auth__value">
              <strong> {accountProfile?.fullname}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5>{t("Phone")}</h5>
            </div>
            <div className="content__auth__value">
              <strong>{formatPhone(accountProfile?.phone, '')}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5> {t("Giới tính")}</h5>
            </div>
            <div className="content__auth__value">
              <strong>{accountProfile?.gender}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5> {t("Ngày sinh")}</h5>
            </div>
            <div className="content__auth__value">
              <strong> {dayjs(accountProfile?.birthday).format('DD-MM-YYYY')}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5> {t("Email")}</h5>
            </div>
            <div className="content__auth__value">
              <strong> {accountProfile?.email}</strong>
            </div>
          </div>
          <div className="d-flex content__auth__item mt-3">
            <div className="content__auth__title">
              <h5> {t("Link")}</h5>
            </div>
            <div className="content__auth__value">
              <div
                data-tip
                data-for={`div-link-ma-gioi-thieu`}
                className='align-items-center'
                style={{
                  backgroundColor: '#eff2f7',
                  borderRadius: '13px',
                  cursor: 'pointer',
                }}>
                <CopyToClipboard
                  onCopy={() => {
                    setCopied(true);
                    Swal.fire({
                      toast: true,
                      showConfirmButton: false,
                      icon: 'success',
                      timer: 1200,
                      title: t('Copied'),
                      position: 'top-end',
                    });
                  }}
                // text={`${link}`}
              text={`${process.env.NEXT_PUBLIC_API_URL_IDMC}/signup/${link}`}  >
                
                  <div
                    // className='d-flex p-3 align-items-center'
                    className=''>
                    <div className='d-flex align-items-center justify-content-end '>
                      <div className='d-flex align-items-center'
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          justifyContent: "space-between"
                        }}
                      >
                        <i className='fa fa-link ml-3'></i>
                        <p
                          className='m-0'
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: 'auto',
                            whiteSpace: 'nowrap',
                          }}>
                          {link}
                        </p>
                      </div>

                      <div className='refcode-icon-coppy '></div>
                    </div>

                  </div>
                </CopyToClipboard>
                <ReactTooltip place='bottom' effect='solid' id={`div-link-ma-gioi-thieu`}>
                  {t('Link mã giới thiệu')}
                </ReactTooltip>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailAuth