import Loading from 'components/common/Loading/LoadingFullScreen';
import Nodata from 'components/common/NoData/Nodata';
import { ChangedInfoType } from 'models';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getChangedInfo, getChangedStateCoboPobo } from 'redux/actions';
import Viewer from 'viewerjs';
import ApproveRejectMerchant from './ApproveRejectMerchant';
import dayjs from 'dayjs';

interface DetailTransDrawerProps {
  idDetail: number;
  closeDrawerDetail?: () => void;
  showOtherDetail?: ((type: string, itemId: number) => void) | undefined;
  t: (a: string) => string;
  info?: any;
  handleRecall?: (a: any) => void;
  submitForm?: boolean;
}

const DetailChangeStateCoboPobo: React.FC<DetailTransDrawerProps> = ({
  closeDrawerDetail, // đặt lại openDetailTrans false
  t,
  info,
  handleRecall,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ChangedInfoType[]>([]);
  const [transactionId, setTransactionId] = useState<string>('');
  const [imgSrc, setImgSrc] = useState('');
  const viewer = useRef<any>();
  const payload = {
    id: info.requestId,
  };
  const imageRegex = /(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/;

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
    setLoading(true);
    dispatch(
      getChangedStateCoboPobo(payload, (status, res) => {
        if (status) {
          setData(res.data);
          setTransactionId(res.transaction)
        }
        setLoading(false);
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

  const convertInfo = (infoList: string[]) => {
    return infoList?.map((info, index: number) => {
      if (imageRegex.test(info)) {
        return (
          <div key={index}>
            <div
              className='row-img-preview'
              data-index={index}
              key={index}
              onClick={(e) => handlePreviewImg(e, process.env.NEXT_PUBLIC_API_UPLOAD + info)}>
              <img src={process.env.NEXT_PUBLIC_API_UPLOAD + info} onError={handleErrorImage} />
            </div>
          </div>
        );
      }

      if (info?.split('.').pop() === 'pdf') {
        //check file pdf
        return (
          <div key={index}>
            <div className='row-img-preview pdf' data-index={index} key={index}>
              <a href={process.env.NEXT_PUBLIC_API_UPLOAD + info} target='_blank'>
                <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' alt='' />
              </a>
            </div>
          </div>
        );
      }
      if (dayjs(info).isValid() && info.includes('-')) {
        // check valid date
        return dayjs(info).format('DD/MM/YYYY');
      }

      return <p key={index}>{t(info)}</p>;
    });
  };

  return (
    <>
      <img src={imgSrc} className='d-none preview-identity-img' onError={handleErrorImage} />
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
      {data.length ? (
        <>
          <div className='box-body-payment'>
            <div className='row-custom'>
              <div className='col-left'>Mã giao dịch:</div>
              <div className='col-right text-right'>
                {transactionId}
              </div>
            </div>
            <table className='changed-info-container'>
              <thead>
                <tr>
                  <th>{t('Nội dung thay đổi')}</th>
                  <th>{t('Ban đầu')}</th>
                  <th>{t('Yêu cầu thay đổi')}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((info: ChangedInfoType, index: number) => (
                  <tr key={index}>
                    <td data-label={t('Nội dung thay đổi')}>{info.path}</td>
                    <td data-label={t('Ban đầu')}>
                      <div className='info'>{convertInfo(info.before!)}</div>
                    </td>
                    <td data-label={t('Yêu cầu thay đổi')}>
                      <div className='info'>{convertInfo(info.after!)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Nodata imageDataEmpty={'/assets/img/no-data.png'} messageDataEmpty={'No data'} />
      )}
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

export default DetailChangeStateCoboPobo;

