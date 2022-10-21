import { yupResolver } from '@hookform/resolvers/yup';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import Loading from 'components/common/Loading/LoadingFullScreen';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { useTranslation } from 'react-i18next';
import {
  addPaymeTransfer,
  createCommandPaymeTransfer,
  getListPaymeTransferLog,
} from 'redux/actions';
import alert from 'utils/helpers/alert';
import * as yup from 'yup';
import Dropzone from 'components/common/Dropzone';
import DatatableTransfer from './DatatableTransfer';
import formatCurrency from 'utils/helpers/formatCurrency';
import { Input } from 'ui/Form';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import numeral from 'numeral';
import _ from 'lodash';
import { AccetedFile, EwalletPaymeTransferLogInput } from 'models';

interface ModalAddProps {
  show: boolean;
  handleClose: () => void;
  handleRefreshTransferListHistory: () => void;
}

const transferTypeOptions = [{ label: 'Chuyển ví', value: 'wallet' }];

const ModalTransfer = ({ show, handleClose, handleRefreshTransferListHistory }: ModalAddProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [logData, setLogData] = useState<object[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isImportFile, setIsImportFile] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [isFileValid, setIsFileValid] = useState(true);
  const [phoneList, setPhoneList] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState<string>('');
  const regexPhone = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
  const [initialValue, setInitialValue] = useState<{}>({
    transferType: 'wallet',
  });
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [campaignId, setCampaignId] = useState<string>('');
  const [detailLog, setDetailLog] = useState<{
    totalAccountValid: number;
    totalAmount: number;
  }>({
    totalAccountValid: 0,
    totalAmount: 0,
  });

  const schema = yup
    .object({
      transferType: yup.string(),
      description: yup.string().required('Nội dung không được để trống'),
      accountSender: yup
        .string()
        .matches(regexPhone, { message: 'SĐT không đúng định dạng', excludeEmptyString: false })
        .required('SĐT không được để trống'),
      amount: yup
        .number()
        .min(1000, 'Số tiền tối thiểu là 1,000 đ')
        .max(999999999)
        .required('Số tiền không được để trống'),
    })
    .required();

  const {
    register,
    control,
    getValues,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
    setValue,
  } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver<any>(schema),
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  const handleCloseModal = () => {
    handleClose();
    setFile(null);
    setIsImportFile(false);
    setIsFileValid(true);
    setPhoneList([]);
    reset();
    setCurrentPage(1);
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const renderErrorField = (name: string) => {
    const elm = errors?.[name] && (
      <span className='form-group__error-text'>{errors?.[name]?.message}</span>
    );

    return elm;
  };

  const handleGetTransferList = (start?: number, limit?: number) => {
    const payload: EwalletPaymeTransferLogInput = {
      filter: {
        campaignId,
      },
      paging: { limit: limit!, start: start! },
    };

    function handleGetTransferList(payload: EwalletPaymeTransferLogInput) {
      setLoading(true);
      dispatch(
        getListPaymeTransferLog(payload, (status, response) => {
          setSubmitForm(false)
          if (status) {
            setLogData(response.data);
            setDetailLog({
              totalAccountValid: response.totalAccountValid,
              totalAmount: response.totalAmount,
            });
          } else {
            alert('error', response.message ? response.message : t('Server connection error'), t);
          }
          setLoading(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetTransferList,
      submitForm,
    };
  };

  const uploadExcelFile = (data: any) => {
    if (_.isEmpty(file)) {
      setIsFileValid(false);
    }

    const { transferType, accountSender, amount, description } = data || {};

    if (phoneList.length && !file) {
      setIsFileValid(true);
    }

    if ((phoneList.length || file) && currentPage === 1) {
      setLoading(true);
      dispatch(
        addPaymeTransfer(
          {
            transferType,
            file,
            accountSender,
            accountReceive: phoneList,
            amount: +amount,
            description,
          },
          (status, data) => {
            if (status) {
              setCampaignId(data.campaignId);
              if (data.campaignId) {
                setCurrentPage(2);
                handleGetTransferList().getList({
                  filter: {
                    campaignId: data.campaignId
                  }
                });
              }
              setLoading(false);
            } else {
              alert('error', data.message, t);
              setLoading(false);
            }
          }
        )
      );
    }
  };

  const handleTransfer = (data: any) => {
    const { transferType, accountSender, amount, description } = getValues() || {};

    const payload = {
      transferType,
      file,
      accountSender,
      accountReceive: phoneList,
      amount: +amount,
      description,
    };

    setLoading(true);
    dispatch(
      createCommandPaymeTransfer(payload, (status, data) => {
        if (status) {
          alert('success', data.message, t);
          setLoading(false);
          handleCloseModal();
          handleRefreshTransferListHistory();
        } else {
          alert('error', data.message, t);
          setLoading(false);
        }
      })
    );
  };

  const returnStep = () => {
    setIsImportFile(false);
    setLogData([]);
    setCurrentPage(1);
  };

  const allowOnlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleTypeNumber = (tag: string) => {
    const regex = /^[0-9\b]+$/;
    if (tag === '' || regex.test(tag)) {
      setInputTag(tag);
    }
  };

  const handleChangeTags = (tags: any) => {
    setPhoneList(tags);
  };

  useEffect(() => {
    reset();
    setValue('description', getValues('description'));
  }, [initialValue]);

  return (
    <Modal
      className={`modal-multitransfer modal-transfer ${currentPage === 2 ? 'transfer-table' : ''}`}
      show={show}
      backdrop='static'
      enforceFocus={false}>
      <div className='modal-multitransfer__title'>
        <p>{t('Giao dịch chuyển / nhận ví')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt='close icon'
        />
      </div>
      <Modal.Body>
        <form
          onSubmit={handleSubmit(uploadExcelFile)}
          onKeyDown={(e) => checkKeyDown(e)}
          className='multitransfer-form-container'>
          {currentPage === 2 ? (
            <>
              <div className='transfer-info'>
                <p className='mr-4'>
                  Số tài khoản hợp lệ: <span>{detailLog.totalAccountValid}</span>
                </p>
                <p>
                  Tổng tiền: <span>{formatCurrency(detailLog.totalAmount)} đ</span>
                </p>
              </div>
              <DatatableTransfer
                isLoading={isLoading}
                data={logData}
                getDataList={handleGetTransferList}
              />
            </>
          ) : (
            <div className='content-wrapper'>
              <div className='multitransfer-form__col-left inputs-group mr-0'>
                <div className={`form-group`}>
                  <label>
                    {t('Loại GD')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Controller
                    control={control}
                    name={'transferType'}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <ReactSelect
                        defaultValue={{ label: 'Chuyển ví', value: 'wallet' }}
                        className='select-input-form'
                        classNamePrefix='input-select'
                        options={transferTypeOptions}
                        value={transferTypeOptions.find((item: any) => item.value === value)}
                        onChange={(e: SingleValue<any>) => {
                          onChange(e.value);
                        }}
                      />
                    )}
                  />
                </div>
                <div className={`form-group ${errors.accountSender ? 'form-group__error' : ''}`}>
                  <label>
                    {t('Từ ví')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Controller
                    control={control}
                    name='accountSender'
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Form.Control
                        placeholder='Nhập SĐT tài khoản'
                        type='text'
                        className='mb-1'
                        maxLength={10}
                        onChange={(e) => {
                          onChange(allowOnlyNumber(e.target.value));
                          clearErrors('accountSender');
                        }}
                        value={value ? value : ''}
                      />
                    )}
                  />
                  {renderErrorField('accountSender')}
                </div>
                <div className={`form-group`}>
                  <label>
                    {t('Đến ví')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Controller
                    control={control}
                    name='accountReceive'
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TagsInput
                        value={phoneList}
                        inputValue={inputTag}
                        validationRegex={/([84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/}
                        onChangeInput={(value) => handleTypeNumber(value)}
                        onChange={handleChangeTags}
                        addKeys={[188, 13]}
                        inputProps={{
                          placeholder: t('Nhập SĐT cách nhau dấu ,'),
                          style: { minWidth: '250px' },
                        }}
                        addOnBlur={true}
                      />
                    )}
                  />
                </div>
                <div>
                  <Dropzone
                    acceptFile={AccetedFile.excel}
                    setFile={setFile}
                    file={file}
                    isFileValid={isFileValid}
                    setIsFileValid={setIsFileValid}
                  />
                  <div className='w-100 d-flex align-items-center justify-content-end'>
                    {file && (
                      <a className='text-danger my-2 mr-2 pr-2' onClick={() => setFile(null)}>
                        <i className='fas fa-trash-alt mr-1 fa-sm'></i>
                        Xoá file
                      </a>
                    )}
                    <a
                      className='text-right my-2 pr-2'
                      href='https://sbx-static.payme.vn/2022/05/06/FnOIKGxNh.xlsx'>
                      <i className='fas fa-file-download mr-1 fa-sm'></i>
                      {t('Tải file mẫu')}
                    </a>
                  </div>
                </div>
                <div className={`form-group ${errors.amount ? 'form-group__error' : ''}`}>
                  <label>
                    {t('Số tiền')} (đ)
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Controller
                    control={control}
                    name='amount'
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Form.Control
                        className='mb-1'
                        maxLength={11}
                        onChange={(e) => {
                          onChange(+allowOnlyNumber(e.target.value));
                          clearErrors('amount');
                        }}
                        value={value ? numeral(value).format('0,0') : ''}
                      />
                    )}
                  />
                  {renderErrorField('amount')}
                </div>
                <div className={`form-group ${errors.description ? 'form-group__error' : ''}`}>
                  <label>
                    {t('Nội dung')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    {...register('description')}
                    onChange={(e) => {
                      clearErrors('description');
                    }}
                  />
                  {renderErrorField('description')}
                </div>
              </div>
            </div>
          )}
          <div className='btn-group mt-3'>
            <button
              type='button'
              onClick={currentPage === 1 ? handleCloseModal : returnStep}
              className='btn btn-filter-active mr-2'>
              {currentPage === 1 ? t('Cancel') : t('Quay lại')}
            </button>
            {currentPage === 1 ? (
              <button type='submit' className='btn btn-primary'>
                Tiếp tục
              </button>
            ) : (
              <div className='btn btn-primary' onClick={handleTransfer}>
                Lập lệnh
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalTransfer;
