import Loading from 'components/common/Loading/LoadingFullScreen';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import TabConfigAccount from './TabConfigAccount';

interface ModalConfigAccountProps {
  t: (a: string) => string;
  show: boolean;
  orderId?: string;
  onHide: () => void;
  tabActive: number;
}

const ModalConfigAccount = ({
  t,
  show,
  onHide,
  tabActive,
}: ModalConfigAccountProps) => {
  const accountId = useSelector<any, string>(
    (state) => state?.merchantInfoReducer.accountId
  );
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loadingUpdate)

  return (
    <Modal
      className='modal-merchant-info-config-account'
      show={show}
      backdrop='static'
      enforceFocus={false}>
      <Modal.Body>
        <div className='modal-transfer__title title-with-tab'>
          <p>{t('Cấu Hình Tài Khoản')} {accountId}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={onHide}
            alt='close icon'
          />
        </div>
        <TabConfigAccount tabActive={tabActive} onHide={onHide} />
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalConfigAccount;
