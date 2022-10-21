import { BankListType, BankUpdateType, GetBankListPayload } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getBankListAction, updateBankAction } from 'redux/actions';
import alert from 'utils/helpers/alert';
import DataTableBankList from '../commons/DataTableBankList';
import ModalUpdateBank from '../modals/ModalUpdateBank';
interface Props {
  show: boolean;
  onHide: (type?: string) => void;
}

const ModalConfigBankList: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [bankList, setBankList] = useState<BankListType[]>([]);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [showModalBankUpdate, setShowModalBankUpdate] = useState<boolean>(false);
  const [bankData, setBankData] = useState<BankListType>({
    id: 0,
    bankCodeId: 0,
    isActive: false,
    link: {
      gateway: '',
    },
    requiredDate: '',
    shortName: '',
    swiftCode: '',
  });

  const handleChangeBankStatus = (bankCodeId: number, isActive: boolean) => {
    dispatch(
      updateBankAction(
        {
          bankCodeList: {
            bankCodeId,
            isActive,
          },
        },
        (stt, res) => {
          if (stt) {
            setSubmitForm(true);
          } else {
            alert('error', res.message, t);
          }
        }
      )
    );
  };

  const handleUpdateBankRow = (data: BankUpdateType) => {
    dispatch(
      updateBankAction(data, (stt, res) => {
        if (stt) {
          setSubmitForm(true);
          setShowModalBankUpdate(false);
        } else {
          alert('error', res.message, t);
        }
      })
    );
  };

  const handleFetchBankList = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetBankListPayload = {
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetData(payload: GetBankListPayload) {
      dispatch(
        getBankListAction(payload, (stt, res) => {
          if (stt) setBankList(res.data);
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

  const handleShowModalUpdateBankRow = (bank: BankListType) => {
    setShowModalBankUpdate(true);
    setBankData(bank);
  };

  useEffect(() => setSubmitForm(true), []);

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
        <Modal.Header closeButton>
          <h4>{t('Cấu hình danh sách ngân hàng')}</h4>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <DataTableBankList
            data={bankList || []}
            onChangeBankStatus={handleChangeBankStatus}
            getDataList={handleFetchBankList}
            onShowModalUpdateBankRow={handleShowModalUpdateBankRow}
            {...{ refreshTable: submitForm, isLoading: submitForm }}
          />
        </Modal.Body>
        <ModalUpdateBank
          show={showModalBankUpdate}
          onHide={() => setShowModalBankUpdate(false)}
          bankData={bankData}
          onUpdateBankRow={handleUpdateBankRow}
        />
      </Modal>
    </>
  );
};

export default ModalConfigBankList;
