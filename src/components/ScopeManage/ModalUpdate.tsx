import { Scope } from 'models/scope';
import { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ScopeForm from './ScopeForm';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  defaultValue: Scope;
  onSubmit: (data: any) => void;
  editScopeGroup: (data: any) => void;
  addScopeGroupItem: (data: any) => void;
}

const ModalUpdateScope: FC<ModalProps> = ({
  showModal,
  closeModal,
  defaultValue,
  onSubmit,
  editScopeGroup,
  addScopeGroupItem,
}) => {
  const { t } = useTranslation('common');

  return (
    <Modal centered backdrop='static' show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <h3>{t('Cập nhật scope')}</h3>
      </Modal.Header>
      <Modal.Body>
        <ScopeForm
          addScopeGroupItem={addScopeGroupItem}
          editScopeGroup={editScopeGroup}
          submitForm={onSubmit}
          closeModal={closeModal}
          defaultValue={defaultValue}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalUpdateScope;
