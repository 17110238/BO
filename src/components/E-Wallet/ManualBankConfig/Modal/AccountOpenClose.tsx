import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { UpdateEwalletDepositBankBoInput } from 'models';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { updateDepositBank } from 'redux/actions/manualBankAction';

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall: (a: boolean) => void;
  bankId: number;
  isActive: string;
}

const AccountOpenClose: React.FC<Props> = ({
  t,
  show,
  handleClose,
  bankId,
  isActive,
  handleRecall,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    isActive === 'isOpen' ? setIsOpen(true) : setIsOpen(false);
  }, [isActive]);
  const handleConfirmAliasName = () => {
    const payload: UpdateEwalletDepositBankBoInput = {
      id: bankId,
      isActive: isOpen,
    };
    setLoading(true);
    dispatch(
      updateDepositBank(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall?.(true);
        } else {
          alert('error', response?.message, t);
        }
        setLoading(false);
        handleClose();
      })
    );
  };

  return (
    <Modal className='modal-info-censor-confirm' show={show} onHide={handleClose}>
      <Modal.Body>
        <div className='text-center'>
          <i className='fa fa-question-circle mt-3 icon-close' aria-hidden='true' />
        </div>
        <p className='text-center mt-3 mb-2 font-weight-normal' style={{ fontSize: 16 }}>
          {t('Confirm transfer of bank account status?')}
        </p>
        <div className='d-flex justify-content-center'>
          <Button
            className='btn-confirm'
            variant='secondary'
            onClick={() => handleConfirmAliasName()}>
            {t('Đồng ý')}
          </Button>
          <Button variant='danger' className='btn-confirm' onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </div>
        {isLoading && <LoadingFullScreen />}
      </Modal.Body>
    </Modal>
  );
};

export default AccountOpenClose;
