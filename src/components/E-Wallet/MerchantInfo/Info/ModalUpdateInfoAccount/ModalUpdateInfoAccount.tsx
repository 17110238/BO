import callApiUPLOAD from 'api/UploadFiles';
import { accountType } from 'components/E-Wallet/approvalKYC/constants/optionsSelect';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { requestApprovalAutoEKYC, requestEKYC, updateEKYC, getNationalList } from 'redux/actions';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import ImageAccountPayme from './ImageAccountPayme';
import InfoBussinessAccountPayme from './InfoBussinessAccountPayme';
import InfoAccountPayme from './InfoAccountPayme';
import { EwalletAccount } from 'models/merchantInfo/merchantInfoState';
import { LocationType } from 'models';
import { updateInfoAccountEWallet } from 'redux/actions/merchantInfoActions';
import { isBuffer } from 'lodash';

export enum StateModalUpdate {
  UPDATE_KYC = 'UPDATE_KYC',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_AUTO_KYC = 'UPDATE_AUTO_KYC',
}
interface Props {
  show: boolean;
  account?: EwalletAccount;
  onUpdateInfoClick?: (state: boolean) => void;
  onHide: (type?: string) => void;
  updateMerchantInfo?: () => void;
}

const ModalUpdateInfoAccount: React.FC<Props> = ({
  show,
  account,
  onHide,
  onUpdateInfoClick,
  updateMerchantInfo,
}) => {
  const { t } = useTranslation('common');
  const viewer = useRef<any>();
  const dispatch = useDispatch();

  const [triggerUpdateViewer, setTriggerUpdateViewer] = useState<boolean>(false);
  const [nationalData, setNationalData] = useState<any[]>([]);

  const form = useForm<EwalletAccount>({
    defaultValues: account,
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const formatDataSubmit = (data: EwalletAccount) => {
    const {
      province,
      wards,
      district,
      address,
      kyc: { kycMerchant, ...kycInfo },
      ...submitData
    } = data as any;

    ['kycId', 'reason', 'sentAt', 'state', 'type'].forEach((key) => {
      delete kycInfo[key];
    });
    if (!!data.location?.city.identifyCode || !!data.location?.district.identifyCode) {
      submitData.temporaryAddress["province"] = data?.location?.city.identifyCode;
      delete submitData.temporaryAddress.city;
      submitData.temporaryAddress.district = data?.location?.district.identifyCode;
      submitData.temporaryAddress.street = data.temporaryAddress?.street;
      submitData.temporaryAddress["wards"] = data?.location?.ward.identifyCode;
      delete submitData.temporaryAddress.ward;
    } else {
      delete submitData.temporaryAddress
    }
    delete submitData.location
    delete kycMerchant.logo;
    submitData.province = province?.identifyCode;
    submitData.district = district?.identifyCode;
    submitData.wards = wards?.identifyCode;
    submitData.address = address?.street;
    submitData.kyc = kycInfo;
    submitData.kycMerchant = kycMerchant;
    submitData.shareHolders = submitData.shareHolders.map((item: any) => ({
      ...item,
      capitalRatio: item.capitalRatio.split('%')[0],
    }));

    
    [
      'scope',
      'accountId',
      'appName',
      'createdIp',
      'clockLoginFail',
      'createdClientId',
      'createdDeviceInfo',
      'balance',
      'isVerifiedEmail',
      'updatedAvatarAt',
      'lastedLogoutAt',
      'lastedLoginAt',
      'createdAt',
      'updatedAt',
      'phone',
    ].forEach((key) => {
      delete submitData[key];
    });
    
    console.log(submitData.shareHolders)
    return submitData;
  };

  const submitFormWithType = (type: string) => {
    switch (type) {
      case 'SUBMIT_UPDATE_ACCOUNT':
        form.handleSubmit((data, e) => {
          e?.preventDefault();
          const formatData = formatDataSubmit(data);
          dispatch(
            updateInfoAccountEWallet(formatData, (state, res) => {
              updateMerchantInfo && updateMerchantInfo();
              onUpdateInfoClick && onUpdateInfoClick(state);
              alert(state ? 'success' : 'error', res?.message, t);
              state && onHide && onHide('RESET_DATA');
            })
          );
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
        if (key === 'kyc.kycMerchant.lincenseImage') {
          const currentImage: string[] = form.getValues(key as keyof EwalletAccount) as string[];

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
    if (key === 'kyc.kycMerchant.lincenseImage') {
      const index = +(target.getAttribute('data-index') || -1);
      const currentImage: string[] = form.getValues(key as keyof EwalletAccount) as string[];
      currentImage.splice(index, 1);
      form.setValue(key as any, [...currentImage]);
    } else {
      form.setValue(key as keyof EwalletAccount, '');
    }
    setTriggerUpdateViewer(!triggerUpdateViewer);
  };

  useEffect(() => {
    dispatch(
      getNationalList((state, respone) => {
        const dataNationalOption = respone.map((data: any) => ({
          value: data.value,
          label: data.value,
        }));
        setNationalData(dataNationalOption);
      })
    );

    const previewBlock = document.querySelector('.merchant-imgs-preview') as HTMLElement;

    if (show && previewBlock) {
      form.reset(account);
      setTimeout(() => {
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
      const cloneObject = { ...account };
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
      }}
      centered
      backdropClassName='top-modal-backdrop'
      className='modal-basic-ui modal-update-kyc-wallet'
      backdrop='static'
    // keyboard={false}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Modal.Header closeButton>
          <p>
            Bổ sung thông tin <span className='highlist--strong'>#ID: {account?.id}</span>
          </p>
        </Modal.Header>
        <Modal.Body>
          <div className='inputs-group p-0'>
            <div
              className={`form-group ${form?.formState?.errors?.accountType?.type ? 'input-custom-error' : ''
                }`}>
              <label>{t('Loại tài khoản')}</label>
              <Controller
                control={form.control}
                name='accountType'
                render={({ field }) => {
                  return (
                    <ReactSelect
                      options={accountTypeOptions}
                      value={accountTypeOptions.find((ele) => ele.value === field.value) || null}
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
          <div className='form-info-kyc '>
            {form.watch('accountType') === 'BUSINESS' ? (
              <div className='form-input-tab'>
                <Tabs>
                  <TabList>
                    <Tab>Thông tin tài khoản</Tab>
                    <Tab>Thông tin doanh nghiệp</Tab>
                  </TabList>
                  <TabPanel>
                    <InfoAccountPayme form={form} />
                  </TabPanel>
                  <TabPanel>
                    <InfoBussinessAccountPayme dataNational={nationalData} form={form} />
                  </TabPanel>
                </Tabs>
              </div>
            ) : (
              <InfoAccountPayme form={form} className='pt-0' />
            )}
            <ImageAccountPayme
              textEmpty=''
              account={account}
              form={form}
              onUploadImage={handleUploadImage}
              onRemoveImage={handleRemoveImage}
            />
          </div>
          <div className='modal-footer pb-0'>
            <div className='w-25 mx-auto'>
              <button
                className='btn btn-primary w-100'
                onClick={() => submitFormWithType('SUBMIT_UPDATE_ACCOUNT')}>
                {t('Cập nhật')}
              </button>
            </div>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default ModalUpdateInfoAccount;
