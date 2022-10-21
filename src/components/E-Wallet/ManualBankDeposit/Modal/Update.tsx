import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateEwalletDepositPaymentInput } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import alert from 'utils/helpers/alert';
import { updateBankPayment } from 'redux/actions/manualBankAction';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall?: (a: boolean) => void;
  bankTransaction: string;
  transaction: string;
}

const Update: React.FC<Props> = ({
  t,
  show,
  handleClose,
  handleRecall,
  bankTransaction,
  transaction,
}) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const schema = yup
    .object({
      reason: yup.string().required(t('Giá trị này là bắt buộc.')),
      phone: yup.string().required(t('Giá trị này là bắt buộc.')),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateEwalletDepositPaymentInput>({
    mode: 'onBlur',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const handleCloseModal = () => {
    handleClose();
    reset();
  };
  const onSubmit: SubmitHandler<UpdateEwalletDepositPaymentInput> = (data) => {
    const payload = {
      reason: data.reason,
      transaction,
      phone: data.phone,
    };
    setLoading(true);
    dispatch(
      updateBankPayment(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall?.(true);
          reset();
        } else {
          alert('error', response?.message, t);
        }
        setLoading(false);
        handleCloseModal();
      })
    );
  };

  const handleOnlyEnterNumber = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Modal
      className='modal-transaction-update-issue'
      show={show}
      onHide={handleCloseModal}
      backdrop='static'>
      <Modal.Body>
        {isLoading && <LoadingFullScreen />}
        <div className='title-modal-transaction-update'>
          <p>
            {t('Cập nhật giao dịch')}:{' '}
            <span className='font-weight-bold text-info'>{bankTransaction}</span>
          </p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <Form.Group as={Col} className='mt-4 d-flex align-items-center' xl='12'>
              <Form.Label className='label-control with-label'>{t('Số Điện Thoại Ví')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Số Điện Thoại Ví')}`}
                  {...register('phone')}
                  onKeyPress={(event: any) => {
                    handleOnlyEnterNumber(event);
                  }}
                />
                {errors?.phone?.message && (
                  <p className='text-danger mt-1'>{errors.phone.message}</p>
                )}
              </div>
            </Form.Group>

            <Form.Group as={Col} className='mt-4 d-flex' xl='12'>
              <Form.Label className='label-control with-label mt-1'>{t('Reason')}</Form.Label>
              <div className='flex-grow-1'>
                <Form.Control
                  as='textarea'
                  className={`form-control mb-1`}
                  placeholder={`${t('Enter')} ${t('Reason')}`}
                  {...register('reason')}
                />
                {errors?.reason?.message && (
                  <p className='text-danger mt-1'>{errors.reason.message}</p>
                )}
              </div>
            </Form.Group>

            <Button type='submit' className='btn-transaction-update mt-5' variant='primary'>
              {t('Lưu giao dịch')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Update;
