import React from 'react';
import {  Modal } from 'react-bootstrap';
import DataTableViewLogs from './DataTableViewLogs';

interface ModalViewLogsProps {
  t: (a: string) => string;
  show: boolean;
  logs: any[];
  handleClose: () => void;
  convertState: (state: string) => string;
}

const ModalViewLogs = ({
  t,
  show,
  handleClose,
  logs,
  convertState,
}: ModalViewLogsProps) => {
  return (
    <Modal className='modal-view-logs' show={show} backdrop='static' enforceFocus={false}>
      <Modal.Body>
        <div className='modal-view-logs__title'>
          <p>{t('Log')}</p>
          <img
            src='/assets/img/icon-close-modal.svg'
            className='icon-close-modal icon-close'
            onClick={handleClose}
            alt='close icon'
          />
        </div>
        <DataTableViewLogs t={t} logs={logs} convertState={convertState} />
      </Modal.Body>
    </Modal>
  );
};

export default ModalViewLogs;
