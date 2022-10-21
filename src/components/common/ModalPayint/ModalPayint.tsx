import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import DatatablePayint from './DatatablePayint';
import { addPayint, approvePayint, reviewPayint } from 'redux/actions';
import alert from 'utils/helpers/alert';
import LoadingFullScreen from '../Loading/LoadingFullScreen';
import Dropzone from '../Dropzone';
import { AccetedFile } from 'models';

interface Props {
  showModal: boolean;
  closeModal: () => void;
  refreshTransactionList: () => void;
}

const ModalPayint: FC<Props> = ({ showModal, closeModal, refreshTransactionList }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isImportFile, setIsImportFile] = useState<boolean>(false);
  const [datatableData, setDatatableData] = useState<object[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payinCampaign, setPayinCampaign] = useState<string>('');
  const [totalPayin, setTotalPayin] = useState<number>(0);
  const [file, setFile] = useState<any>(null);
  const [isFileValid, setIsFileValid] = useState(true);

  const {
    register,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleGetPayinLogs = (start?: number, limit?: number, sort?: {}) => {
    const payload: any = {
      filter: {
        campaign: payinCampaign,
      },
      paging: { limit: limit!, start: start! },
    };
    function handleGetListPayinLogs(payload: any) {
      setIsLoading(true);
      dispatch(
        reviewPayint(payload, (status, data) => {
          if (status) {
            setIsLoading(false);
            setDatatableData(data.data);
            setTotalPayin(data.totalRow);
            setIsImportFile(true);
          } else {
            alert('error', data.message ? data.message : t('Server connection error'), t);
            setIsLoading(false);
          }
        })
      );
    }
    return {
      payload,
      getList: handleGetListPayinLogs,
    };
  };

  const uploadExcelFile = (data: any) => {
    const payload: any = {
      filter: {
        campaign: '',
      },
      paging: { limit: 20, start: 0 },
    };
    if (file) {
      setIsLoading(true);
      dispatch(
        addPayint({ file, merchantId: parseInt(data.mcId) }, (status, data) => {
          if (status) {
            setIsLoading(false);
            setPayinCampaign(data.campaign);
            payload.filter = { campaign: data.campaign };
            handleGetPayinLogs().getList(payload);
          } else {
            alert('error', data.message ? data.message : t('Server connection error'), t);
            setIsLoading(false);
          }
        })
      );
    } else {
      setIsFileValid(false);
    }
  };

  const handleApprovePayint = () => {
    setIsLoading(true);
    dispatch(
      approvePayint({ campaign: payinCampaign }, (status, data) => {
        if (status) {
          setTimeout(() => {
            alert('success', data.message, t);
            closeModal();
            refreshTransactionList();
          }, 1000);
        } else {
          alert('error', data.message ? data.message : t('Server connection error'), t);
          setIsLoading(false);
        }
      })
    );
  };

  const returnStep = () => {
    setIsImportFile(false);
    setFile(null);
    reset();
  };

  return (
    <>
      {isLoading && <LoadingFullScreen />}
      <Modal centered backdrop='static' show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <h5>{t('Thêm giao dịch')}</h5>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(isImportFile ? handleApprovePayint : uploadExcelFile)}>
            {isImportFile ? (
              <DatatablePayint
                getDataList={handleGetPayinLogs}
                totalPayin={totalPayin}
                data={datatableData}
              />
            ) : (
              <>
                <Input
                  type='number'
                  name='mcId'
                  label='Merchant ID'
                  register={register}
                  clearErrors={clearErrors}
                  errors={errors.mcId}
                  rules={{ required: true }}
                  placeholder={t('Nhập Merchant ID')}
                />
                <div>
                  <Dropzone
                    acceptFile={AccetedFile.excel}
                    setFile={setFile}
                    file={file}
                    isFileValid={isFileValid}
                    setIsFileValid={setIsFileValid}
                  />

                  <div className='w-100 d-flex justify-content-end'>
                    <a
                      className='text-right my-2 pr-2'
                      href='https://static.payme.vn/web/bo/PayIn.xlsx'>
                      {t('Tải file mẫu')}
                    </a>
                  </div>
                </div>
              </>
            )}
            <div className='d-flex align-items-center justify-content-center mt-3'>
              <button
                type='button'
                onClick={isImportFile ? returnStep : closeModal}
                className='btn btn-filter-active mr-2'>
                {isImportFile ? t('Quay lại') : t('Cancel')}
              </button>
              <button type='submit' className='btn btn-primary'>
                {isImportFile ? t('Khởi tạo') : t('Tiếp tục')}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalPayint;
