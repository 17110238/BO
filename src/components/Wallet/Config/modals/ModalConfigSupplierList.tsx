import {
  GetSupplierPayload,
  IssuerListType,
  SupplierAddType,
  SupplierListType,
  SupplierUpdateType,
} from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DataTableSupplierList from '../commons/DataTableSupplierList';
import {
  getWalletIssuersAction,
  getWalletSuppliersAction,
  createSupplierAction,
  updateSupplierAction,
} from 'redux/actions';
import { useDispatch } from 'react-redux';
import ModalAddSupplier from './ModalAddSupplier';
import alert from 'utils/helpers/alert';

interface Props {
  show: boolean;
  onHide: (type?: string) => void;
}

const ModalConfigSupplierList: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [suppliers, setSuppliers] = useState<SupplierListType[]>([]);
  const [issuers, setIssuers] = useState<IssuerListType[]>([]);
  const [supplierInfo, setSupplierInfo] = useState<SupplierUpdateType>();

  const [refresh, setRefreshTable] = useState<boolean>(false);
  const [showAddSupplier, setShowAddSupplier] = useState<boolean>(false);

  const handleFetchSupplierList = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetSupplierPayload = {
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetData(payload: GetSupplierPayload) {
      dispatch(
        getWalletSuppliersAction(payload, (stt, res) => {
          if (stt) setSuppliers(res.data);
          setRefreshTable(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetData,
      submitForm: refresh,
    };
  };

  const handleShowModalAddSupplier = () => {
    setShowAddSupplier(true);
    setSupplierInfo(undefined);
  };

  const handleHideModalAddSupplier = () => {
    setShowAddSupplier(false);
  };

  const handleShowUpdateSupplier = (data: SupplierListType) => {
    setShowAddSupplier(true);
    const svList = data.service as string;
    const svNPH = data.NPH as string;
    delete data.service;
    delete data.issuer;
    delete data.NPH;
    delete data.createdAt;
    delete data.updatedAt;

    const payload: SupplierUpdateType = {
      ...data,
      service: svList?.split(',') || [],
      issuer: svNPH?.split(',') || [],
    };

    setSupplierInfo(payload);
  };

  const handleAddSupplier = (data: SupplierAddType) => {
    const issuerString = data.issuer as string[];
    const newPayload = {
      ...data,
      issuer: issuerString.map((item) => issuers.find((obj) => obj.shortName === item)?.id),
    };

    dispatch(
      createSupplierAction(newPayload, (stt, res) => {
        if (stt) {
          setRefreshTable(true);
          setShowAddSupplier(false);
        }
        alert(stt ? 'success' : 'error', res.message, t);
      })
    );
  };

  const handleUpdateSupplier = (data: SupplierUpdateType) => {
    const issuerString = data.issuer as string[];

    const newPayload = {
      ...data,
      issuer: issuerString.map((item) => issuers.find((obj) => obj.shortName === item)?.id),
    };

    dispatch(
      updateSupplierAction(newPayload, (stt, res) => {
        if (stt) {
          setRefreshTable(true);
          setShowAddSupplier(false);
        }
        alert(stt ? 'success' : 'error', res.message, t);
      })
    );
  };

  useEffect(() => {
    showAddSupplier &&
      dispatch(
        getWalletIssuersAction(
          {
            paging: {
              start: 0,
              limit: 1000,
            },
            sort: {
              createdAt: 1,
            },
          },
          (stt, res) => {
            setIssuers(res.data);
            if (!stt) alert('error', res.message, t);
          }
        )
      );
  }, [dispatch, showAddSupplier]);

  useEffect(() => setRefreshTable(true), []);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        className='modal-system-config'
        backdrop='static'
        contentClassName='overflow-hidden'
        //keyboard={false}
        >
        <Modal.Header style={{ position: 'relative' }} className='p-3'>
          <h4>{t('Cấu hình danh sách nhà cung cấp')}</h4>
          <div className='d-flex'>
            <button className='btn btn-primary mr-5' onClick={handleShowModalAddSupplier}>
              Thêm nhà cung cấp
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
          <DataTableSupplierList
            data={suppliers || []}
            getDataList={handleFetchSupplierList}
            onShowUpdateSupplier={handleShowUpdateSupplier}
            {...{ refreshTable: refresh, isLoading: refresh }}
          />
          {showAddSupplier && (
            <ModalAddSupplier
              supplierInfo={supplierInfo}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              show={showAddSupplier}
              onHide={handleHideModalAddSupplier}
              issuers={issuers}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalConfigSupplierList;
