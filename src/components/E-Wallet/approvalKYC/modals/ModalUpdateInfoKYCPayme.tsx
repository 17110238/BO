import callApiUPLOAD from 'api/UploadFiles';
import LoadingInline from 'components/common/Loading/LoadingInline';
import { CallbackResponse, PayloadRequestEKYC, WalletKYC } from 'models';
import { reset } from 'numeral';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import {
  getEKYCList,
  requestApprovalAutoEKYC,
  requestEKYC,
  requestEKYCIC,
  updateEKYC,
} from 'redux/actions';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import ImageKYCPayme from '../commons/modalUpdateInfo/ImageKYCPayme';
import InfoBussinessKYCPayme from '../commons/modalUpdateInfo/InfoBussinessKYCPayme';
import InfoKYCPayme from '../commons/modalUpdateInfo/InfoKYCPayme';
import { accountType } from '../constants/optionsSelect';
import { formatDataSubmitAccount, formatDataSubmit } from '../utils/formatDataSubmit';
import ConfirmUpdate from './ConfirmUpdate';

export enum StateModalUpdate {
  UPDATE_KYC = 'UPDATE_KYC',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_AUTO_KYC = 'UPDATE_AUTO_KYC',
}
interface Props {
  show: boolean;
  kycId?: number;
  type: StateModalUpdate;
  onUpdateInfoClick?: (state: boolean) => void;
  onRequestUpdateClick?: (state: boolean) => void;
  onRejectKYCClick?: () => void;
  onRejectKYCICClick?: () => void;
  onHide: (type?: string) => void;
}

