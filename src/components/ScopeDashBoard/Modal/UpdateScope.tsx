import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { Scope } from 'models/scope';
import { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ScopeForm from './ScopeForm';

interface Props {
  showModal: boolean;
  closeModal: () => void;
  defaultValue: Scope;
  onSubmit: (data: any) => void;
  editScopeGroup: (data: any) => void;
  addScopeGroupItem: (data: any) => void;
  t: (a: string) => string;
  isLoading: boolean;
}

const UpdateScope: FC<Props> = ({
  showModal,
  closeModal,
  defaultValue,
  onSubmit,
  editScopeGroup,
  isLoading,
  addScopeGroupItem,
  t,
}) => {
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
          t={t}
        />
        {isLoading && <LoadingFullScreen />}
      </Modal.Body>
    </Modal>
  );
};

export default UpdateScope;
