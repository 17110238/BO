import { Scope } from 'models/scope';
import { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ScopeForm from './ScopeForm';

interface ModalCreateProps {
  showModal: boolean;
  closeModal: () => void;
  defaultValue: Scope;
  editScopeGroup: (data: any) => void;
  onSubmit: (data: any) => void;
  addScopeGroupItem: (data: any) => void;
}

const ModalCreateScope: FC<ModalCreateProps> = ({
  showModal,
  closeModal,
  onSubmit,
  addScopeGroupItem,
  defaultValue,
  editScopeGroup,
}) => {
  const { t } = useTranslation('common');
  return (
    <Modal centered backdrop='static' show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <h3>{t('Thêm scope')}</h3>
      </Modal.Header>
      <Modal.Body>
        <ScopeForm
          defaultValue={defaultValue}
          editScopeGroup={editScopeGroup}
          addScopeGroupItem={addScopeGroupItem}
          submitForm={onSubmit}
          closeModal={closeModal}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateScope;
