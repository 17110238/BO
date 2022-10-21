import { RefundEWalletTransactionInput } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { eWalletTransactionRefund } from 'redux/actions/eWalletTransactionHistoryActions';
import alert from 'utils/helpers/alert';

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall?: (a: boolean) => void;
  _id: number;
  lang: string;
}
const Refund = ({ t, show, handleClose, handleRecall, _id, lang }: Props) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);
  const handleTransactionRefund = () => {
    const payload: RefundEWalletTransactionInput = {
      id: _id,
    };
    setIsLoading(true);
    dispatch(
      eWalletTransactionRefund(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall?.(true);
        } else {
          alert('error', response?.message, t);
        }
        setIsLoading(false);
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
          {t('Bạn có đồng ý hoàn tiền giao dịch?')}
        </p>
        <div className='d-flex justify-content-center'>
          <Button
            className='btn-confirm'
            variant='secondary'
            onClick={() => handleTransactionRefund()}>
            {t('Đồng ý')}
          </Button>
          <Button variant='danger' className='btn-confirm' onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </div>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default Refund;
