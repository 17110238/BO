import React from 'react';
import { Button, Modal } from 'react-bootstrap';
interface Props {
  t: (a: string) => string;
  handleClose: () => void;
  show: boolean;
}

const RefuseAvatar: React.FC<Props> = ({ t, handleClose, show }) => {
  return (
    <Modal className='modal-refuse-avatar' show={show} onHide={handleClose}>
      <Modal.Body>
        <div className='text-center'>
          <i className='fa fa-times-circle mt-3 icon-close' aria-hidden='true' />
        </div>
        <p className='text-center mt-3 font-weight-normal' style={{ fontSize: 18 }}>
          {t('Phải chọn avatar')}
        </p>
        <div className='d-flex justify-content-center'>
          <Button type='submit' className='btn-ok' variant='info' onClick={handleClose}>
            Ok
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RefuseAvatar;
