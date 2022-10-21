import { GetIssuerPayload, IssuerAddType, IssuerListType, IssuerUpdateType } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  createWalletIssuerAction,
  getWalletIssuersAction,
  updateWalletIssuerAction,
} from 'redux/actions';
import alert from 'utils/helpers/alert';
import DataTableIssuerList from '../commons/DataTableIssuerList';
import ModalAddIssuer from './ModalAddIssuer';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
}

const ModalConfigProviderList: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [showAddIssuer, setShowAddIssuer] = useState<boolean>(false);
  const [issuers, setIssuers] = useState<IssuerListType[]>([]);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [issuerInfo, setIssuerInfo] = useState<IssuerUpdateType>();

  const handleHideModalAddIssuer = () => {
    setShowAddIssuer(false);
  };

  const handleShowModalAddIssuer = () => {
    setShowAddIssuer(true);
    setIssuerInfo(undefined);
  };

  const handleShowUpdateIssuer = (data: IssuerListType) => {
    setShowAddIssuer(true);
    const svList = data.service as string;
    delete data.service;

    const payload: IssuerUpdateType = {
      ...data,
      service: svList.split(','),
    };

    setIssuerInfo(payload);
  };

  const handleFetchIssuerList = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetIssuerPayload = {
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetData(payload: GetIssuerPayload) {
      dispatch(
        getWalletIssuersAction(payload, (stt, res) => {
          if (stt) setIssuers(res.data);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetData,
      submitForm,
    };
  };

  const handleAddIssuer = (data: IssuerAddType) => {
    dispatch(
      createWalletIssuerAction(data, (stt, res) => {
        alert(stt ? 'success' : 'error', res?.message, t);
        if (stt) {
          setSubmitForm(true);
          setShowAddIssuer(false);
        }
      })
    );
  };
  const handleUpdateIssuer = (data: IssuerUpdateType) => {
    dispatch(
      updateWalletIssuerAction(data, (stt, res) => {
        alert(stt ? 'success' : 'error', res?.message, t);
        if (stt) {
          setSubmitForm(true);
          setShowAddIssuer(false);
        }
      })
    );
  };

  useEffect(() => setSubmitForm(true), []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      className='modal-system-config'
      contentClassName='overflow-hidden'
      backdrop='static'
      >
      <Modal.Header style={{ position: 'relative' }} className='p-3'>
        <h4>{t('Cấu hình danh sách nhà phát hành')}</h4>
        <div className='d-flex'>
          <button className='btn btn-primary mr-5' onClick={handleShowModalAddIssuer}>
            Thêm nhà phát hành
          </button>
          <svg
            onClick={() => onHide()}
            style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='feather feather-x'>
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        </div>
      </Modal.Header>
      <Modal.Body className='p-0'>
        <DataTableIssuerList
          data={issuers || []}
          getDataList={handleFetchIssuerList}
          onShowUpdateIssuer={handleShowUpdateIssuer}
          {...{ refreshTable: submitForm }}
        />
        {showAddIssuer && (
          <ModalAddIssuer
            issuerInfo={issuerInfo}
            show={showAddIssuer}
            onHide={handleHideModalAddIssuer}
            onAddIssuer={handleAddIssuer}
            onUpdateIssuer={handleUpdateIssuer}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalConfigProviderList;
