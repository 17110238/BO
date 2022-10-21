import { AlipayStoreTypes } from 'models';
import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface PropsComponent {
  isShow: boolean | undefined;
  onHide: () => void;
  data: AlipayStoreTypes;
}

export default function ModalStatusAlipay({ isShow, onHide, data }: PropsComponent) {
  const { t } = useTranslation('common');
  return (
    <Fragment>
      <Modal className='modal-statusAlipay' backdrop='static' show={isShow} onHide={onHide}>
        <Modal.Header closeButton>
          <div className='modal-statusAlipay-header'>
            <h2>{t('Thông tin store Alipay')}</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-statusAlipay-content'>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('MerchantId')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.merchantId}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Tên Merchant')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.merchantName}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Tên đầy đủ')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.accountInfo?.fullname}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Email')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.contact?.email}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Số điện thoại')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.contact?.phone}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Địa chỉ')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.registration?.address}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Số CMND')}</label>
              <div className='modal-statusAlipay-text'>
                <span>{data?.accountInfo?.identifyNumber}</span>
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Hình CMND mặt trước')}</label>
              <div className='modal-statusAlipay-text'>
                {data?.registration?.image?.front ? (
                  <img
                    src={process.env.NEXT_PUBLIC_API_UPLOAD + data?.registration?.image?.front}
                    alt='cmnd'
                  />
                ) : (
                  <span>[Chưa cập nhật]</span>
                )}
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Hình CMND mặt sau')}</label>
              <div className='modal-statusAlipay-text'>
                {data?.registration?.image?.back ? (
                  <img
                    src={process.env.NEXT_PUBLIC_API_UPLOAD + data?.registration?.image?.back}
                    alt='cmnd'
                  />
                ) : (
                  <span>[Chưa cập nhật]</span>
                )}
              </div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Type')}</label>
              <div className='modal-statusAlipay-text'>{data?.type}</div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Trạng thái')}</label>
              <div className='modal-statusAlipay-text'>{data?.state}</div>
            </div>
            <div className='modal-statusAlipay-group'>
              <label className='modal-statusAlipay-label'>{t('Thông tin thêm (lý do)')}</label>
              <div className='modal-statusAlipay-text'>{data?.reason}</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}