const ModalUpdateInfoKYCPayme: React.FC<Props> = ({
  show,
  kycId,
  type,
  onHide,
  onUpdateInfoClick,
  onRequestUpdateClick,
  onRejectKYCClick,
  onRejectKYCICClick,
}) => {
  const { t } = useTranslation('common');
  const viewer = useRef<any>();
  const dispatch = useDispatch();

  const [kyc, setKyc] = useState<WalletKYC>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowUpdateModal, setIsShowUpdateModal] = useState<boolean>(false);
  const [triggerUpdateViewer, setTriggerUpdateViewer] = useState<boolean>(false);
  const [typeSubmit, setTypeSubmit] = useState<string>('');

  const form = useForm<WalletKYC>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleClose = () => {
    setIsShowUpdateModal(false);
  };
  const submitFormWithType = (type: string) => {
    const handleSubmitUpdateData = (data: WalletKYC, cb?: CallbackResponse) => {
      const submitData = formatDataSubmit(data);
      delete submitData.isPushNotification;
      const isConfirmed = isShowUpdateModal;
      dispatch(
        updateEKYC({ ...submitData, isConfirmed }, (state, res) => {
          if (res.warningBlackList && isConfirmed === false) {
            setTypeSubmit(type);
            setIsShowUpdateModal(true);
          } else {
            cb?.(state, res);
            handleClose();
          }
        })
      );
    };

    switch (type) {
      case 'SUBMIT_UPDATE':
        form.handleSubmit((data, e) => {
          e?.preventDefault();
          handleSubmitUpdateData(data, (state, res) => {
            alert(state ? 'success' : 'error', t(res.message), t);
            onUpdateInfoClick && onUpdateInfoClick(state);
          });
        })();
        break;

      case 'SUBMIT_UPDATE_ACCOUNT':
        form.handleSubmit((data, e) => {
          e?.preventDefault();
          const submitData = formatDataSubmitAccount(data);
          onUpdateInfoClick && onUpdateInfoClick(true);
        })();
        break;

      case 'SUBMIT_REQUEST_APPROVAL_AUTO':
        form.handleSubmit((data, e) => {
          e?.preventDefault();
          const submitDataRequest: PayloadRequestEKYC = {
            id: data?.id!,
          };
          handleSubmitUpdateData(data, (state, res) => {
            state &&
              dispatch(
                requestApprovalAutoEKYC(submitDataRequest, (status, res) => {
                  alert(status ? 'success' : 'error', res?.message, t);
                  onRequestUpdateClick && onRequestUpdateClick(status);
                })
              );

            !state && alert('error', t(res.message), t);
          });
        })();
        break;

      case 'SUBMIT_REQUEST':
        form.handleSubmit((data, e) => {
          e?.preventDefault();

          const submitDataRequest: PayloadRequestEKYC = {
            id: data?.id!,
            pushNotification: data?.isPushNotification!,
          };
          handleSubmitUpdateData(data, (state, res) => {
            state &&
              dispatch(
                requestEKYC(submitDataRequest, (status, res) => {
                  alert(status ? 'success' : 'error', res?.message, t);
                  onRequestUpdateClick && onRequestUpdateClick(status);
                })
              );

            !state && alert('error', t(res.message), t);
          });
        })();
        break;

      case 'SUBMIT_REQUEST_APPROVAL_IC':
        form.handleSubmit((data, e) => {
          e?.preventDefault();

          handleSubmitUpdateData(data, (state, res) => {
            if (!state) {
              alert('error', t(res.message), t);
              return;
            }
            const payloadRequestEKYCIC: Pick<WalletKYC, 'id' | 'identifyNumber'> = {
              id: data.id,
              identifyNumber: data.identifyNumber,
            };
            dispatch(
              requestEKYCIC(payloadRequestEKYCIC, (status, res) => {
                alert(status ? 'success' : 'error', res?.message, t);
                onRequestUpdateClick && onRequestUpdateClick(status);
              })
            );
          });
        })();
        break;

      default:
        break;
    }
  };

  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    const key = e.target.getAttribute('data-title');
    if (!files?.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const { data: res } = await callApiUPLOAD(formData);
      if (res.code === 1000) {
        if (key === 'merchant.lincenseImage') {
          const currentImage: string[] = form.getValues(key as keyof WalletKYC) as string[];

          form.setValue(key as any, [
            ...(currentImage ? currentImage : []),
            ...res.data.map((info: { path: string }) => info.path),
          ]);
        } else {
          form.setValue(key as any, res.data[0].path);
        }

        setTriggerUpdateViewer(!triggerUpdateViewer);
      }
    } catch (error) {
      alert('error', 'Error Upload File', t);
    }
  };

  const handleRemoveImage: React.MouseEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    const key = target.getAttribute('data-title');

    if (key === 'merchant.lincenseImage') {
      const index = +(target.getAttribute('data-index') || -1);
      const currentImage: string[] = form.getValues(key as keyof WalletKYC) as string[];
      currentImage.splice(index, 1);

      form.setValue(key as any, [...currentImage]);
    } else {
      form.setValue(key as keyof WalletKYC, undefined);
    }

    setTriggerUpdateViewer(!triggerUpdateViewer);
  };

  const generateBtnUpdateKYC = () => {
    if (kyc?.state === 'BANNED') return [];

    const elementArr: any[] = [];

    !['APPROVED'].includes(kyc?.state || '') &&
      elementArr.push(
        <button
          key={1}
          className='btn btn-primary btn-approved-kyc'
          onClick={() => submitFormWithType('SUBMIT_REQUEST')}
          type='submit'>
          <i className='fas fa-user-check'></i>
          {t('Approval')}
        </button>
      );

    kyc?.identifyIC?.state === 'PENDING' &&
      kyc?.state === 'APPROVED' &&
      elementArr.push(
        <button
          key={3}
          className='btn btn-primary'
          onClick={() => submitFormWithType('SUBMIT_REQUEST_APPROVAL_IC')}
          type='submit'>
          <i className='fas fa-user-check'></i>
          {t('Approval')} IC
        </button>,
        <button key={4} className='btn btn-outline-warning' onClick={onRejectKYCICClick}>
          <i className='fas fa-user-times'></i>
          {t('Reject IC')}
        </button>
      );

    kyc?.state !== 'REJECTED' &&
      elementArr.push(
        <button
          key={2}
          className='btn btn-outline-danger btn-reject-kyc'
          onClick={onRejectKYCClick}>
          <i className='fas fa-user-times'></i>
          {t('Reject')}
        </button>
      );
    return elementArr;
  };

  const generateBtnUpdateKYCAuto = () => {
    if (kyc?.state === 'BANNED') return [];

    const elementArr: any[] = [];

    kyc.kycAutoState &&
      !['FAIL_FILLED', 'FILLING', 'MANUAL_APPROVED'].includes(kyc?.kycAutoState) &&
      elementArr.push(
        <button
          key={1}
          className='btn btn-primary'
          onClick={() => submitFormWithType('SUBMIT_REQUEST_APPROVAL_AUTO')}
          type='submit'>
          <i className='fas fa-check-double'></i>
          {t('Đã kiểm duyệt')}
        </button>
      );

    kyc?.state !== 'APPROVED' &&
      elementArr.push(
        <button
          key={1}
          className='btn btn-primary'
          onClick={() => submitFormWithType('SUBMIT_REQUEST')}
          type='submit'>
          <i className='fas fa-user-check'></i>
          {t('Approval')} KYC
        </button>
      );

    !['REJECTED'].includes(kyc?.state || '') &&
      elementArr.push(
        <button key={2} className='btn btn-outline-danger' onClick={onRejectKYCClick}>
          <i className='fas fa-user-times'></i>
          {t('Reject')} KYC
        </button>
      );

    kyc?.state === 'APPROVED' &&
      kyc?.identifyIC?.state === 'PENDING' &&
      elementArr.push(
        <button
          key={3}
          className='btn btn-primary'
          onClick={() => submitFormWithType('SUBMIT_REQUEST_APPROVAL_IC')}
          type='submit'>
          <i className='fas fa-user-check'></i>
          {t('Approval')} IC
        </button>,
        <button key={4} className='btn btn-outline-warning' onClick={onRejectKYCICClick}>
          <i className='fas fa-user-times'></i>
          {t('Reject IC')}
        </button>
      );

    return elementArr;
  };

  const renderBtnGroup = () => {
    switch (type) {
      case StateModalUpdate.UPDATE_AUTO_KYC:
        return (
          <div className='form-btns-group'>
            <div className='btn-control-kyc-auto btn-group'>
              {generateBtnUpdateKYCAuto().map((ele) => ele)}
            </div>
            <div>
              <button
                className='btn btn-clear btn-light'
                onClick={() => submitFormWithType('SUBMIT_UPDATE')}>
                <i className='fas fa-save'></i>
                {t('Lưu')}
              </button>
            </div>
          </div>
        );
      case StateModalUpdate.UPDATE_ACCOUNT:
        return (
          <div className='modal-footer pb-0'>
            <div className='w-25 mx-auto'>
              <button
                className='btn btn-primary w-100'
                onClick={() => submitFormWithType('SUBMIT_UPDATE_ACCOUNT')}>
                {t('Cập nhật')}
              </button>
            </div>
          </div>
        );
      case StateModalUpdate.UPDATE_KYC:
        return (
          <div className='form-btns-group'>
            <div className='btn-control-kyc btn-group'>
              {generateBtnUpdateKYC().map((ele) => ele)}
            </div>
            <div>
              <button
                className='btn btn-clear btn-light'
                onClick={() => submitFormWithType('SUBMIT_UPDATE')}>
                <i className='fas fa-save'></i>
                {t('Lưu')}
              </button>
            </div>
          </div>
        );
      default:
        <></>;
    }
  };

  const formatKYCData = (data?: WalletKYC) => {
    const clone: WalletKYC = { ...data };

    const hasImgIC =
      ['APPROVED', 'PENDING'].includes(clone.identifyIC?.state || '') && clone.state === 'APPROVED';
    const kycData: WalletKYC = {
      ...clone,
      image: {
        front: (hasImgIC ? clone.identifyIC?.front : clone.image?.front) || '',
        back: (hasImgIC ? clone.identifyIC?.back : clone.image?.back) || '',
        state: clone.image?.state,
      },
    };

    return kycData;
  };

  useEffect(() => {
    if (show) {
      setLoading(true);
      dispatch(
        getEKYCList({ filter: { id: kycId }, paging: { start: 0, limit: 5 } }, (state, res) => {
          if (state) {
            const kycData = { ...res?.data[0] };

            setKyc(kycData);
            form.reset(kycData);
            setLoading(false);

            setTimeout(() => {
              const previewBlock = document.querySelector('.merchant-imgs-preview') as HTMLElement;
              if (!previewBlock) return;
              viewer.current = new Viewer(previewBlock, {
                zIndex: 10000,
                title: false,
                button: false,
                inline: true,
                toolbar: {
                  zoomIn: 1,
                  zoomOut: 1,
                  oneToOne: 1,
                  reset: 1,
                  prev: 0,
                  play: 0,
                  next: 0,
                  rotateLeft: 1,
                  rotateRight: 1,
                  flipHorizontal: 1,
                  flipVertical: 1,
                },
              });
            }, 500);
          }
        })
      );
    }
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, [show]);

  useEffect(() => {
    setTimeout(() => {
      viewer.current && viewer.current.update();
    }, 500);
  }, [triggerUpdateViewer]);

  useEffect(() => {
    const currentType = form.watch('accountType');
    if (currentType) {
      const cloneObject = { ...kyc };
      delete cloneObject.accountType;
      form.reset(cloneObject);
      form.setValue('accountType', currentType);
      setTriggerUpdateViewer(!triggerUpdateViewer);
    }
  }, [form.watch('accountType')]);

  const accountTypeOptions = accountType.map((ele) => ({
    label: t(ele),
    value: ele,
  }));

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide && onHide();
        setTimeout(() => {
          form.reset();
        }, 500);
      }}
      centered
      backdropClassName='top-modal-backdrop'
      className='modal-basic-ui modal-update-kyc-wallet'
      backdrop='static'
      keyboard={false}>
      <ConfirmUpdate
        show={isShowUpdateModal}
        handleClose={handleClose}
        t={t}
        submitFormWithType={submitFormWithType}
        typeSubmit={typeSubmit}
      />
      <form onSubmit={(e) => e.preventDefault()}>
        <Modal.Header closeButton>
          <p>
            Bổ sung thông tin <span className='highlist--strong'>#ID: {kycId}</span>
          </p>
        </Modal.Header>
        {loading ? (
          <div className='position-relative' style={{ minHeight: 500, width: '100%' }}>
            <LoadingInline loading={true} />
          </div>
        ) : (
          <Modal.Body>
            {kyc?.state === 'APPROVED' && type === StateModalUpdate.UPDATE_ACCOUNT && (
              <div className='inputs-group p-0'>
                <div
                  className={`form-group ${
                    form?.formState?.errors?.accountType?.type ? 'input-custom-error' : ''
                  }`}>
                  <label>
                    {t('Loại tài khoản')}
                    <span className='text-danger'> (*)</span>
                  </label>
                  <Controller
                    control={form.control}
                    name='accountType'
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <ReactSelect
                          options={accountTypeOptions}
                          value={
                            accountTypeOptions.find((ele) => ele.value === field.value) || null
                          }
                          onChange={(newValue) => {
                            field.onChange(newValue?.value);
                          }}
                          placeholder={'--- Vui lòng chọn ---'}
                          className='select-input-form'
                          classNamePrefix='input-select'
                        />
                      );
                    }}
                  />
                </div>
              </div>
            )}
            <div className='form-info-kyc '>
              {form.watch('accountType') === 'BUSINESS' ? (
                <div className='form-input-tab'>
                  <Tabs>
                    <TabList>
                      <Tab>Thông tin tài khoản</Tab>
                      <Tab>Thông tin doanh nghiệp</Tab>
                    </TabList>
                    <TabPanel>
                      <InfoKYCPayme type={type} form={form} />
                    </TabPanel>
                    <TabPanel>
                      <InfoBussinessKYCPayme form={form} />
                    </TabPanel>
                  </Tabs>
                </div>
              ) : (
                <InfoKYCPayme type={type} form={form} className='pt-0' />
              )}
              <ImageKYCPayme
                textEmpty=''
                kyc={kyc}
                form={form}
                type={type}
                onUploadImage={handleUploadImage}
                onRemoveImage={handleRemoveImage}
              />
            </div>
            {kyc && renderBtnGroup()}
          </Modal.Body>
        )}
      </form>
    </Modal>
  );
};

export default ModalUpdateInfoKYCPayme;
