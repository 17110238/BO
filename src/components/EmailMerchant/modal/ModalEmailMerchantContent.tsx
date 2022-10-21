// import customStyles from 'utils/helpers/customStylesForReactSelect';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getInformationEmailMerchant } from 'redux/actions';

interface Props {
  id?: number | any;
  show: boolean | undefined;
  onHide: (type?: string) => void;
  templateContent?: any;
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

  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
const ModalEmailMerchantContent: React.FC<Props> = ({ show, onHide, templateContent }) => {
  const { t } = useTranslation('common');

  const handleHide = () => {
    onHide && onHide();
  };
  return (
    <Modal
      show={show}
      onHide={handleHide}
      backdrop='static'
      // keyboard={false}
      className='modal-email-merchant-container'>
      <Modal.Header closeButton>
        <Modal.Title>{t('Nội dung email')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {templateContent && (
          <iframe style={{width:"100%",height:"70vh",pointerEvents:"none"}} srcDoc={templateContent} >
            <p>Your browser does not support iframes.</p>
          </iframe>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalEmailMerchantContent;
