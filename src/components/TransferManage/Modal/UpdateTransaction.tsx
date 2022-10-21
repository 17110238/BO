import { yupResolver } from '@hookform/resolvers/yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { ReactNode, useEffect, useMemo, useState, useRef, Fragment } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import alert from 'utils/helpers/alert';
import * as yup from 'yup';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { updateMismatchTransaction } from 'redux/actions/transferActions';
import { useSelector } from 'react-redux';
import { TransferState, UpdateMismatchTransactionInput } from 'models/transfer';

interface ModalUpdateTransactionProps {
  t: (a: string) => string;
  show: boolean;
  paymentId?: string;
  supplierTransaction?: string;
  actions: string[];
  handleClose: () => void;
  setSubmitForm: (a: boolean) => void;
}

const ModalUpdateTransaction = ({
  t,
  show,
  handleClose,
  paymentId,
  supplierTransaction,
  actions,
  setSubmitForm,
}: ModalUpdateTransactionProps) => {
  const dispatch = useDispatch();
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('NOT_MATCH_ORDER');
  const isLoading = useSelector<any, TransferState>(
    (state) => state?.transferReducer.loadingUpdateTransaction
  );
  const handleChangeTransactionType = (value: any) => {
    setSelectedTransactionType(value);
  };

  const [isOrderIdValid, setIsOrderIdValid] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);

  const schema = yup
    .object({
      paymentIdUpdate: isOrderIdValid ? yup.string().required() : yup.string(),
    })
    .required();

  const getTransType = () => {
    if (actions.length === 2) {
      return t('Sai Mã giao dịch (Chuyển tài khoản cũ)');
    }

    if (actions.length === 3) {
      return t('Đúng Mã giao dịch, lệch tiền');
    }
  };

  const subTransTypesNoAmount = [
    {
      label: 'Xác định được OrderID',
      value:
        actions[0] === 'NOT_MATCH_ORDER'
          ? 'NOT_MATCH_ORDER'
          : actions[0] === 'NOT_MATCH_AMOUNT'
          ? 'NOT_MATCH_AMOUNT'
          : '',
    },
    {
      label: 'Không xác định được OrderID',
      value: 'TOPUP',
    },
  ];

  const subTransTypesHasAmount = [
    {
      label: 'Xác định được OrderID',
      value: actions[0] === 'NOT_MATCH_ORDER' ? 'NOT_MATCH_ORDER' : '',
    },
    {
      label: 'Xác định được OrderID mới',
      value: actions[1] === 'NOT_MATCH_AMOUNT' ? 'NOT_MATCH_AMOUNT' : '',
    },
    {
      label: 'Không xác định được OrderID',
      value: 'TOPUP',
    },
  ];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  useEffect(() => {
    if (actions.length === 2) {
      setSelectedTransactionType(actions[0]);
    }
    if (actions.length === 3) {
      setSelectedTransactionType(actions[0]);
    }
  }, [actions]);

  const handleCloseModal = () => {
    handleClose();
    setIsCanceled(false);
    reset();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data: any) => {
    let type;
    if (actions.length === 1) {
      type = selectedTransactionType;
    } else {
      type = selectedTransactionType;
    }
    const payload: UpdateMismatchTransactionInput = {
      type,
      supplierTransaction,
      paymentId,
    };
    if (!actions.includes('TOPUP') || selectedTransactionType !== 'TOPUP') {
      payload.cancel = isCanceled;
    }

    if (selectedTransactionType === 'NOT_MATCH_ORDER') {
      payload.paymentIdUpdate = data.paymentIdUpdate;
    }
    !data.paymentIdUpdate && delete payload.paymentIdUpdate;
    dispatch(
      updateMismatchTransaction(payload, (status, response) => {
        if (status) {
          alert('success', response, t);
          setSubmitForm && setSubmitForm(true);
          handleCloseModal();
        } else {
          alert('error', response, t);
          handleCloseModal();
        }
      })
    );
  };

  return (
    <Modal className='modal-transfer' show={show} backdrop='static' enforceFocus={false}>
      <Modal.Body>
        <div className='modal-transfer__title border-bottom pb-3'>
          <p>{t('Thao tác')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleCloseModal}
            alt='close icon'
          />
        </div>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete='off'
          onKeyDown={(e) => checkKeyDown(e)}
          className='transfer-form-container'>
          <div className='content-wrapper'>
            <div className='inputs-group'>
              <div className={`form-group-update-transaction`}>
                <label>{t('Loại giao dịch')}</label>
                <div className='trans-type'>{getTransType()}</div>
                <Controller
                  control={control}
                  name={'type'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      styles={{
                        ...customStyles,
                        menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                        menu: (provided) => ({ ...provided, zIndex: 2 }),
                      }}
                      defaultValue={
                        actions.length === 2 ? subTransTypesNoAmount[0] : subTransTypesHasAmount[0]
                      }
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: '#EFF2F7',
                          primary: '#00be00',
                        },
                      })}
                      options={
                        actions.length === 2 ? subTransTypesNoAmount : subTransTypesHasAmount
                      }
                      value={
                        actions.length === 2
                          ? subTransTypesNoAmount.find((val) => val.value === value)
                          : subTransTypesHasAmount.find((val) => val.value === value)
                      }
                      onChange={(e: any) => {
                        onChange(e.value);
                        handleChangeTransactionType(e.value);
                        clearErrors();
                      }}
                    />
                  )}
                />
              </div>

              <div className='corresponding-box'>
                {(selectedTransactionType === 'NOT_MATCH_AMOUNT' ||
                  selectedTransactionType === 'CANCEL_ORDER') && (
                  <div className='transaction-type-1'>
                    <div className='confirm-message'>
                      Bạn muốn xác nhận hay huỷ order ID{' '}
                      <span className='font-weight-bold'>{paymentId}</span> (mã trên hệ thống)?
                    </div>
                  </div>
                )}

                {selectedTransactionType === 'NOT_MATCH_ORDER' && (
                  <div className='transaction-type-2'>
                    <div className='confirm-message'>
                      Bạn muốn huỷ mã OrderID <span className='font-weight-bold'>{paymentId}</span>{' '}
                      hay xác nhận giao dịch cho mã OrderID mới?
                    </div>
                    <div className='form-group-update-transaction-corresponding'>
                      <label>{t('OrderID hiện tại')}</label>
                      <Form.Control
                        type='text'
                        value={paymentId}
                        {...register('paymentId')}
                        disabled
                      />
                    </div>
                    <div
                      className={`form-group-update-transaction-corresponding ${
                        errors?.newOrderId ? 'form-group-error' : ''
                      }`}>
                      <label>{t('OrderID mới')}</label>
                      <div className='input-group-id'>
                        <Form.Control
                          type='text'
                          placeholder='Nhập OrderID mới'
                          {...register('paymentIdUpdate')}
                        />
                        {errors?.paymentIdUpdate && (
                          <span className='id-error-text'>
                            {t('OrderID mới không được để trống')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTransactionType === 'TOPUP' && (
                  <div className='transaction-type-2'>
                    <div className='form-group-update-transaction-corresponding'>
                      <label>{t('OrderID hiện tại')}</label>
                      <Form.Control
                        type='text'
                        value={paymentId}
                        {...register('paymentId')}
                        disabled
                      />
                    </div>
                    <div className='confirm-message'>Bạn có muốn Topup hay không?</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='btn-group mt-3'>
            {selectedTransactionType === 'TOPUP' && (
              <Fragment>
                <Button
                  type='button'
                  className='btn-cancel btn'
                  variant='primary'
                  onClick={handleClose}>
                  {t('Không')}
                </Button>
                <Button type='submit' className='btn-submit btn' variant='primary'>
                  {t('Có')}
                </Button>
              </Fragment>
            )}

            {selectedTransactionType !== 'TOPUP' && (
              <Fragment>
                <Button
                  type='submit'
                  className='btn-cancel btn'
                  variant='primary'
                  onClick={() => {
                    setIsOrderIdValid(false);
                    setIsCanceled(true);
                  }}>
                  {t('Hủy OrderID')}
                </Button>
                <Button
                  type='submit'
                  className='btn-submit btn'
                  variant='primary'
                  onClick={() => {
                    selectedTransactionType === 'NOT_MATCH_ORDER' && setIsOrderIdValid(true);
                  }}>
                  {t('Xác nhận')}
                </Button>
              </Fragment>
            )}
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalUpdateTransaction;
