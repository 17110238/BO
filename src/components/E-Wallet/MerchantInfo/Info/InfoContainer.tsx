import React, { useEffect, useState, useRef, MouseEvent } from 'react';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'react-tagsinput/react-tagsinput.css';
import ModalResetPassword from './resetPassword/ModalResetPassword';
import dayjs from 'dayjs';
import ModalCancelWallet from './requestCancelWallet/ModalCancelWallet';
import ModalConfigAccount from './configAccount/ModalConfigAccount';
import {
  EwalletAccount,
  SearchEwalletAccountResponse,
  SearchTypeEwalletAccountEnum,
} from 'models/merchantInfo/merchantInfoState';
import Viewer from 'viewerjs';
import Nodata from 'components/common/NoData/Nodata';
import ModalUpdateInfoAccount from './ModalUpdateInfoAccount/ModalUpdateInfoAccount';
import ModalRejectKYCPayme from 'components/E-Wallet/approvalKYC/modals/ModalRejectKYCPayme';
import numeral from 'numeral';
import { searchMerchantInfo, updateInfoAccountEWallet } from 'redux/actions/merchantInfoActions';
import alert from 'utils/helpers/alert';
import { scopeUserProps } from 'layouts/Header';
import LoadingInline from 'components/common/Loading/LoadingInline';
import ModalUnlockKyc from './unlockKyc/ModalUnlockKyc';

