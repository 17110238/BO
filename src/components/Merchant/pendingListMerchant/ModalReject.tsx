import { yupResolver } from '@hookform/resolvers/yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { MerchantState, RejectPendingRequestInput } from 'models';
import React, { useEffect, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { rejectPendingMerchant } from 'redux/actions';
import alert from "utils/helpers/alert";
import * as yup from 'yup';

interface ModalRejectProps {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  submitForm?: boolean;
  requestId: number;
  handleRecall?: (a: any) => void;
  closeDrawerDetail?: () => void;
}

const ModalReject = ({
  t,
  show,
  handleClose,
  requestId,
  handleRecall,
  closeDrawerDetail,
}: ModalRejectProps) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const isLoading = useSelector<any, MerchantState>((state) => state?.merchantRD?.loading);
  const schema = yup.object({
    reason: yup.string().test('length', 'Must be exactly more than 0 character', (val: any) => val.length > 0)
  }).required()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RejectPendingRequestInput>({
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

  const onSubmit: SubmitHandler<RejectPendingRequestInput> = data => {
    const payload = {
      requestId,
      reason: data?.reason
    }

    dispatch(
      rejectPendingMerchant(payload, (status, response) => {
        if(status) {
          alert('success', response.message, t);
          handleRecall && handleRecall(true);
          closeDrawerDetail && closeDrawerDetail();
          handleCloseModal();
        } else {
          alert('error', response.message, t);
        }
      })
    )
  };

  return (
    <Modal className='modal-refund-issue' show={show} onHide={handleCloseModal} backdrop="static">
      <Modal.Body>
        <div className='title-modal-refund'>
          <p>{t('Từ chối yêu cầu này')}</p>
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
              {t('Confirm')}
            </Button>
          </div>
        </Form>

      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalReject;
