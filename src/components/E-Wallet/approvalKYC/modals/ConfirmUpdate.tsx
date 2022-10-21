import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  submitFormWithType: (type: string) => void;
  typeSubmit: string;
}

const ConfirmUpdate: React.FC<Props> = ({
  t,
  show,
  handleClose,
  submitFormWithType,
  typeSubmit,
}) => {
  const handleConfirmUpdate = () => {
    submitFormWithType(typeSubmit);
  };

  return (
    <Modal className='modal-info-censor-confirm' show={show} onHide={handleClose} backdrop='static'>
      <Modal.Body>
        <div className='text-center'>
          <i className='fa fa-question-circle mt-3 icon-close' aria-hidden='true' />
        </div>
        <p className='text-center mt-3 mb-2 font-weight-normal' style={{ fontSize: 16 }}>
          {t('Bạn có muốn tiếp tục ?')}
        </p>
        <div className='d-flex justify-content-center'>
          <Button className='btn-confirm' variant='secondary' onClick={() => handleConfirmUpdate()}>
            {t('Đồng ý')}
          </Button>
          <Button variant='danger' className='btn-confirm' onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmUpdate;
