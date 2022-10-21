import { Modal, Button } from 'react-bootstrap';

interface ModalConfirmProps {
  show: boolean
  handleClose: () => void
}

const ModalConfirm = ({
  show,
  handleClose
}: ModalConfirmProps) => {

  return (
    <Modal
      show={show}
      onHide={handleClose}
      // keyboard={false}
      className="modal-confirm-transaction"
    >
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Đồng ý xác thực giao dịch?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary">Đồng ý</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirm;