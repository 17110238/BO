import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { useState } from 'react';
import { Col, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { unlinkConnectedUser } from 'redux/actions';
import alert from "utils/helpers/alert";

interface ModalAddProps {
  show: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  idDetail: string;
}

const ModalDelete = ({
  show,
  handleClose,
  handleRefresh,
  idDetail,
}: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { register, control, handleSubmit, reset, formState: { errors }, clearErrors, setValue } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
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

  const handleUnlinkConnectedUser = () => {
    dispatch(
      unlinkConnectedUser({id: +idDetail}, (status, response) => {
        if (response?.succeeded) {
          alert('success', response?.message, t);
          handleRefresh();
        } else {
          alert('error', response?.message, t);
        }
        handleClose()
      })
    )
  }

  return (
    <Modal
      className='modal-multitransfer modal-delete-connected add-staff'
      show={show}
      onHide={handleCloseModal}
    >
      <div className='modal-multitransfer__title'>
        <p>{t('Xóa danh sách liên kết')}</p>
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
            <h5>{`Bạn có đồng ý xóa danh sách liên kết #${idDetail} ?`}</h5>

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
              onClick={handleUnlinkConnectedUser}
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

export default ModalDelete;
