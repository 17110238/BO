import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { confirmPaymeTransfer } from 'redux/actions';
import alert from "utils/helpers/alert";

interface ModalAddProps {
  idDetail?: string | string[];
  show: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
}

const ModalDetailTransfer = ({
  idDetail,
  show,
  handleClose,
  handleRefresh
}: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { handleSubmit, reset } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const handleCloseModal = () => {
    handleClose();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {
    setLoading(true);
    dispatch(
      confirmPaymeTransfer({
        campaignId: idDetail
      }, (status, res) => {
        if (res?.succeeded) {
          alert('success', res?.message, t);
          setLoading(false);
          handleCloseModal();
          handleRefresh();
        } else {
          alert('error', res?.message, t);
          setLoading(false);
        }
      })
    )
  }

  return (
    <Modal
      className='modal-multitransfer add-staff'
      show={show}
      onHide={handleCloseModal}
    >
      <div className='modal-multitransfer__title'>
        <p>{t(`Chuyển theo danh sách #${idDetail}`)}</p>
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
            <h4>Bạn có đồng ý chuyển không ?</h4>

          </div>
          <div className="btn-group mt-4">
            <div
              onClick={handleCloseModal}
              className='btn btn-filter-active'
            >
              Hủy
            </div>
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

export default ModalDetailTransfer;
