import Loading from 'components/common/Loading/LoadingFullScreen';
import ModalReject from 'components/Merchant/pendingListMerchant/ModalReject';
import dayjs from 'dayjs';
import { DefaultFeeMerchantConfig, MerchantAccount, MerchantFeeType, MerchantState } from 'models';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  approvePendingMerchant,
  getBussinessDetail,
  getDefaultMerchantFeeConfig,
  getInfoMerchant,
  getMerchantFeeConfig,
  getSubLocationList,
  getTotalPendingMerchant,
} from 'redux/actions';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import ApproveRejectMerchant from './ApproveRejectMerchant';

interface DetailTransDrawerProps {
  idDetail: number;
  closeDrawerDetail?: () => void;
  showOtherDetail?: ((type: string, itemId: number) => void) | undefined;
  t: (a: string) => string;
  info?: any;
  handleRecall?: (a: any) => void;
  submitForm?: boolean;
}

const DetailApproveMerchant: React.FC<DetailTransDrawerProps> = ({
  idDetail, //payment id để gọi api
  closeDrawerDetail, // đặt lại openDetailTrans false
  showOtherDetail, // hiển thị popup khác
  t,
  info,
  handleRecall,
  submitForm,
}) => {
  const viewer = useRef<any>();
  const dispatch = useDispatch();
  const [data, setData] = useState<MerchantAccount | any>();
  const [identifyImages, setIdentifyImages] = useState([]);
  const [address, setAddress] = useState<string>('');
  const [feeData, setFeeData] = useState<MerchantFeeType>();
  const [show, setShow] = useState<boolean>(false);
  const { targetCode, requestId, isTurn, state } = info || {};
  const isLoading = useSelector<any, MerchantState>((state) => state?.merchantRD?.loading);
  const payload = {
    filter: {
      merchantId: targetCode,
    },
  };
  const defaultFee = useSelector<any, any>((state) => state?.utility?.defaultMerchantFee);

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      zIndex: 10000,
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
    dispatch(
      getInfoMerchant(payload, (status, response) => {
        if (status) {
          setData(response?.data?.[0]);
          dispatch(
            getSubLocationList(
              { identifyCode: response?.data?.[0]?.businessOverview?.locationIdentifyCode },
              (status, response) => {
                if (status) {
                  const address = response?.data[0].parentPath.reverse();
                  address.pop();
                  const convertedAddress = address
                    .map((pathAddress: any) => {
                      return pathAddress.title;
                    })
                    .join(', ');
                  setAddress(convertedAddress);
                }
              }
            )
          );
        }
      })
    );
    dispatch(
      getBussinessDetail(payload, (status, response) => {
        setIdentifyImages(response?.businessDetails.identifyImages);
      })
    );
    dispatch(
      getMerchantFeeConfig(
        {
          merchantId: targetCode,
        },
        (status, response) => {
          if (status) {
            setFeeData(response?.data);
          }
        }
      )
    );
    dispatch(getDefaultMerchantFeeConfig());
  }, []);

  const newEcommerceFee = feeData?.ecommerceFeeList?.map((fee) => {
    let gatewayFee = fee.gatewayFee;
    let fixedGatewayFee = fee.fixedGatewayFee;
    let transactionFee = fee.transactionFee;
    let fixedTransactionFee = fee.fixedTransactionFee;
    const _defaultFee = defaultFee?.ecommerceFeeList?.find(
      (e: any) => e.paymentMethodId === fee.paymentMethodId
    );

    if (fee.gatewayFee.isDefault) {
      gatewayFee = {
        ...fee.gatewayFee,
        value: _defaultFee?.gatewayFee,
      };
    }

    if (fee.fixedGatewayFee.isDefault) {
      fixedGatewayFee = {
        ...fee.fixedGatewayFee,
        value: _defaultFee?.fixedGatewayFee,
      };
    }

    if (fee.transactionFee.isDefault) {
      transactionFee = {
        ...fee.transactionFee,
        value: _defaultFee?.transactionFee,
      };
    }

    if (fee.fixedTransactionFee.isDefault) {
      fixedTransactionFee = {
        ...fee.fixedTransactionFee,
        value: _defaultFee?.fixedTransactionFee,
      };
    }

    return {
      ...fee,
      gatewayFee,
      fixedGatewayFee,
      transactionFee,
      fixedTransactionFee,
    };
  });

  const newPoboFee = feeData?.poboFeeList?.map((fee) => {
    let gatewayFee = fee.gatewayFee;
    let fixedGatewayFee = fee.fixedGatewayFee;
    let transactionFee = fee.transactionFee;
    let fixedTransactionFee = fee.fixedTransactionFee;
    const _defaultFee = defaultFee?.poboFeeList?.find(
      (e: any) => e.paymentMethodId === fee.paymentMethodId
    );

    if (fee.gatewayFee.isDefault) {
      gatewayFee = {
        ...fee.gatewayFee,
        value: _defaultFee?.gatewayFee,
      };
    }

    if (fee.fixedGatewayFee.isDefault) {
      fixedGatewayFee = {
        ...fee.fixedGatewayFee,
        value: _defaultFee?.fixedGatewayFee,
      };
    }

    if (fee.transactionFee.isDefault) {
      transactionFee = {
        ...fee.transactionFee,
        value: _defaultFee?.transactionFee,
      };
    }

    if (fee.fixedTransactionFee.isDefault) {
      fixedTransactionFee = {
        ...fee.fixedTransactionFee,
        value: _defaultFee?.fixedTransactionFee,
      };
    }

    return {
      ...fee,
      gatewayFee,
      fixedGatewayFee,
      transactionFee,
      fixedTransactionFee,
    };
  });

  const result = {
    newEcommerceFee,
    newPoboFee,
  };

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row?: any) => {
    viewer.current && viewer.current.show();
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  return (
    <>
      <div className='atbd-drawer__header d-flex aling-items-center justify-content-between'>
        <h6 className='drawer-title'>
          {t('Chi tiết yêu cầu ')} <span className='title-id'>{requestId}</span>
        </h6>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={closeDrawerDetail}
          alt='close-icon'
        />
      </div>
      <div className='box-body-payment'>
        <div className='row-custom'>
          <div className='col-left'>{t('Thời gian')}:</div>
          <div className='col-right text-right'>
            {dayjs(data?.createdAt).format('HH:mm:ss DD/MM/YYYY')}
          </div>
        </div>
        {data?.businessOverview?.type && (
          <div className='row-custom'>
            <div className='col-left'>{t('Loại doanh nghiệp')}:</div>
            <div className='col-right text-right'>
              {/* {t(`${data?.businessOverview?.type}`)} */}
              {t(`${data?.businessOverview?.type}`)}
            </div>
          </div>
        )}
        {data?.contactInfo?.name && (
          <div className='row-custom'>
            <div className='col-left'>{t('Tên doanh nghiệp')}:</div>
            <div className='col-right text-right'>{data?.contactInfo?.name}</div>
          </div>
        )}
        {data?.businessOverview?.brandName && (
          <div className='row-custom'>
            <div className='col-left'>{t('Tên thương hiệu')}:</div>
            <div className='col-right text-right'>{data?.businessOverview?.brandName}</div>
          </div>
        )}
        {data?.businessOverview?.abbreviationName && (
          <div className='row-custom'>
            <div className='col-left'>{t('Tên rút gọn')}:</div>
            <div className='col-right text-right'>{data?.businessOverview?.abbreviationName}</div>
          </div>
        )}
        {data?.businessOverview?.category && (
          <div className='row-custom'>
            <div className='col-left'>{t('Hình thức KD')}:</div>
            <div className='col-right text-right'>{data?.businessOverview?.category}</div>
          </div>
        )}
        {data?.businessOverview?.categoryName && (
          <div className='row-custom'>
            <div className='col-left'>{t('Ngành nghề KD')}:</div>
            <div className='col-right text-right'>{data?.businessOverview?.categoryName}</div>
          </div>
        )}
        {data?.accountInfo?.username && (
          <div className='row-custom'>
            <div className='col-left'>{t('Tên đăng nhập')}:</div>
            <div className='col-right text-right'>{data?.accountInfo?.username}</div>
          </div>
        )}
        {data?.accountInfo?.phone && (
          <div className='row-custom'>
            <div className='col-left'>{t('Số điện thoại')}:</div>
            <div className='col-right text-right'>{data?.accountInfo?.phone}</div>
          </div>
        )}
        {data?.contactInfo?.email && (
          <div className='row-custom'>
            <div className='col-left'>{t('Email')}:</div>
            <div className='col-right text-right'>{data?.contactInfo?.email}</div>
          </div>
        )}
        {data?.businessOverview?.taxCode && (
          <div className='row-custom'>
            <div className='col-left'>{t('Mã số thuế')}:</div>
            <div className='col-right text-right'>{data?.businessOverview?.taxCode}</div>
          </div>
        )}
        {/* {
          data?.businessOverview?.taxCode &&
          <div className='row-custom'>
            <div className='col-left'>{t('Lĩnh vực KD (MCC)')}</div>
            <div className='col-right text-right'>
              {data?.businessOverview?.taxCode}
            </div>
          </div>
        } */}
        {data?.businessOverview?.homeUrl && (
          <div className='row-custom'>
            <div className='col-left'>{t('Website')}:</div>
            <div className='col-right text-right'>{data?.businessOverview?.homeUrl}</div>
          </div>
        )}
        {data?.businessOverview?.address && (
          <div className='row-custom'>
            <div className='col-left'>{t('Địa chỉ')}:</div>
            <div className='col-right text-right address'>
              {data?.businessOverview?.address + ', ' + address}
            </div>
          </div>
        )}
        {data?.delegate?.[0]?.displayName && (
          <div className='row-custom'>
            <div className='col-left'>{t('Người đại diện')}:</div>
            <div className='col-right text-right'>{data?.delegate?.[0]?.displayName}</div>
          </div>
        )}
        {data?.delegate?.[0]?.role && (
          <div className='row-custom'>
            <div className='col-left'>{t('Chức vụ')}:</div>
            <div className='col-right text-right'>{t(`${data?.delegate?.[0]?.role}`)}</div>
          </div>
        )}
        <div className='align-items-center row-custom'>
          <div className='col-left'>{t('CMND/CCCD người đại diện')}:</div>
          <div className='col-right text-right d-flex preview-identity-img'>
            {

            }
            <div data-index={0} onClick={(e) => handlePreviewImg(e)} className='row-img-preview'>
              <img
                src={process.env.NEXT_PUBLIC_API_UPLOAD + identifyImages[0]}
                onError={handleErrorImage}
              />
            </div>
            <div data-index={1} onClick={(e) => handlePreviewImg(e)} className='row-img-preview'>
              <img
                src={process.env.NEXT_PUBLIC_API_UPLOAD + identifyImages[1]}
                onError={handleErrorImage}
              />
            </div>
          </div>
        </div>
        {/* {
          data?.delegate?.[0]?.role &&
          <div className='row-custom'>
            <div className='col-left'>{t('Nơi cấp')}</div>
            <div className='col-right text-right'>
              {data?.delegate?.[0]?.role}
            </div>
          </div>
        }
        {
          data?.delegate?.[0]?.role &&
          <div className='row-custom'>
            <div className='col-left'>{t('Ngày cấp')}</div>
            <div className='col-right text-right'>
              {data?.delegate?.[0]?.role}
            </div>
          </div>
        } */}

        <div className='fee-list-title'>{t('Ecommerce')}</div>
        <div className='fee-item-list-title-large'>
          <div className='fee-title-large'>{t('Phương thức TT')}</div>
          <div className='fee-title-large'>{t('Phí User')}</div>
          <div className='fee-title-large'>{t('Phí User cố định')}</div>
          <div className='fee-title-large'>{t('Phí đối soát')}</div>
          <div className='fee-title-large'>{t('Phí đối soát cố định')}</div>
        </div>
        {result?.newEcommerceFee?.map((fee, index) => (
          <div className='fee-item' key={index}>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phương thức TT')}</div>
              <div className='fee-value'>{t(fee.paymentMethodName)}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí User')}</div>
              <div className='fee-value'>{fee.gatewayFee.value}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí User cố định')}</div>
              <div className='fee-value'>{fee.fixedGatewayFee.value}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí đối soát')}</div>
              <div className='fee-value'>{fee.transactionFee.value}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí đối soát cố định')}</div>
              <div className='fee-value'>{fee.fixedTransactionFee.value}</div>
            </div>
          </div>
        ))}
        <div className='fee-list-title'>{t('Pobo')}</div>
        <div className='fee-item-list-title-large'>
          <div className='fee-title-large'>{t('Phương thức TT')}</div>
          <div className='fee-title-large'>{t('Phí User')}</div>
          <div className='fee-title-large'>{t('Phí User cố định')}</div>
          <div className='fee-title-large'>{t('Phí đối soát')}</div>
          <div className='fee-title-large'>{t('Phí đối soát cố định')}</div>
        </div>
        {result?.newPoboFee?.map((fee, index) => (
          <div className='fee-item' key={index}>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phương thức TT')}</div>
              <div className='fee-value'>{t(fee.paymentMethodName)}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí User')}</div>
              <div className='fee-value'>{fee.gatewayFee?.value}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí User cố định')}</div>
              <div className='fee-value'>{fee.fixedGatewayFee.value}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí đối soát')}</div>
              <div className='fee-value'>{fee.transactionFee.value}</div>
            </div>
            <div className='fee-item-detail'>
              <div className='fee-title'>{t('Phí đối soát cố định')}</div>
              <div className='fee-value'>{fee.fixedTransactionFee.value}</div>
            </div>
          </div>
        ))}
      </div>
      <ApproveRejectMerchant
        t={t}
        info={info}
        closeDrawerDetail={closeDrawerDetail}
        handleRecall={handleRecall}
      />

      {isLoading && <Loading />}
    </>
  );
};

export default DetailApproveMerchant;
