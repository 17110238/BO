import Loading from 'components/common/Loading/LoadingFullScreen';
import { GetMerchantActiveInfoResponsed, MerchantState } from 'models';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMerchantActiveInfo } from 'redux/actions';
import Nodata from '../NoData/Nodata';
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

const DetailApproveActiveMerchant: React.FC<DetailTransDrawerProps> = ({
  idDetail, //payment id để gọi api
  closeDrawerDetail, // đặt lại openDetailTrans false
  showOtherDetail, // hiển thị popup khác
  t,
  info,
  handleRecall,
  submitForm,
}) => {
  const dispatch = useDispatch();
  const [changedInfoList, setChangedInfoList] = useState<GetMerchantActiveInfoResponsed>();
  const isLoading = useSelector<any, MerchantState>((state) => state?.merchantRD?.loading);
  const [isLoadingDrawer, setLoadingDrawer] = useState<boolean>(false);
  const payload = {
    id: info.requestId,
  };

  useEffect(() => {
    setLoadingDrawer(true);
    dispatch(
      getMerchantActiveInfo(payload, (status, res) => {
        if (status) {
          setChangedInfoList(res);
        }
        setLoadingDrawer(false);
      })
    );
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
        {changedInfoList
          ?
          <>
            <div className='row-custom'>
              <div className='col-left'>{t('Mã đối tác:')}</div>
              <div className='col-right text-right'>
                {changedInfoList?.merchantId}
              </div>
            </div>
            <div className='row-custom'>
              <div className='col-left'>{t('Tên đối tác:')}</div>
              <div className='col-right text-right'>
                {changedInfoList?.title}
              </div>
            </div>
            <div className='row-custom'>
              <div className='col-left'>{t('Trạng thái:')}</div>
              <div className='col-right text-right'>
                {changedInfoList?.isActive ?
                  <span className='state-success-modal'>Đang hoạt động</span>
                  :
                  <span className='state-cancel-modal'>Ngưng hoạt động</span>
                }
              </div>
            </div>
          </>
          : !changedInfoList && (
            <Nodata imageDataEmpty='' messageDataEmpty={t('No data')} />
          )}
      </div>
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

export default DetailApproveActiveMerchant;
