import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileAliasActionEnum, ProfileAliasInput } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { convertEnumtoArray } from 'utils/helpers/convertEnumtoArray';
import alert from 'utils/helpers/alert';
import { getListInfoBank, updateRefundAliasName } from 'redux/actions';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall?: (a: boolean) => void;
  action: string;
  aliasName: string;
  profiledAliasId: number;
}

const actionOptions = [...convertEnumtoArray(ProfileAliasActionEnum)];

const UpdateAlias = ({
  t,
  show,
  handleClose,
  handleRecall,
  action,
  aliasName,
  profiledAliasId,
}: Props) => {
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch();
  const schema = yup
    .object({
      aliasName: yup.string().required(t('Phải nhập AliasName')),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileAliasInput>({
    mode: 'all',
    resolver: yupResolver<yup.AnyObjectSchema>(schema),
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, [show]);

  const handleCloseModal = () => {
    handleClose();
    reset();
  };
  const [aliasNameDefault, setAliasNameDefault] = useState<string>('');
  useEffect(() => {
    setAliasNameDefault(aliasName);
  }, [aliasName]);
  const handleChangeValue = (e: any) => {
    setAliasNameDefault(e.target.value);
  };

  const loading = useSelector<any>((state) => state?.infoCensorReducer?.loading);

  const onSubmit: SubmitHandler<ProfileAliasInput> = (data) => {
    const payload = {
      aliasName: aliasNameDefault,
      action: actionOptions.find((value) => value === action),
      profiledAliasId,
    };
    dispatch(
      updateRefundAliasName(payload, (status, response) => {
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
      className='modal-change-transaction-history-issue'
      show={show}
      onHide={handleClose}
      backdrop='static'>
      <Modal.Body>
        <div className='title-modal-change-transaction-history'>
          <p>{t('Cập Nhật Aliasname')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleClose}
            alt=''
          />
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group form-element-textarea mb-20'>
            <Form.Group as={Col} className='mt-4' xl='12'>
              <Form.Control
                className={`form-control mb-1`}
                {...register('aliasName')}
                value={aliasNameDefault}
                placeholder={`${t('Enter')} aliasname`}
                onChange={(e: any) => handleChangeValue(e)}
              />
              {errors?.aliasName?.message && (
                <p className='text-danger mt-1'>{errors.aliasName.message}</p>
              )}
            </Form.Group>
            <Button type='submit' className='btn-change-transaction-history mt-5' variant='primary'>
              {t('Đồng ý')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {loading && <LoadingFullScreen />}
    </Modal>
  );
};

export default UpdateAlias;
