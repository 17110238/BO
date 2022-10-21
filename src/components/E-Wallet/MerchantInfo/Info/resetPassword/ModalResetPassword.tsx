
import Loading from 'components/common/Loading/LoadingFullScreen';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { resetMerchantPassword } from 'redux/actions/merchantInfoActions';

interface ModalResetPasswordProps {
  t: (a: string) => string;
  show: boolean;
  orderId?: string;
  onHide: () => void;
}

const ModalResetPassword = ({ t, show, onHide }: ModalResetPasswordProps) => {
  const dispatch = useDispatch();
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loadingResetPassword);

  const {
    handleSubmit,
  } = useForm<any>();

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {
    const payload = {
      accountId: parseInt(accountId)
    }

    dispatch(
      resetMerchantPassword(payload, (status, response) => {
        if (status) {
          alert(
            'success',
            `${response?.message}\nMật khẩu mới: ${response?.data?.password}`,
            t
          )
          onHide();
        } else {
          alert('error', response?.message, t);
        }
      })
    );
  };

  return (
    <Modal className='modal-merchant-info-reset-password' show={show} backdrop='static' enforceFocus={false}>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className='merchant-info-reset-password-form-container'
        >
          <div className='content-wrapper'>
            <div className='confirm-message'>Bạn có muốn đặt lại mật khẩu tài khoản này không?</div>
          </div>

          <div className='btn-group mt-3'>
            <Button
              type='button'
              className='btn-cancel btn'
              variant='primary'
              onClick={onHide}>
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

export default ModalResetPassword;
