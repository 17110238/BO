import { LogKYCWallet, PayloadLogKYCWallet } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListLogKYCWallet } from 'redux/actions';
import DatatableHistoryKYC from '../commons/modalHistoryKYC/DatatableHistoryKYC';

interface Props {
  show?: boolean;
  onHide?: (type?: string) => void;
  kycId?: number;
}

const ModalHistoryKYCPayme: React.FC<Props> = ({ show, kycId, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [dataList, setDataList] = useState<LogKYCWallet[]>([]);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const handleGetList = (start?: number, limit?: number, sort?: {}) => {
    const payload: PayloadLogKYCWallet = {
      search: `${kycId}`,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function getList(filter: PayloadLogKYCWallet) {
      dispatch(
        getListLogKYCWallet(filter, (state, res) => {
          state && setDataList(res);
          setLoadingTable(false);
        })
      );
    }

    return {
      payload,
      getList,
      submitForm: loadingTable,
    };
  };

  useEffect(() => {
    if (show) {
      setLoadingTable(true);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide && onHide();
        setTimeout(() => {
          setDataList([]);
        }, 500);
      }}
      className='modal-basic-ui modal-history-kyc'
      backdrop='static'
      // keyboard={false}
      >
      <Modal.Header closeButton>
        <p>
          Lịch sử KYC <span className='highlist--strong'>#ID: {kycId}</span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <DatatableHistoryKYC
          getDataList={handleGetList}
          data={dataList}
          {...{ isLoading: loadingTable }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalHistoryKYCPayme;
