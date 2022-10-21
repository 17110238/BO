import Loading from 'components/common/Loading/LoadingFullScreen';
import { ChangedFeeType, ChangedInfoType, MerchantState, MethodChangedFeeType, noteInfoFeeType } from 'models';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChangedInfoFee } from 'redux/actions';
import Nodata from '../NoData/Nodata';
import ApproveRejectMerchant from './ApproveRejectMerchant';
import Viewer from 'viewerjs';

interface DetailTransDrawerProps {
  idDetail: number;
  closeDrawerDetail?: () => void;
  showOtherDetail?: ((type: string, itemId: number) => void) | undefined;
  t: (a: string) => string;
  info?: any;
  handleRecall?: (a: any) => void;
  submitForm?: boolean;
}

const DetailChangedInfoFee: React.FC<DetailTransDrawerProps> = ({
  idDetail, //payment id để gọi api
  closeDrawerDetail, // đặt lại openDetailTrans false
  showOtherDetail, // hiển thị popup khác
  t,
  info,
  handleRecall,
  submitForm,
}) => {
  const dispatch = useDispatch();
  const [changedInfoList, setChangedInfoList] = useState<ChangedFeeType[]>();
  const [noteInfo, setNoteInfo] = useState<noteInfoFeeType>();
  const isLoading = useSelector<any, MerchantState>((state) => state?.merchantRD?.loading);
  const [isLoadingDrawer, setLoadingDrawer] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState('');
  const viewer = useRef<any>();
  const payload = {
    id: info.requestId,
  };

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, img?: string) => {
    viewer.current && viewer.current.show();
    setImgSrc(img!);
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  useEffect(() => {
    setLoadingDrawer(true);
    dispatch(
      getChangedInfoFee(payload, (status, res) => {
        if (status) {
          setChangedInfoList(res.data);
          setNoteInfo(res.noteInfo);
        }
        setLoadingDrawer(false);
      })
    );
  }, []);

  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [imgSrc]);

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
          {t('Chi tiết yêu cầu ')} <span className='title-id'>{info.requestId}</span>
        </h6>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={closeDrawerDetail}
          alt='close-icon'
        />
      </div>
      <div className='box-body-payment'>
        {
          noteInfo?.description &&
          <div className='row-custom'>
            <div className='col-left'>Mô tả:</div>
            <div className='col-right text-right'>
              {noteInfo?.description}
            </div>
          </div>
        }
        {
          noteInfo?.images?.length ?
            <div className='row-custom'>
              <div className='col-left'>Hình ảnh:</div>
              <div className='col-right text-right d-flex image-preview-detail'>
                {
                  noteInfo?.images?.map((image, index) => {
                    if (image?.split('.').pop() === 'pdf') { //check file pdf
                      return <div
                        className='row-img-preview pdf mt-2'
                        data-index={index}
                        key={index}
                      >
                        <a href={process.env.NEXT_PUBLIC_API_UPLOAD + image} target='_blank'>
                          <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' alt='' />
                        </a>
                      </div>

                    } else {
                      return <div
                        className='row-img-preview mt-2'
                        data-index={index}
                        key={index}
                        onClick={(e) => handlePreviewImg(e, process.env.NEXT_PUBLIC_API_UPLOAD + image)}
                      >
                        <img
                          src={process.env.NEXT_PUBLIC_API_UPLOAD + image}
                          onError={handleErrorImage}
                        />
                      </div>
                    }
                  }
                  )
                }
              </div>
            </div>
            :
            null
        }
        <div className='row-custom'>
          <div className='col-left'>PTTT:</div>
        </div>
        {changedInfoList?.length
          ? changedInfoList?.map((changedInfo: ChangedFeeType, index: number) => (
            <>
              <div className='changed-info-fee-caption' key={index}>{t(`${changedInfo.method}`)}</div>
              {changedInfo?.data?.map((info: MethodChangedFeeType | any, index: number) => (
                <table className='changed-info-container ' key={index}>
                  <thead className='changed-info-fee-header'>
                    <tr key={index}>
                      <th>{t(`${info.type}`)}</th>
                      <th>{t('Ban đầu')}</th>
                      <th>{t('Yêu cầu thay đổi')}</th>
                    </tr>
                  </thead>
                  <tbody className='changed-info-fee-body'>
                    {info?.changedInfo &&
                      info.changedInfo.map((changedInfo: ChangedInfoType, index: number) => (
                        <tr key={index}>
                          <td data-label={t(`${info.type}`)}>{t(`${changedInfo.path}`)}</td>
                          <td data-label={t('Ban đầu')}>
                            {changedInfo.before}
                          </td>
                          <td data-label={t('Yêu cầu thay đổi')}>
                            {changedInfo.after}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ))}
            </>
          ))
          : !changedInfoList?.length && (
            <Nodata imageDataEmpty='' messageDataEmpty={t('No data')} />
          )
        }

      </div>
      <img src={imgSrc} className='d-none preview-identity-img' onError={handleErrorImage} />
      <ApproveRejectMerchant
        t={t}
        info={info}
        closeDrawerDetail={closeDrawerDetail}
        handleRecall={handleRecall}
      />
      {isLoading && <Loading />}
      {isLoadingDrawer && <Loading />}
    </>
  );
};

export default DetailChangedInfoFee;
