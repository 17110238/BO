import { yupResolver } from '@hookform/resolvers/yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { useState } from 'react';
import { Col, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { Input } from 'ui/Form';
import * as yup from 'yup';

interface ModalAddProps {
  show: boolean;
  handleClose: () => void;
  handleRefreshStaffList: () => void;
}

const templateTypes = [
  {
    label: 'Email',
    value: 'EMAIL'
  },
  {
    label: 'SMS',
    value: 'SMS'
  },
  {
    label: 'Thông báo',
    value: 'NOTIFICATION'
  },
];

const rulesForm = {
  company: { required: true },
  phone: { required: true, minLength: 10, maxLength: 10, isVNumber: true, isPhoneNumber: true },
};

const ModalDeleteStaff = ({
  show,
  handleClose,
  handleRefreshStaffList
}: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [data, setData] = useState<object[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const schema = yup.object({
    company: yup.string().required(),
    phone: yup.string().matches(new RegExp('[0-9]{7}'))
  }).required()

  const { register, control, handleSubmit, reset, formState: { errors }, clearErrors, setValue } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    // resolver: yupResolver<any>(schema),
  });

  const handleCloseModal = () => {
    handleClose();
    reset();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {
    console.log({ data });

  }

  return (
    <Modal
      className='modal-multitransfer add-staff'
      show={show}
      onHide={handleCloseModal}
    >
      <div className='modal-multitransfer__title'>
        <p>{t('Xóa nhân viên')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt='close icon'
        />
      </div>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className="multitransfer-form-container mt-4"
        >
          <div className="text-center">
            <h5>Bạn có đồng ý xóa nhân viên --staff.name-- ?</h5>

          </div>
          <div className="btn-group mt-4">
            <button
              onClick={handleCloseModal}
              className='btn btn-filter-active'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='btn btn-primary'
            >
              Đồng ý
            </button>
          </div>
        </form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalDeleteStaff;
