import { yupResolver } from '@hookform/resolvers/yup';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { useTranslation } from 'react-i18next';
import { createTemplate } from 'redux/actions';
import alert from 'utils/helpers/alert';
import * as yup from 'yup';
import Dropzone from 'components/common/Dropzone';
import DatatableTransfer from './DatatableTransfer';
import formatCurrency from 'utils/helpers/formatCurrency';
import { AccetedFile } from 'models';

const fakeData = [
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
  { orderId: 'Nguyen Van A' },
];
interface ModalAddProps {
  show: boolean;
  handleClose: () => void;
  handleRefreshTransferListHistory: () => void;
}

const templateTypes = [
  {
    label: 'Email',
    value: 'EMAIL',
  },
  {
    label: 'SMS',
    value: 'SMS',
  },
  {
    label: 'Thông báo',
    value: 'NOTIFICATION',
  },
];

const ModalTransfer = ({ show, handleClose, handleRefreshTransferListHistory }: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [data, setData] = useState<object[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isImportFile, setIsImportFile] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [isFileValid, setIsFileValid] = useState(true);

  const schema = yup
    .object({
      company: yup.string().required(),
      content: yup.string().required(),
    })
    .required();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver<any>(schema),
  });

  const handleCloseModal = () => {
    handleClose();
    setFile(null);
    setIsImportFile(false);
    setIsFileValid(true);
    reset();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const handleGetTransferList = (start?: number, limit?: number, sort?: {}) => {
    const payload: any = {
      filter: {},
      paging: { limit: limit!, start: start! },
    };
    function handleGetTransferList(payload: any) {
      // setLoading(true);
      // dispatch(
      //   reviewPayint(payload, (status, data) => {
      //     if (status) {
      //       setLoading(false);
      //       setDatatableData(data.data);
      //       setTotalPayin(data.totalRow);
      //       setIsImportFile(true);
      //     } else {
      //       alert('error', data.message ? data.message : t('Server connection error'), t);
      //       setLoading(false);
      //     }
      //   })
      // );
    }
    return {
      payload,
      getList: handleGetTransferList,
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
      setIsImportFile(true);
      // setLoading(true);
      // dispatch(
      //   addPayint({ file, merchantId: parseInt(data.mcId) }, (status, data) => {
      //     if (status) {
      //       setIsLoading(false);
      //       setPayinCampaign(data.campaign);
      //       payload.filter = { campaign: data.campaign };
      //       handleGetPayinLogs().getList(payload);
      //     } else {
      //       alert('error', data.message ? data.message : t('Server connection error'), t);
      //       setIsLoading(false);
      //     }
      //   })
      // );
    } else {
      setIsFileValid(false);
    }
  };

  const handleTransfer = () => {

    // setLoading(true);
    // dispatch(
    //   approvePayint({ campaign: payinCampaign }, (status, data) => {
    //     if (status) {
    //       setTimeout(() => {
    //         alert('success', data.message, t);
    //         closeModal();
    //         refreshTransactionList();
    //       }, 1000);
    //     } else {
    //       alert('error', data.message ? data.message : t('Server connection error'), t);
    //       setIsLoading(false);
    //     }
    //   })
    // );
  };

  const returnStep = () => {
    setIsImportFile(false);
    // setFile(null);
    // reset();
  };

  return (
    <Modal
      className={`modal-multitransfer ${isImportFile ? 'transfer-table' : ''}`}
      show={show}
      backdrop='static'
      enforceFocus={false}>
      <div className='modal-multitransfer__title'>
        <p>{t('Chuyển ví theo danh sách')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt='close icon'
        />
      </div>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(isImportFile ? handleTransfer : uploadExcelFile)}
          onKeyDown={(e) => checkKeyDown(e)}
          className='multitransfer-form-container'>
          {isImportFile ? (
            <>
              <div className='transfer-info'>
                <p className='mr-4'>
                  Số tài khoản hợp lệ: <span>15</span>
                </p>
                <p>
                  Tổng tiền: <span>{formatCurrency(1000000000)} đ</span>
                </p>
              </div>
              <DatatableTransfer
                getDataList={handleGetTransferList}
                totalPayin={11}
                data={fakeData}
              />
            </>
          ) : (
            <div className='content-wrapper'>
              <div className='multitransfer-form__col-left inputs-group'>
                <div className={`form-group`}>
                  <label>
                    {t('Công ty')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Controller
                    control={control}
                    name={'company'}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <ReactSelect
                        defaultValue={{ label: 'PayME', value: 'payme' }}
                        className='select-input-form'
                        classNamePrefix='input-select'
                        options={templateTypes}
                        value={templateTypes.find((item: any) => item.value === value)}
                        onChange={(e: SingleValue<any>) => {
                          onChange(e.value);
                        }}
                      />
                    )}
                  />
                </div>
                <div className={`form-group ${errors.content ? 'form-group__error' : ''}`}>
                  <label>
                    {t('Nội dung')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Form.Control type='text' as='textarea' rows={4} {...register('content')} />
                  {errors?.content && (
                    <span className='form-group__error-text'>
                      {t('Nội dung không được để trống')}
                    </span>
                  )}
                </div>
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
              </div>
              <div className='multitransfer-form__col-right'>
                <div className='step-guide-wrapper'>
                  <p>
                    <p>Bước 1: </p>
                    HR upload bản lương, Bấm "Lập lệnh" để xác nhận đồng ý lập lệnh, PayME sẽ mail
                    đến CEO email duyệt lệnh.
                  </p>
                  <p>
                    <p>Bước 2: </p>
                    CEO duyệt bản lương của HR, PayME sẽ mail đến kế toán thông tin số tiền cần nạp
                    vào PayME.
                  </p>
                  <p>
                    <p>Bước 3: </p>
                    Kế Toán nạp tiền, PayME sẽ ghi nhận số dư ví nhân viên.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className='btn-group mt-3'>
            <button
              type='button'
              onClick={isImportFile ? returnStep : handleCloseModal}
              className='btn btn-filter-active mr-2'>
              {isImportFile ? t('Quay lại') : t('Cancel')}
            </button>
            <button type='submit' className='btn btn-primary'>
              {isImportFile ? t('Lập lệnh') : t('Tiếp tục')}
            </button>
          </div>
        </form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalTransfer;
