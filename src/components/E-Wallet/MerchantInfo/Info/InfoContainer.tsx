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
        return 'Mở';
      case 'locked':
        return 'Khóa';
      case 'temporary_lock':
        return 'Tạm khóa';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'pending':
        return 'Chờ duyệt';
      case 'canceled':
        return 'Hủy';
      case 'banned':
        return 'Chặn';

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
        return 'Nữ';
      case 'other':
        return 'Khác';

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
          alert('success', response?.message || 'Chuyển trạng thái thành công', t);
        } else {
          alert('error', response?.message || 'Thất bại', t);
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
    '23': { cv: 'Trưởng nhóm', nn: 'Kỹ thuật viên' }, //emlmt
    '334117739': { cv: 'Trưởng nhóm', nn: 'Nhân viên kinh doanh' }, //cuong
    '151': { cv: 'Nhân viên', nn: 'Kỹ thuật viên' }, // tai
    '802872854': { cv: 'Nhân viên', nn: 'Nhân viên văn phòng' },
    '914732703': { cv: 'Nhân viên', nn: 'Nhân viên kinh doanh' },
    '862237538': { cv: 'Trưởng nhóm', nn: 'Nhân viên thiết kế' },
    '472363312': { cv: 'Nhân viên', nn: 'Nhân viên kinh doanh' },
    '290087063': { cv: 'Trưởng nhóm', nn: 'Nhân viên văn phòng' },
    '549828282': { cv: 'Nhân viên', nn: 'Nhân viên văn phòng' },
    '510905987': { cv: 'Nhân viên', nn: 'Nhân viên kinh doanh' },
    '771049957': { cv: 'Nhân viên', nn: 'Nhân viên thiết kế' },
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
                {t('Cập nhật')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setIsShowModal({
                    ...isShowModal,
                    declineKyc: true,
                  })
                }>
                <i className='fas fa-times-circle fa-lg mr-2' />
                {t('Từ chối KYC')}
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
                  {t('Đặt lại MK')}
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
                {t('Cấu hình')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  setIsShowModal({
                    ...isShowModal,
                    requestCancelWallet: true,
                  })
                }>
                <i className='fas fa-ban fa-lg mr-2' />
                {t('Yêu cầu hủy TK ví')}
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
                  {t('Mở khóa định danh')}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
      {merchants?.length !== 0 && (
        <div className='merchant-info-wrapper'>
          <div className='account-info inputs-group'>
            <div className='inputs-group__title'>Thông tin tài khoản</div>
            <div className='form-group'>
              <label>ID</label>
              <span>{merchants?.[0].id}</span>
            </div>
            <div className='form-group'>
              <label>Họ và tên</label>
              <span>{merchants?.[0].fullname}</span>
            </div>
            <div className='form-group'>
              <label>AliasName</label>
              <span>{merchants?.[0].alias}</span>
            </div>
            <div className='form-group'>
              <label>Ngày sinh</label>
              <span>{formatDate(merchants?.[0].birthday, 'DD/MM/YYYY')}</span>
            </div>
            <div className='form-group'>
              <label>Giới tính</label>
              <span>{convertGender(merchants?.[0].gender)}</span>
            </div>
            <div className='form-group'>
              <label>Số điện thoại</label>
              <span>{merchants?.[0].phone}</span>
            </div>
            <div className='form-group'>
              <label> Địa chỉ thường trú</label>
              <span>{formatAddress(merchants?.[0].address)}</span>
            </div>
            <div className='form-group'>
         
              <label>Địa chỉ tạm trú</label>
              <span>{merchants?.[0]?.temporaryAddress.city.identifyCode ? formatAddress(merchants?.[0].temporaryAddress) : formatAddress(merchants?.[0].address)}</span>
            </div>
            <div className='form-group'>
              <label>Loại (cá nhân / doanh nghiệp)</label>
              <span>{merchants?.[0].accountType === 'BUSINESS' ? 'Doanh nghiệp' : 'Cá nhân'}</span>
            </div>
            <div className='form-group'>
              <label>Email</label>
              <span>{merchants?.[0].email}</span>
            </div>
            <div className='form-group'>
              <label>Xác thực email</label>
              <span>{merchants?.[0].isVerifiedEmail ? 'Đã xác thực' : 'Chưa xác thực'}</span>
            </div>
            <div className='form-group'>
              <label>Ứng dụng</label>
              <span>{merchants?.[0].appName}</span>
            </div>
            <div className='form-group'>
              <label>Platform đăng ký</label>
              <span className='platform'>
                {merchants?.[0].createdDeviceInfo?.platform
                  ? `${merchants?.[0].createdDeviceInfo?.platform} ${merchants?.[0].createdDeviceInfo?.version}`
                  : null}
              </span>
            </div>
            <div className='form-group'>
              <label>Thời điểm đăng ký</label>
              <span>{formatDate(merchants?.[0].createdAt)}</span>
            </div>
            <div className='form-group'>
              <label>Thời điểm đăng nhập gần đây</label>
              <span>{formatDate(merchants?.[0].lastedLoginAt)}</span>
            </div>
            <div className='form-group dflex-horizontal'>
              <label>Trạng thái</label>
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
              <label>Trạng thái hoạt động</label>
              <div className='form-value-btn'>
                <label className='switch' onClick={handleLockAccount}>
                  <input type='checkbox' checked={merchants?.[0].isActive} readOnly />
                  <span className='slider'></span>
                </label>
              </div>
            </div>
            <div className='form-group'>
              <label>Khóa do đăng nhập sai</label>
              <span>{merchants?.[0].clockLoginFail}</span>
            </div>
            <div className='form-group'>
              <label>Số dư ví</label>
              <span>
                {merchants?.[0]?.balance !== -1
                  ? numeral(merchants?.[0].balance).format('0,0.[0000]')
                  : '******'}
              </span>
            </div>
            <div className='form-group'>
              <label>Ảnh đại diện</label>
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
              <label>Chức vụ</label>
              <span>
                {merchants?.[0].position}
              </span>
            </div>
            <div className='form-group'>
              <label>Nghề nghiệp/ Kinh doanh</label>
              <span>
                {merchants?.[0].career}
              </span>
            </div>
          </div>

          <div className='kyc-business-info inputs-group'>
            <div className='kyc-info info-wrapper'>
              <div className='inputs-group__title'>Thông tin KYC</div>
              <div className='form-group'>
                <label>Loại</label>
                <span>{merchants?.[0].kyc?.type}</span>
              </div>
              <div className='form-group'>
                <label>CMND/CCCD/Passport</label>
                <span>{merchants?.[0].kyc?.identifyNumber}</span>
              </div>
              <div className='form-group'>
                <label>Ngày cấp</label>
                <span>{formatDate(merchants?.[0].kyc?.issuedAt, 'DD/MM/YYYY')}</span>
              </div>
              <div className='form-group'>
                <label>Nơi cấp</label>
                <span>{merchants?.[0].kyc?.placeOfIssue}</span>
              </div>
              <div className='form-group dflex-horizontal'>
                <label>Trạng thái KYC</label>
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
                <label>Thời điểm yêu cầu KYC</label>
                <span>{formatDate(merchants?.[0].kyc?.sentAt)}</span>
              </div>
              <div className='form-group'>
                <label>KYC ID</label>
                <span>{merchants?.[0].kyc?.kycId}</span>
              </div>
              <div className='form-group'>
                <label>Hình chụp CMND/CCCD/Passport, mặt trước và sau</label>
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
                <div className='inputs-group__title'>Thông tin doanh nghiệp</div>
                <div className='form-group'>
                  <label>Tên doanh nghiệp</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.name}</span>
                </div>
                <div className='form-group'>
                  <label>Mã số thuế</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.taxCode}</span>
                </div>
                <div className='form-group'>
                  <label>Họ tên người đại diện</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.representative}</span>
                </div>

                <div className='form-group'>
                  <label>Quốc tịch</label>
                  {merchants?.[0]?.shareHolders[0]?.nationality ? (
                    <span> {merchants?.[0]?.shareHolders[0]?.nationality}</span>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
                <div className='form-group'>
                  <label>Số điện thoại</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.phone}</span>
                </div>
                <div className='form-group'>
                  <label>Địa chỉ đặt trụ sở chính</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.address}</span>
                </div>
                <div className='form-group'>
                  <label>Địa chỉ giao dịch</label>
                  <span>{merchants?.[0].kyc?.kycMerchant?.shopAddress}</span>
                </div>
                <div className='form-group'>
                  <label>Giấy phép kinh doanh</label>
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
                  <div className='inputs-group__title'>Thông tin chủ sỡ hữu hưởng lợi</div>
                  {merchants?.[0]?.shareHolders.map((item) => (
                    <React.Fragment key={item.identifyNumber}>
                      <p className='mb-1'>
                        <b>Chủ sở hữu:</b> <span className='text-info'>{item.fullname}</span>
                      </p>
                      <p className='mb-1'>Thông tin chi tiết:</p>
                      <div className='form-group'>
                        <label>Họ tên</label>
                        <span>{item.fullname}</span>
                      </div>
                      <div className='form-group'>
                        <label>CMND/CCCD</label>
                        <span>{item.identifyNumber}</span>
                      </div>
                      <div className='form-group'>
                        <label>Chức vụ</label>
                        <span>{item.title}</span>
                      </div>
                      <div className='form-group'>
                        <label>Tỷ lệ góp vốn</label>
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
