import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { changePOBO } from 'redux/actions';
import alert from 'utils/helpers/alert';
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { ChangePoboOrderStateInput } from 'models/pobo/poboState';

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall?: (a: boolean) => void;
}
const AddMenu = ({ t, show, handleClose, handleRecall }: Props) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const isLoading = useSelector<any>((state) => state?.transactions?.loadingModal);

  const schema = yup
    .object({
      state: yup.string().required(t('must_choose_status')),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ChangePoboOrderStateInput>({
    mode: 'onSubmit',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });
  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const handleCloseModal = () => {
    handleClose();
    reset();
  };

  // const transacttionStateOptions = transactionState.map((transaction) => ({
  //   value: transaction,
  //   label: t(`${transaction}`),
  // }));

  const onSubmit: SubmitHandler<ChangePoboOrderStateInput> = (data) => {
    const payload = {
      state: data.state,
    };
    dispatch(
      changePOBO(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleRecall?.(true);
        } else {
          alert('error', response?.message, t);
        }
        handleCloseModal();
      })
    );
  };

  return (
    <Modal
      className='modal-change-withdraw-issue'
      show={show}
      onHide={handleCloseModal}
      backdrop='static'>
      <Modal.Body>
        <div className='title-modal-change-withdraw'>
          <p>{t('UpdateTransactionStatus')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <Form.Group as={Col} className='transactionId mt-4' xl='12'>
              <Form.Label>
                {t('Mã giao dịch')}: <span className='font-weight-bold'>{}</span>
              </Form.Label>
            </Form.Group>
            <Button type='submit' className='btn-change-withdraw mt-5' variant='primary'>
              {t('Đồng ý')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default AddMenu;
