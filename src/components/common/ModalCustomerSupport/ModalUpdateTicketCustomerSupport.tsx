import GetLogsContainer from 'components/CsTool/GetLogs/GetLosContainer';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import TicketUpdateInfor from './TicketUpdateInfor';

interface Props {
  id?: number | any;
  show: boolean | undefined;
  onHide: (type?: string) => void;
  onResetId?: () => void;
  onCheckUpdate?: () => void;
  onSubmitForm?: () => void;
  onPreviewImg?: (e: React.MouseEvent<HTMLDivElement>,row?:any) => void ;
}

export const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: `1px solid #eff2f7`,
    color: state.isSelected ? '#0b0b0b' : '#0b0b0b',
    fontSize: '14px',
    fontFamily: 'Nunito Sans',
    height: 'auto',
    minHeight: '42px',
    display: 'inline-block',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 9999,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: 'none',
    background: 'none',
    borderRadius: '12px',
    color: '#00be00',
    height: '40px',
    minWidth: '107px',
    boxShadow: 'none',
  }),
};
const ModalUpdateTicketCustomerSupport: React.FC<Props> = ({
  id,
  show,
  onHide,
  onResetId,
  onSubmitForm,
  onCheckUpdate,
  onPreviewImg,
}) => {
  const { t } = useTranslation('common');
  const [check, setCheck] = useState<boolean>(false);
  const handleChanceCheckSubmit = () => {
    setCheck(!check);
  };

  const formInfo = useForm<any>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const {
    reset,
    formState: { errors },
    control,
  } = formInfo;

  const handleHide = () => {
    reset();
    onHide && onHide();
    onResetId && onResetId();
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      backdrop='static'
      // keyboard={false}
      className='update-ticket'>
      <Modal.Header closeButton>
        <Modal.Title>{t('Cập nhật Ticket')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {id && (
          <TicketUpdateInfor
            t={t}
            id={id}
            onHide={onHide}
            onResetId={onResetId}
            onSubmitForm={onSubmitForm}
            onHideCheck={handleChanceCheckSubmit}
            check={check}
            onHandleHide={handleHide}
            onPreviewImg={onPreviewImg}
          />
        )}
      </Modal.Body>
      <Modal.Header>
        <Modal.Title>
          <div className='title-get-logs'>{t('Lịch sử update ticket')}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{id && <GetLogsContainer id={+id} onPreviewImg={onPreviewImg} />}</Modal.Body>
      <Modal.Body> </Modal.Body>
    </Modal>
  );
};

export default ModalUpdateTicketCustomerSupport;
