import { Scope } from 'models/scope';
import { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  data: Scope;
  handleDeleteScope: (payload: any) => void;
}

const ModalDeleteScope: FC<ModalProps> = ({ data, showModal, closeModal, handleDeleteScope }) => {
  const { t } = useTranslation('common');

  const deleteScopeAction = () => {
    handleDeleteScope({ id: parseInt(data.id) });
  };

  return (
    <Modal centered backdrop='static' show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <h3>{t('Xóa scope')}</h3>
      </Modal.Header>
      <Modal.Body>
        <h5>{t('Bạn có đồng ý xóa scope', { scope: data.scope })}</h5>
        <div className='d-flex align-items-center justify-content-end mt-5'>
          <button onClick={closeModal} className='btn btn-outline-danger'>
            {t('Cancel')}
          </button>
          <button onClick={deleteScopeAction} className='btn btn-danger ml-2'>
            {t('Remove')}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDeleteScope;
