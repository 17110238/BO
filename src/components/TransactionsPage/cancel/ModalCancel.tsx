import { yupResolver } from '@hookform/resolvers/yup';
import { CancelTransactionInput } from 'models';
import numeral from 'numeral';
import React, { useEffect, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { cancelTransaction } from 'redux/actions';
import alert from "utils/helpers/alert";
import formatCurrency from 'utils/helpers/formatCurrency';
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';

interface ModalCancelProps {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  transactionInfo: {
    amount?: number | 0;
    transactionId?: string;
    partnerId?: string;
  }
  handleRecall?: (a: boolean) => void;
}

const ModalCancel = ({
  t,
  show,
  handleClose,
  transactionInfo,
  handleRecall,
}: ModalCancelProps) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { transactionId, partnerId } = transactionInfo || {};
  const isLoading = useSelector<any>((state) => state?.transactions?.loadingModal);
  const schema = yup.object({
    reason: yup.string().test('length', 'Must be exactly more than 0 character', (val: any) => val.length > 0)
  }).required()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CancelTransactionInput>({
    mode: 'onChange',
    resolver: yupResolver<yup.AnyObjectSchema>(schema), //@hookform/resolvers/yup ^2.8.1 will fix
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const handleCloseModal = () => {
    handleClose();
    reset();
  }
  
  const onSubmit: SubmitHandler<CancelTransactionInput> = data => {
    const payload = {
      reason: data.reason,
      transaction: transactionId,
      partnerTransaction: partnerId,
    }

    dispatch(
      cancelTransaction(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall && handleRecall(true)
        } else {
          alert('error', response?.message, t);
        }
        handleCloseModal()
      })
    )
  };

  return (
    <Modal className='modal-refund-issue' show={show} onHide={handleCloseModal} backdrop="static">
      <Modal.Body>
        <div className='title-modal-refund'>
          <p>{t('Cancel Refund')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <Form.Group>
              <Form.Label className='label-control'>{t('Reason')}</Form.Label>
              <Form.Control
                as='textarea'
                className={`mb-1`}
                placeholder={t('Text something')}
                {...register("reason")}
                isInvalid={!!errors.reason}
              />
              <div className='invalid-value text-right'>
                {!!errors?.reason ?
                  t('The reason field is required.')
                  :
                  <div>&nbsp;</div>
                }
              </div>
            </Form.Group>
            <Button type="submit" className='btn-refund' variant='primary'>
              {t('Cancel Confirm')}
            </Button>
          </div>
        </Form>

      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalCancel;
