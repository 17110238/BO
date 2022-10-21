import { LocationType, MccCodeListType, MerchantAccount, PaymentMethod } from 'models';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBussinessDetail,
  getInfoMerchant,
  getMccCodeList,
  getpaymentMethodList,
  getSubLocationList,
} from 'redux/actions';
import * as types from 'redux/types';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import ImageProfileMerchant from '../managerMerchant/detailMerchant/InfoMerchant/ImageProfileMerchant';

interface Props {
  merchantId?: string | string[];
}
const ViewMerchantContainer: React.FC<Props> = ({ merchantId }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const locations = useSelector<any, LocationType[]>((state) => state?.utility?.locations);
  const paymentMethods = useSelector<any, PaymentMethod[]>(
    (state) => state?.utility.paymentMethods
  );
  const mccCodes = useSelector<any, MccCodeListType[]>((state) => state?.utility?.mccCodes);
  const merchantProfile = useSelector<any, MerchantAccount>(
    (state) => state.merchantRD.merchantProfile
  );

  const [location, setLocation] = useState<string>('');
  const [imgSrc, setImgSrc] = useState('');

  const viewer = useRef<any>();

  const formMC = useForm<MerchantAccount>();

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const handlePreviewImg: React.MouseEventHandler<HTMLImageElement> = (e) => {
    const target = e.currentTarget as HTMLImageElement;
    const src = target.src.replace('?w=100', '');
    if (src) {
      setImgSrc(src);
      viewer.current && viewer.current.show();
    }
  };

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      title: false,
      button: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, []);

  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [imgSrc]);

  useEffect(() => {
    const payloadFilter = { merchantId: +(merchantId || 0) };
    if (payloadFilter?.merchantId) {
      //check to get default value
      !paymentMethods.length && dispatch(getpaymentMethodList());
      dispatch(getMccCodeList());

      dispatch(
        getBussinessDetail({ filter: payloadFilter }, (state, res) => {
          if (state) {
            formMC.setValue('businessDetails', res?.businessDetails);
          }
        })
      );
      dispatch(
        getInfoMerchant({ filter: payloadFilter }, (state, res) => {
          if (state) {
            const mc: MerchantAccount = res?.data[0];
            formMC.setValue('businessOverview.type', mc?.businessOverview?.type);
          }
        })
      );
    } else {
      dispatch({
        type: types.GET_PROFILE_MERCHANT.RESET,
      });
      alert('error', 'Merchant ID không đúng định dạng', t);
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const wardCode = merchantProfile?.businessOverview?.locationIdentifyCode;
    if (wardCode !== null) {
      dispatch(
        getSubLocationList(
          {
            identifyCode: wardCode,
          },
          (state, res) => {
            const wardLocation: LocationType = res?.data[0];

            if (state && wardLocation?.parentPath && wardCode === wardLocation.identifyCode) {
              let fullLocation = '';
              fullLocation += `, ${
                wardLocation?.parentPath[3] ? wardLocation?.parentPath[3]?.title?.trim() : '-'
              }`;
              fullLocation += `, ${
                wardLocation?.parentPath[2] ? wardLocation?.parentPath[2]?.title?.trim() : '-'
              }`;
              fullLocation += `, ${
                wardLocation?.parentPath[1] ? wardLocation?.parentPath[1]?.title?.trim() : '-'
              }`;

              setLocation(fullLocation);
            } else {
            }
          }
        )
      );
    }
  }, [merchantProfile?.businessOverview?.locationIdentifyCode]);

  return (
    <>
      <img src={imgSrc} className='preview-identity-img d-none' onError={handleErrorImage} />

      <div className='view-merchant-container'>
        <button className='btn btn-back' onClick={() => router.back()}>
          <i className='fas fa-arrow-left btn-back__icon'></i>
          {t('Back')}
        </button>
        <div className='view-merchant-container__main-content'>
          <div className='main-content__header-logo'>
            <div className='header-logo__img'>
              <img
                src={
                  merchantProfile?.businessOverview?.logo
                    ? process.env.NEXT_PUBLIC_API_UPLOAD + merchantProfile?.businessOverview?.logo
                    : ''
                }
                onError={handleErrorImage}
                alt='logo-merchant'
              />
            </div>
            <div className='header-logo__info-text'>
              <p className='info-text__name'>
                {merchantProfile?.businessOverview?.abbreviationName}
              </p>
              <p className='info-text__id'>MCID: {merchantProfile?.merchantId}</p>
            </div>
          </div>
          <div className='main-content__informations'>
            <div className='informations__merchant-profile'>
              <div className='merchant-profile__item'>
                <p className='item__title'>Thông tin doanh nghiệp</p>
                <div className='item__group-list'>
                  <p>
                    <span>Loại MC:</span>
                    <span>{t(merchantProfile?.businessOverview?.type || '-')}</span>
                  </p>
                  <p>
                    <span>Tên doanh nghiệp:</span>{' '}
                    <span>{t(merchantProfile?.businessOverview?.abbreviationName || '-')}</span>
                  </p>
                  <p>
                    <span>BrandName:</span>{' '}
                    <span>{t(merchantProfile?.businessOverview?.brandName || '-')}</span>
                  </p>
                  <p>
                    <span>Trạng Thái:</span>{' '}
                    <span
                      className={merchantProfile?.isActive ? 'state--active' : 'state--inactive'}>
                      {merchantProfile?.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </p>
                  <p>
                    <span>Tên đăng nhập:</span>{' '}
                    <span>{t(merchantProfile?.accountInfo?.username || '-')}</span>
                  </p>
                  <p>
                    <span>Số điện thoại:</span>{' '}
                    <span>{t(merchantProfile?.accountInfo?.phone || '-')}</span>
                  </p>
                  <p>
                    <span>Email:</span>{' '}
                    <span style={{ wordBreak: 'break-word' }}>
                      {t(merchantProfile?.contactInfo?.email || '-')}
                    </span>
                  </p>
                  <p>
                    <span>MST:</span>{' '}
                    <span>{t(merchantProfile?.businessOverview?.taxCode || '-')}</span>
                  </p>
                  <p>
                    <span>Lĩnh Vực KD (MCC):</span>{' '}
                    <span>
                      {mccCodes?.find(
                        (mcc) => mcc.code === merchantProfile?.businessOverview?.category
                      )?.content || '-'}
                    </span>
                  </p>
                  <p>
                    <span>Giá trị tối đa của 1 giao dịch:</span>{' '}
                    <span>
                      {merchantProfile?.businessOverview?.maxAmountTransaction
                        ? numeral(merchantProfile?.businessOverview?.maxAmountTransaction).format(
                            '0,0'
                          )
                        : '-'}
                    </span>
                  </p>
                  <p>
                    <span>Số dư tối thiểu:</span>{' '}
                    <span>
                      {merchantProfile?.minBalance
                        ? numeral(merchantProfile?.minBalance)
                        : merchantProfile?.minBalance ?? '-'}
                    </span>
                  </p>
                  <p>
                    <span>Website:</span>{' '}
                    <span>{merchantProfile?.businessOverview?.homeUrl || '-'}</span>
                  </p>
                  <p>
                    <span>Địa Chỉ:</span>{' '}
                    <span>{(merchantProfile?.businessOverview?.address || '-') + location}</span>
                  </p>
                  <p>
                    <span>Người đại diện:</span>{' '}
                    <span>{t(merchantProfile?.contactInfo?.name || '-')}</span>
                  </p>
                </div>
              </div>
              <div className='merchant-profile__item'>
                <p className='item__title'>Thông tin bổ sung</p>
                <div className='item__group-list'>
                  <p>
                    <span>Xác thực chi hộ:</span>
                    <span>{merchantProfile?.authType || '-'}</span>
                  </p>
                  <p>
                    <span>Xác thực rút tiền:</span>{' '}
                    <span>{merchantProfile?.withdrawVerifyType || '-'}</span>
                  </p>
                  <p>
                    <span>Loại hình kinh doanh:</span>{' '}
                    <span>{merchantProfile?.businessOverview?.connectionType || '-'}</span>
                  </p>
                  <p>
                    <span>Thời gian đối soát:</span>{' '}
                    <span>T+ {merchantProfile?.crossCheckInfo?.crossCheckNum ?? '-'}</span>
                  </p>
                  <p>
                    <span>Hình thức đối soát:</span>{' '}
                    <span>{t(merchantProfile?.crossCheckInfo?.type || '-')}</span>
                  </p>
                  <p>
                    <span>Loại tiền tệ:</span> <span>{merchantProfile?.currency || '-'}</span>
                  </p>
                  <p>
                    <span>Hình thức tích hợp:</span>{' '}
                    <span className='array-item'>
                      {!merchantProfile?.connectionTypeList?.length && '-'}
                      {merchantProfile?.connectionTypeList?.map((item, index) => {
                        return <span key={index}>{item}</span>;
                      })}
                    </span>
                  </p>
                  <p>
                    <span>Xác thực chuyển tiền:</span>{' '}
                    <span
                      className={
                        merchantProfile?.isSecurityPayout ? 'state--active' : 'state--inactive'
                      }>
                      {merchantProfile?.isSecurityPayout ? 'Mở' : 'Đóng'}
                    </span>
                  </p>
                  <p>
                    <span>Telegram chi hộ :</span>{' '}
                    <span>{merchantProfile?.notifyTelegram?.payout || '-'}</span>
                  </p>
                  <p>
                    <span>Telegram thanh toán :</span>{' '}
                    <span>{merchantProfile?.notifyTelegram?.payment || '-'}</span>
                  </p>
                  <p>
                    <span>Phương thức CTT:</span>{' '}
                    <span className='array-item'>
                      {merchantProfile?.paymentMethod?.map((item) => {
                        const methodSelect = paymentMethods.find(
                          (method) => method.id === item?.referId
                        );
                        return <span key={item?.referId}>{methodSelect?.name}</span>;
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='detail-merchant-container'>
        <div className='header-section-merchant detail-merchant'>
          <div className='body-merchant-profile collapse show'>
            <div className='section-form'>
              <div className='block-section-body'>
                <form
                  className='section-body line--hidden block-section-body__form-section'
                  style={{ backgroundColor: 'transparent' }}>
                  <div
                    className='col-xxl-12'
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      margin: '0 0.5rem',
                      boxShadow: '0px 2px 4px rgb(0 0 0 / 10%)',
                    }}>
                    <ImageProfileMerchant
                      hideBtnUpload
                      hideTitle
                      hidePreviewInlineImgs
                      form={formMC}
                      textEmpty={'[Hiện đang trống]'}
                      onRemoveImage={() => {}}
                      onUploadImage={() => {}}
                      onClickImage={handlePreviewImg}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewMerchantContainer;
