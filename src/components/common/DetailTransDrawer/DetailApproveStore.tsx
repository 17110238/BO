import Loading from 'components/common/Loading/LoadingFullScreen';
import ModalReject from 'components/Merchant/pendingListMerchant/ModalReject';
import dayjs from 'dayjs';
import { MerchantAccount, MerchantState } from 'models';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  approvePendingMerchant,
  getInfoMerchant,
  getListStore,
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

const DetailApproveStore: React.FC<DetailTransDrawerProps> = ({
  idDetail,
  closeDrawerDetail, // đặt lại openDetailTrans false
  showOtherDetail, // hiển thị popup khác
  t,
  info,
  handleRecall,
  submitForm,
}) => {
  const dispatch = useDispatch();
  const viewer = useRef<any>();
  const [data, setData] = useState<MerchantAccount | any>();
  const [address, setAddress] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const { targetCode, requestId, isTurn, state, methodName } = info || {};
  const isLoading = useSelector<any, MerchantState>((state) => state?.merchantRD?.loading);
  const payload: any = {
    filter: {
      storeId: [targetCode],
    },
  };
  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row?: any) => {
    viewer.current && viewer.current.show();
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };
  useEffect(() => {
    dispatch(
      getListStore(payload, (status, response) => {
        if (status) {
          setData(response?.data?.[0]);
          dispatch(
            getSubLocationList(
              { identifyCode: response?.data?.[0]?.registration?.locationIdentifyCode },
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
  }, []);
  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img') as HTMLElement;
    viewer.current =
      previewBlock &&
      new Viewer(previewBlock, {
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
        <div className='d-flex justify-content-between row-custom'>
          <div className='col-left'>{t('Thời gian')}:</div>
          <div className='col-right text-right'>
            {dayjs(data?.createdAt).format('HH:mm:ss DD/MM/YYYY')}
          </div>
        </div>
        {data?.storeId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>Mã cửa hàng:</div>
            <div className='col-right text-right'>{data?.storeId}</div>
          </div>
        )}
        {data?.businessCode && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Loại')}:</div>
            <div className='col-right text-right'>{t(`${data?.businessCode}`)}</div>
          </div>
        )}
        {data?.merchantName && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Tên cửa hàng')}:</div>
            <div className='col-right text-right'>{data?.merchantName}</div>
          </div>
        )}
        {data?.accountId && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Tên đăng nhập')}:</div>
            <div className='col-right text-right'>{data?.accountId}</div>
          </div>
        )}
        {methodName && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('PTTT')}:</div>
            <div className='col-right text-right'>{methodName}</div>
          </div>
        )}

        {methodName == 'Alipay (Online)' && (
          <div className='align-items-center row-custom'>
            <div className='col-left'>{t('Giấy phép kinh doanh')}:</div>
            <div className='col-right text-right d-flex preview-identity-img'>
              <div data-index={0} onClick={(e) => handlePreviewImg(e)} className='row-img-preview'>
                <img
                  src={process.env.NEXT_PUBLIC_API_UPLOAD + data?.merchantRegDoc[0]}
                  onError={handleErrorImage}
                />
              </div>
            </div>
          </div>
        )}

        {data?.website && methodName == 'Alipay (Online)' && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Địa chỉ website')}:</div>
            <div className='col-right text-right address'>
              <a href={`${data?.website}`} target='_blank'>
                {' '}
                {data?.website}
              </a>
            </div>
          </div>
        )}
        {methodName == 'Alipay (Offline)' && (
          <div className='align-items-center row-custom'>
            <div className='col-left'>{t('Hình ảnh cửa hàng')}:</div>
            <div className='col-right text-right d-flex preview-identity-img'>
              <div data-index={0} onClick={(e) => handlePreviewImg(e)} className='row-img-preview'>
                <img
                  src={process.env.NEXT_PUBLIC_API_UPLOAD + data?.registration?.images?.[0]}
                  onError={handleErrorImage}
                />
              </div>

              <div data-index={1} onClick={(e) => handlePreviewImg(e)} className='row-img-preview'>
                <img
                  src={process.env.NEXT_PUBLIC_API_UPLOAD + data?.registration?.images?.[1]}
                  onError={handleErrorImage}
                />
              </div>
            </div>
          </div>
        )}

        {/* {
          data?.businessOverview?.abbreviationName &&
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Mô tả')}</div>
            <div className='col-right text-right'>
              {data?.businessOverview?.abbreviationName}
            </div>
          </div>
        } */}
        {data?.address && (
          <div className='d-flex justify-content-between row-custom'>
            <div className='col-left'>{t('Địa chỉ')}:</div>
            <div className='col-right text-right address'>{data?.address + ', ' + address}</div>
          </div>
        )}
      </div>
      <ApproveRejectMerchant
        t={t}
        info={info}
        closeDrawerDetail={closeDrawerDetail}
        handleRecall={handleRecall}
      />
      {/* {isTurn && state === 'PENDING' && (
        <div className='approve-merchant-wrapper'>
          <div className='col-left mx-2'>
            <button className='btn btn-approve' onClick={handleAprroveMerchant}>
              <i className='fas fa-check'></i>
              {t('Duyệt')}
            </button>
          </div>
          <div className='col-right mx-2'>
            <button className='btn btn-cancel' onClick={() => setShow(true)}>
              <i className='fas fa-times'></i>
              {t('Từ chối')}
            </button>
          </div>
        </div>
      )}
      <ModalReject
        t={t}
        show={show}
        handleClose={() => setShow(false)}
        requestId={requestId}
        handleRecall={handleRecall}
        closeDrawerDetail={closeDrawerDetail}
      /> */}
      {isLoading && <Loading />}
    </>
  );
};

export default DetailApproveStore;
