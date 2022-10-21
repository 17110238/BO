import Loading from 'components/common/Loading/LoadingFullScreen';
import Nodata from 'components/common/NoData/Nodata';
import { ChangedInfoType } from 'models';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getChangedEwalletAccountInfo
} from 'redux/actions';
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

const DetailChangedInfoEwalletAccount: React.FC<DetailTransDrawerProps> = ({
  closeDrawerDetail, // đặt lại openDetailTrans false
  t,
  info,
  handleRecall,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ChangedInfoType[]>([]);
  const imageRegex = /(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/;
  const viewer = useRef<any>();
  const [imgSrc, setImgSrc] = useState('');
  const payload = {
    id: info.requestId,
  };

  useEffect(() => {
    setLoading(true)
    dispatch(
      getChangedEwalletAccountInfo(payload, (status, res) => {
        if (status) {
          setData(res);
        }
        setLoading(false)
      })
    )
  }, [])

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
    viewer.current && viewer.current.update();
  }, [imgSrc]);

  const convertInfo = (info: string) => {
    if (info === 'true') {
      return 'Mở'
    }

    if (info === 'false') {
      return 'Đóng'
    }

    return t(info);
  }

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
      {
        data.length ?
          <>
            <div className='box-body-payment'>
              <table className='changed-info-container'>
                <thead>
                  <tr>
                    <th>{t('Nội dung thay đổi')}</th>
                    <th>{t('Ban đầu')}</th>
                    <th>{t('Yêu cầu thay đổi')}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data?.map((info: ChangedInfoType | any, index: number) => (
                      <tr key={index}>
                        <td data-label={t('Nội dung thay đổi')}>{info.path}</td>
                        <td data-label={t('Ban đầu')}>
                          {convertInfo(info.before)}
                        </td>
                        <td data-label={t('Yêu cầu thay đổi')}>
                          {convertInfo(info.after)}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </ >
          :
          <Nodata imageDataEmpty={'/assets/img/no-data.png'} messageDataEmpty={'No data'} />
      }
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

export default DetailChangedInfoEwalletAccount;
