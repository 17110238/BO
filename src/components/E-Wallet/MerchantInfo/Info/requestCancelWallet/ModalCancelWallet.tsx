import { yupResolver } from '@hookform/resolvers/yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { ReactNode, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import * as yup from 'yup';
import { requestCancelMerchantWallet } from 'redux/actions/merchantInfoActions';

interface ModalRequestCancelWalletProps {
  t: (a: string) => string;
  show: boolean;
  orderId?: string;
  onHide: () => void;
}

const ModalRequestCancelWallet = ({ t, show, onHide }: ModalRequestCancelWalletProps) => {
  const dispatch = useDispatch();
  const accountId = useSelector<any, string>(
    (state) => state?.merchantInfoReducer.accountId
  );
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingRequestCancelWallet
  );

  const schema = yup
    .object({
      reason: yup.string().required()
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver<any>(schema),
  });

  useEffect(() => {
    if (show) {
      setFocus('reason');
    }
  }, [show]);

  const onHideModal = () => {
    onHide();
    reset();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = ({ reason }) => {
    const payload = {
      accountId: parseInt(accountId),
      reason
    }

    dispatch(
      requestCancelMerchantWallet(payload, (status, response) => {
        if (status) {
          alert('success', response, t);
          onHideModal();
        } else {
          alert('error', response, t);
        }
      })
    );
  };

  return (
    <Modal
      className='modal-merchant-info-cancel-wallet'
      show={show}
      backdrop='static'
      enforceFocus={false}
    >
      <Modal.Body>
        <Form
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className='merchant-info-cancel-wallet-form-container'
        >
          <div className='content-wrapper'>
            <div className='confirm-message'>Nhập lý do hủy TK ví</div>
            <Form.Control
              type='text'
              {...register('reason')}
            />
            {errors?.reason && (
              <div className='reason-error-text'>{t('Lý do hủy không được để trống')}</div>
            )}
          </div>

          <div className='btn-group'>
            <Button
              type='button'
              className='btn-cancel btn'
              variant='primary'
              onClick={onHideModal}>
              {t('Hủy')}
            </Button>
            <Button type='submit' className='btn-submit btn' variant='primary'>
              {t('Xác nhận')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalRequestCancelWallet;
