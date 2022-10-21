import { yupResolver } from '@hookform/resolvers/yup';
import { RefundTransactionInput } from 'models';
import numeral from 'numeral';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getRefundAmountTransaction, refundTransaction } from 'redux/actions';
import alert from "utils/helpers/alert";
import formatCurrency from 'utils/helpers/formatCurrency';
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';

interface ModalRefundProps {
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

const ModalRefund = ({
  t,
  show,
  handleClose,
  transactionInfo,
  handleRecall,
}: ModalRefundProps) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const { transactionId, partnerId } = transactionInfo || {};
  const [amountRefund, setAmountRefund] = useState<number>(0);
  const isLoading = useSelector<any>((state) => state?.transactions?.loadingModal);
  const schema = yup.object({
    amount: yup.number().min(1000).max(amountRefund || 0).required(),
    reason: yup.string().test('length', 'Must be exactly more than 0 character', (val: any) => val.length > 0)
  }).required()

  const { register, handleSubmit, control, reset, formState: { errors }, getValues, setValue } = useForm<RefundTransactionInput>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver<yup.AnyObjectSchema>(schema), //@hookform/resolvers/yup ^2.8.1 will fix
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  useEffect(() => {
    transactionId && dispatch(
      getRefundAmountTransaction({ transactionId }, (status, response) => {
        if (status) {
          setValue('amount', response.refundAmount);
          setAmountRefund(response.refundAmount);
        }
      })
    )
    reset(transactionInfo);
  }, [transactionInfo])

  const handleCloseModal = () => {
    handleClose();
    reset();
  }
  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '')
  }

  const onSubmit: SubmitHandler<RefundTransactionInput> = data => {
    const payload = {
      amount: data?.amount,
      reason: data?.reason,
      partnerTransaction: partnerId,
      transaction: transactionId,
    }

    dispatch(
      refundTransaction(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall && handleRecall(true);
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
          <p>{t('Refund Payment')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <label className='label-control'>{t('Refund Amount')} (đ)</label>
            <Form.Group>
              <Controller
                defaultValue={amountRefund}
                control={control}
                name='amount'
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Form.Control
                    ref={inputRef}
                    className='mb-1'
                    maxLength={11}
                    onChange={(e) => onChange(+allowOnlyNumber(e.target.value))}
                    value={
                      value ? numeral(value).format('0,0') : ''
                    }
                    isInvalid={!!errors.amount}
                  />
                )}
              />
              <div className='invalid-value text-right'>
                {errors?.amount && amountRefund >= 1000 ?
                  t('Amount must be from 1,000 to ') + formatCurrency(amountRefund) + ' đ'
                  :
                  errors?.amount || amountRefund === 0 ?
                    t('Bạn đã hoàn hết số tiền giao dịch')
                    :
                    <div>&nbsp;</div>
                }
              </div>
              <Form.Label className='label-control'>{t('Reason')}</Form.Label>
              <Form.Control
                as='textarea'
                className={`form-control mb-1`}
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
            <Button disabled={!amountRefund} type="submit" className='btn-refund' variant='primary'>
              {t('Confirm refund')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalRefund;
