import Loading from 'components/common/Loading/LoadingFullScreen';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { resetMerchantPassword, unlockKyc } from 'redux/actions/merchantInfoActions';

interface ModalUnlockKycProps {
  t: (a: string) => string;
  show: boolean;
  kycId: number;
  onHide: () => void;
  updateMerchantInfo: () => void;
}

const ModalUnlockKyc = ({ t, show, kycId, onHide, updateMerchantInfo }: ModalUnlockKycProps) => {
  const dispatch = useDispatch();
  const isLoading = useSelector<any, boolean>(
    (state) => state?.merchantInfoReducer.loadingResetPassword
  );

  const { handleSubmit } = useForm<any>();

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = () => {
    dispatch(
      unlockKyc({ kycId }, (status, response) => {
        if (status) {
          updateMerchantInfo();
          alert('success', response, t);
          onHide();
        } else {
          alert('error', response, t);
          onHide();
        }
      })
    );
  };

  return (
    <Modal
      className='modal-merchant-info-reset-password'
      show={show}
      backdrop='static'
      enforceFocus={false}>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className='merchant-info-reset-password-form-container'>
          <div className='content-wrapper'>
            <div className='confirm-message'>
              Bạn có muốn mở khóa định danh?
            </div>
          </div>

          <div className='btn-group mt-3'>
            <Button type='button' className='btn-cancel btn' variant='primary' onClick={onHide}>
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

export default ModalUnlockKyc;