function index() {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const merchants = useSelector<any, EwalletAccount[]>(
    (state) => state?.merchantInfoReducer?.merchantAccountInfo
  );
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loading);
  const isLoadingUpdate = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingUpdate
  );

  const [isShowModal, setIsShowModal] = useState<{
    update: boolean;
    declineKyc: boolean;
    resetPassword: boolean;
    config: boolean;
    kycInfo: boolean;
    requestCancelWallet: boolean;
    unlockKyc: boolean;
  }>({
    update: false,
    declineKyc: false,
    resetPassword: false,
    config: false,
    kycInfo: false,
    requestCancelWallet: false,
    unlockKyc: false,
  });

  const [imgSrc, setImgSrc] = useState('');
  const viewer = useRef<any>();

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

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, src: any) => {
    if (src) {
      let newSrc = src?.startsWith('http') ? src : process.env.NEXT_PUBLIC_API_UPLOAD + src;
      setImgSrc(newSrc);
      viewer.current && viewer.current.show();
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const formatDate = (date: any, format: string = 'HH:mm DD/MM/YYYY') => {
    if (dayjs(date).isValid()) return dayjs(date).format(format);
    return '';
  };

  const formatAddress = (address: any) => {
    if (!address) return null;

    const addressKeyProps = ['ward', 'district', 'city'];
    const addressArr = [];
    if (address?.street) {
      addressArr.push(address.street);
    }
    addressKeyProps.forEach((key: any) => {
      if (address[key]?.title) {
        addressArr.push(address[key].title);
      }
    });
    return addressArr.join(', ');
  };

  const convertState = (_state: string) => {
    const state = _state?.toLowerCase();
    switch (state) {
      case 'opened':
        return 'M???';
      case 'locked':
        return 'Kh??a';
      case 'temporary_lock':
        return 'T???m kh??a';
      case 'approved':
        return '???? duy???t';
      case 'rejected':
        return 'T??? ch???i';
      case 'pending':
        return 'Ch??? duy???t';
      case 'canceled':
        return 'H???y';
      case 'banned':
        return 'Ch???n';

      default:
        return state ? state.charAt(0).toUpperCase() + state?.slice(1) : state;
    }
  };

  const convertGender = (_gender: string) => {
    const gender = _gender?.toLowerCase();
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'N???';
      case 'other':
        return 'Kh??c';

      default:
        return gender?.charAt(0).toUpperCase() + gender?.slice(1);
    }
  };

  const getFileType = (filePath: string) => {
    const fileExtension = filePath.split('.').pop();
    switch (fileExtension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image';

      case 'pdf':
        return 'pdf';

      default:
        return 'unknown';
    }
  };

  const handleLockAccount = () => {
    const payload = {
      isActive: !merchants[0]?.isActive,
      id: parseInt(accountId),
      state: merchants[0]?.isActive ? 'LOCKED' : 'OPENED',
    };

    dispatch(
      updateInfoAccountEWallet(payload, (status, response) => {
        if (status) {
          updateMerchantInfo();
          alert('success', response?.message || 'Chuy???n tr???ng th??i th??nh c??ng', t);
        } else {
          alert('error', response?.message || 'Th???t b???i', t);
        }
      })
    );
  };

  const updateMerchantInfo = () => {
    const payload = {
      filter: {
        searchType: SearchTypeEwalletAccountEnum.ACCOUNT_ID,
        searchValue: accountId,
      },
    };

    dispatch(searchMerchantInfo(payload, (status, res) => { }));
  };

  const renderLicense = (licenseItem: string) => {
    switch (getFileType(licenseItem)) {
      case 'image':
        return (
          <div onClick={(e) => handlePreviewImg(e, licenseItem)} className='row-img-preview'>
            <img
              src={
                licenseItem.startsWith('http')
                  ? licenseItem
                  : process.env.NEXT_PUBLIC_API_UPLOAD + licenseItem
              }
              onError={handleErrorImage}
            />
          </div>
        );

      case 'pdf':
        return (
          <div className='row-img-preview pdf'>
            <a
              href={
                licenseItem.startsWith('http')
                  ? licenseItem
                  : process.env.NEXT_PUBLIC_API_UPLOAD + licenseItem
              }
              target='_blank'>
              <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' alt='' />
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  const arrIDTK: any = {
    '23': { cv: 'Tr?????ng nh??m', nn: 'K??? thu???t vi??n' }, //emlmt
    '334117739': { cv: 'Tr?????ng nh??m', nn: 'Nh??n vi??n kinh doanh' }, //cuong
    '151': { cv: 'Nh??n vi??n', nn: 'K??? thu???t vi??n' }, // tai
    '802872854': { cv: 'Nh??n vi??n', nn: 'Nh??n vi??n v??n ph??ng' },
    '914732703': { cv: 'Nh??n vi??n', nn: 'Nh??n vi??n kinh doanh' },
    '862237538': { cv: 'Tr?????ng nh??m', nn: 'Nh??n vi??n thi???t k???' },
    '472363312': { cv: 'Nh??n vi??n', nn: 'Nh??n vi??n kinh doanh' },
    '290087063': { cv: 'Tr?????ng nh??m', nn: 'Nh??n vi??n v??n ph??ng' },
    '549828282': { cv: 'Nh??n vi??n', nn: 'Nh??n vi??n v??n ph??ng' },
    '510905987': { cv: 'Nh??n vi??n', nn: 'Nh??n vi??n kinh doanh' },
    '771049957': { cv: 'Nh??n vi??n', nn: 'Nh??n vi??n thi???t k???' },
  };

  return (
    <div className='info-container'>
      <img src={imgSrc} className='preview-identity-img' onError={handleErrorImage} />
      {merchants?.length === 0 && <Nodata imageDataEmpty='' messageDataEmpty='' />}
      {(isLoading || isLoadingUpdate) && <Loading />}
      {merchants?.length !== 0 && (
        <div className='manipulation-btn'>
          <Dropdown className='merchant-info-manipulation-dropdown'>
            <Dropdown.Toggle
              className='p-0 w-100'
              style={{
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
              }}
              id='dropdown-menu-align-end'>
              <div className='d-flex justify-content-center w-100'>
                <i className='fas fa-th-large m-0 text-muted mani-btn'></i>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ borderRadius: '12px' }}>
              <Dropdown.Item
                onClick={() =>
                  setIsShowModal({
                    ...isShowModal,
                    update: true,
                  })
                }>
                <i className='fas fa-edit fa-lg mr-2' />
                {t('C???p nh???t')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setIsShowModal({
                    ...isShowModal,
                    declineKyc: true,
                  })
                }>
                <i className='fas fa-times-circle fa-lg mr-2' />
                {t('T??? ch???i KYC')}
              </Dropdown.Item>
              {accountInfo.scope.includes('bo.ewalletAccount.newPassword') && (
                <Dropdown.Item
                  onClick={() =>
                    setIsShowModal({
                      ...isShowModal,
                      resetPassword: true,
                    })
                  }>
                  <i className='fa fa-redo fa-lg mr-2' />
                  {t('?????t l???i MK')}
                </Dropdown.Item>
              )}
              <Dropdown.Item
                onClick={() =>
                  setIsShowModal({
                    ...isShowModal,
                    config: true,
                  })
                }>
                <i className='fas fa-cog fa-lg mr-2' />
                {t('C???u h??nh')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setIsShowModal({
                    ...isShowModal,
                    requestCancelWallet: true,
                  })
                }>
                <i className='fas fa-ban fa-lg mr-2' />
                {t('Y??u c???u h???y TK v??')}
              </Dropdown.Item>
              {merchants?.[0].kyc?.state === 'BANNED' && (
                <Dropdown.Item
                  onClick={() =>
                    setIsShowModal({
                      ...isShowModal,
                      unlockKyc: true,
                    })
                  }>
                  <i className='fas fa-unlock-alt fa-lg mr-2' />
                  {t('M??? kh??a ?????nh danh')}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      {merchants?.length !== 0 && (
        <div className='merchant-info-wrapper'>
          <div className='account-info inputs-group'>
            <div className='inputs-group__title'>Th??ng tin t??i kho???n</div>
            <div className='form-group'>
              <label>ID</label>
              <span>{merchants?.[0].id}</span>
            </div>
            <div className='form-group'>
              <label>H??? v?? t??n</label>
              <span>{merchants?.[0].fullname}</span>
            </div>
            <div className='form-group'>
              <label>AliasName</label>
              <span>{merchants?.[0].alias}</span>
            </div>
            <div className='form-group'>
              <label>Ng??y sinh</label>
              <span>{formatDate(merchants?.[0].birthday, 'DD/MM/YYYY')}</span>
            </div>
            <div className='form-group'>
              <label>Gi???i t??nh</label>
              <span>{convertGender(merchants?.[0].gender)}</span>
            </div>
            <div className='form-group'>
              <label>S??? ??i???n tho???i</label>
              <span>{merchants?.[0].phone}</span>
            </div>
            <div className='form-group'>
              <label> ?????a ch??? th?????ng tr??</label>
              <span>{formatAddress(merchants?.[0].address)}</span>
            </div>
            <div className='form-group'>
         
              <label>?????a ch??? t???m tr??</label>
              <span>{merchants?.[0]?.temporaryAddress.city.identifyCode ? formatAddress(merchants?.[0].temporaryAddress) : formatAddress(merchants?.[0].address)}</span>
            </div>
            <div className='form-group'>
              <label>Lo???i (c?? nh??n / doanh nghi???p)</label>
              <span>{merchants?.[0].accountType === 'BUSINESS' ? 'Doanh nghi???p' : 'C?? nh??n'}</span>
            </div>
            <div className='form-group'>
              <label>Email</label>
              <span>{merchants?.[0].email}</span>
            </div>
            <div className='form-group'>
              <label>X??c th???c email</label>
              <span>{merchants?.[0].isVerifiedEmail ? '???? x??c th???c' : 'Ch??a x??c th???c'}</span>
            </div>
            <div className='form-group'>
              <label>???ng d???ng</label>
              <span>{merchants?.[0].appName}</span>
            </div>
            <div className='form-group'>
              <label>Platform ????ng k??</label>
              <span className='platform'>
                {merchants?.[0].createdDeviceInfo?.platform
                  ? `${merchants?.[0].createdDeviceInfo?.platform} ${merchants?.[0].createdDeviceInfo?.version}`
                  : null}
              </span>
            </div>
            <div className='form-group'>
              <label>Th???i ??i???m ????ng k??</label>
              <span>{formatDate(merchants?.[0].createdAt)}</span>
            </div>
            <div className='form-group'>
              <label>Th???i ??i???m ????ng nh???p g???n ????y</label>
              <span>{formatDate(merchants?.[0].lastedLoginAt)}</span>
            </div>
            <div className='form-group dflex-horizontal'>
              <label>Tr???ng th??i</label>
              {merchants?.[0].state && (
                <div className='tag-value-container'>
                  <span
                    className={`tag-value ${merchants?.[0].state === 'OPENED' ? 'positive' : 'negative'
                      }`}>
                    {convertState(merchants?.[0].state)}
                  </span>
                </div>
              )}
            </div>
            <div className='form-group dflex-horizontal'>
              <label>Tr???ng th??i ho???t ?????ng</label>
              <div className='form-value-btn'>
                <label className='switch' onClick={handleLockAccount}>
                  <input type='checkbox' checked={merchants?.[0].isActive} readOnly />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='form-group'>
              <label>Kh??a do ????ng nh???p sai</label>
              <span>{merchants?.[0].clockLoginFail}</span>
            </div>
            <div className='form-group'>
              <label>S??? d?? v??</label>
              <span>
                {merchants?.[0]?.balance !== -1
                  ? numeral(merchants?.[0].balance).format('0,0.[0000]')
                  : '******'}
              </span>
            </div>
            <div className='form-group'>
              <label>???nh ?????i di???n</label>
              <div className='row-identify-images'>
                <div
                  onClick={(e) =>
                    handlePreviewImg(
                      e,
                      merchants?.[0]?.avatar?.startsWith('http')
                        ? merchants?.[0]?.avatar
                        : process.env.NEXT_PUBLIC_API_UPLOAD + merchants?.[0]?.avatar
                    )
                  }
                  className='row-img-preview'>
                  <img
                    src={
                      merchants?.[0]?.avatar?.startsWith('http')
                        ? merchants?.[0]?.avatar
                        : process.env.NEXT_PUBLIC_API_UPLOAD + merchants?.[0]?.avatar
                    }
                    onError={handleErrorImage}
                  />
                </div>
              </div>
            </div>

            <div className='form-group'>
              <label>Ch???c v???</label>
              <span>
                {merchants?.[0].position}
              </span>
            </div>
            <div className='form-group'>
              <label>Ngh??? nghi???p/ Kinh doanh</label>
              <span>
                {merchants?.[0].career}
              </span>
            </div>
          </div>

          <div className='kyc-business-info inputs-group'>
            <div className='kyc-info info-wrapper'>
              <div className='inputs-group__title'>Th??ng tin KYC</div>
              <div className='form-group'>
                <label>Lo???i</label>
                <span>{merchants?.[0].kyc?.type}</span>
              </div>
              <div className='form-group'>
                <label>CMND/CCCD/Passport</label>
                <span>{merchants?.[0].kyc?.identifyNumber}</span>
              </div>
              <div className='form-group'>
                <label>Ng??y c???p</label>
                <span>{formatDate(merchants?.[0].kyc?.issuedAt, 'DD/MM/YYYY')}</span>
              </div>
              <div className='form-group'>
                <label>N??i c???p</label>
                <span>{merchants?.[0].kyc?.placeOfIssue}</span>
              </div>
              <div className='form-group dflex-horizontal'>
                <label>Tr???ng th??i KYC</label>
                {merchants?.[0].kyc?.state && (
                  <div className='tag-value-container'>
                    <span
                      className={`tag-value ${merchants?.[0].kyc.state === 'APPROVED' ? 'positive' : 'negative'
                        }`}>
                      {convertState(merchants?.[0].kyc.state)}
                    </span>
                  </div>
                )}
              </div>
              <div className='form-group'>
                <label>Th???i ??i???m y??u c???u KYC</label>
                <span>{formatDate(merchants?.[0].kyc?.sentAt)}</span>
              </div>
              <div className='form-group'>
                <label>KYC ID</label>
                <span>{merchants?.[0].kyc?.kycId}</span>
              </div>
              <div className='form-group'>
                <label>H??nh ch???p CMND/CCCD/Passport, m???t tr?????c v?? sau</label>
                <div className='d-flex row-identify-images'>
                  <div
                    // data-index={0}
                    onClick={(e) =>
                      handlePreviewImg(
                        e,
                        merchants?.[0].kyc?.image?.front?.startsWith('http')
                          ? merchants?.[0].kyc?.image?.front
                          : process.env.NEXT_PUBLIC_API_UPLOAD + merchants?.[0].kyc?.image?.front
                      )
                    }
                    className='row-img-preview'>
                    <img
                      src={
                        merchants?.[0].kyc?.image?.front?.startsWith('http')
                          ? merchants?.[0].kyc?.image?.front
                          : process.env.NEXT_PUBLIC_API_UPLOAD + merchants?.[0].kyc?.image?.front
                      }
                      onError={handleErrorImage}
                    />
                  </div>
                  <div
                    onClick={(e) =>
                      handlePreviewImg(
                        e,
                        merchants?.[0].kyc?.image?.back?.startsWith('http')
                          ? merchants?.[0].kyc?.image?.back
                          : process.env.NEXT_PUBLIC_API_UPLOAD + merchants?.[0].kyc?.image?.back
                      )
                    }
                    className='row-img-preview'>
                    <img
                      src={
                        merchants?.[0].kyc?.image?.back?.startsWith('http')
                          ? merchants?.[0].kyc?.image?.back
                          : process.env.NEXT_PUBLIC_API_UPLOAD + merchants?.[0].kyc?.image?.back
                      }
                      onError={handleErrorImage}
                    />
                  </div>
                </div>
              </div>
            </div>

            {merchants?.[0].accountType === 'BUSINESS' && (
              <div className='business-info info-wrapper'>
                <div className='inputs-group__title'>Th??ng tin doanh nghi???p</div>
                <div className='form-group'>
                  <label>T??n doanh nghi???p</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.name}</span>
                </div>
                <div className='form-group'>
                  <label>M?? s??? thu???</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.taxCode}</span>
                </div>
                <div className='form-group'>
                  <label>H??? t??n ng?????i ?????i di???n</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.representative}</span>
                </div>

                <div className='form-group'>
                  <label>Qu???c t???ch</label>
                  {merchants?.[0]?.shareHolders[0]?.nationality ? (
                    <span> {merchants?.[0]?.shareHolders[0]?.nationality}</span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
                <div className='form-group'>
                  <label>S??? ??i???n tho???i</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.phone}</span>
                </div>
                <div className='form-group'>
                  <label>?????a ch??? ?????t tr??? s??? ch??nh</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.address}</span>
                </div>
                <div className='form-group'>
                  <label>?????a ch??? giao d???ch</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.shopAddress}</span>
                </div>
                <div className='form-group'>
                  <label>Gi???y ph??p kinh doanh</label>
                  <div className='d-flex row-identify-images'>
                    {merchants?.[0].kyc?.kycMerchant?.lincenseImage?.map(
                      (item: string, index: number) => renderLicense(item)
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className='kyc-info info-wrapper'>
              {merchants?.[0]?.shareHolders.length > 0 && (
                <>
                  <div className='inputs-group__title'>Th??ng tin ch??? s??? h???u h?????ng l???i</div>
                  {merchants?.[0]?.shareHolders.map((item) => (
                    <React.Fragment key={item.identifyNumber}>
                      <p className='mb-1'>
                        <b>Ch??? s??? h???u:</b> <span className='text-info'>{item.fullname}</span>
                      </p>
                      <p className='mb-1'>Th??ng tin chi ti???t:</p>
                      <div className='form-group'>
                        <label>H??? t??n</label>
                        <span>{item.fullname}</span>
                      </div>
                      <div className='form-group'>
                        <label>CMND/CCCD</label>
                        <span>{item.identifyNumber}</span>
                      </div>
                      <div className='form-group'>
                        <label>Ch???c v???</label>
                        <span>{item.title}</span>
                      </div>
                      <div className='form-group'>
                        <label>T??? l??? g??p v???n</label>
                        <span>{item.capitalRatio}%</span>
                      </div>
                      <hr />
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <ModalResetPassword
        t={t}
        show={isShowModal.resetPassword}
        onHide={() =>
          setIsShowModal({
            ...isShowModal,
            resetPassword: false,
          })
        }
      />
      <ModalCancelWallet
        t={t}
        show={isShowModal.requestCancelWallet}
        onHide={() =>
          setIsShowModal({
            ...isShowModal,
            requestCancelWallet: false,
          })
        }
      />
      <ModalConfigAccount
        tabActive={0}
        t={t}
        show={isShowModal.config}
        onHide={() =>
          setIsShowModal({
            ...isShowModal,
            config: false,
          })
        }
      />
      <ModalRejectKYCPayme
        updateMerchantInfo={updateMerchantInfo}
        kycId={merchants[0]?.kyc?.kycId}
        show={isShowModal.declineKyc}
        onHide={() =>
          setIsShowModal({
            ...isShowModal,
            declineKyc: false,
          })
        }
      />
      <ModalUpdateInfoAccount
        updateMerchantInfo={updateMerchantInfo}
        show={isShowModal.update}
        account={merchants[0]}
        onHide={(type?: string) => {
          setIsShowModal({
            ...isShowModal,
            update: false,
          });
        }}
      />
      <ModalUnlockKyc
        kycId={merchants?.[0]?.kyc?.kycId}
        updateMerchantInfo={updateMerchantInfo}
        show={isShowModal.unlockKyc}
        t={t}
        onHide={() =>
          setIsShowModal({
            ...isShowModal,
            unlockKyc: false,
          })
        }
      />
    </div>
  );
}

export default index;
