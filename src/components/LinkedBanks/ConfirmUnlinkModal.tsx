import { LinkedBanksType } from 'models/linkedBanks';
import React, { FC } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { unlinkBankAction } from 'redux/actions/linkedBanksActions';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  hideModal: () => void;
  unlinkItem?: LinkedBanksType;
  setSubmitForm: () => void;
}

const ConfirmUnlinkModal: FC<Props> = ({ show, hideModal, unlinkItem, setSubmitForm }) => {
  const dispatch = useDispatch();
  const handleUnlinkBank = () => {
    const payload = {
      linkedId: unlinkItem && unlinkItem.id,
      phone: unlinkItem && unlinkItem.phone,
    };
    dispatch(
      unlinkBankAction(payload, (state, data) => {
        if (state) {
          alert('success', data.message);
          hideModal();
          setSubmitForm();
        } else {
          alert('error', data.message);
          hideModal();
        }
      })
    );
  };
  return (
    <Modal centered={true} show={show} onHide={hideModal}>
      <Modal.Header closeButton>
        <h4>Xác nhận hủy liên kết</h4>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc muốn hủy liên kết <b>{unlinkItem && unlinkItem.id}</b> ?
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleUnlinkBank} className='btn btn-primary btn-search'>
          <i className='fas fa-times'></i>
          Hủy liên kết
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmUnlinkModal;
