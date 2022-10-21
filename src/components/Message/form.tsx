import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import Dropzone from '../common/Dropzone';
import { EmailTemplateType, requestMessageType } from 'models/message';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { requestMessage, sendTestMailAction } from 'redux/actions/messageActions';

import { Input } from 'ui/Form';
import alert from 'utils/helpers/alert';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import MessageCustomeModal from './customeModal';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { AccetedFile } from 'models';

interface Props {
  emailTemplates: EmailTemplateType[];
}

const initSelectedTarget = {
  value: 'Merchant',
  label: 'Merchant',
};

const initSelectedCustomer = {
  value: 'LIST_CUSTOMER',
  label: 'Theo danh sách',
};

const MessageForm: FC<Props> = ({ emailTemplates }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    reset,
    getValues,
  } = useForm();

  const checkPermisson =
    useSelector<any, []>((state) => state.authReducers?.accountInfo.scope) || [];
  let sendAnnounceScope = checkPermisson.find((item) => item === 'bo.operator.messageMc');

  const targetOptions = [
    { value: 'Partner', label: 'Partner' },
    { value: 'Merchant', label: 'Merchant' },
  ];

  const formTitle = getValues('title');

  const customerSets = [
    { value: 'LIST_CUSTOMER', label: t('Theo danh sách') },
    { value: 'ALL', label: t('Tất cả khách hàng') },
  ];

  const [selectedTarget, setSelectedTarget] = useState<any>(initSelectedTarget);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(initSelectedCustomer);
  const [emailList, setEmailList] = useState<any>([]);
  const [emailListTrial, setTrialEmailList] = useState<any>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(emailTemplates[0]);
  const [mailTemplates, setMailTemplates] = useState<EmailTemplateType[]>([]);
  const [showCustomeModal, setShowCustomeModal] = useState<boolean>(false);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [isShowEditor, setIsShowEditor] = useState<boolean>(false);
  const [emailFile, setEmailFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (emailTemplates.length > 0) {
      setMailTemplates(emailTemplates);
    }
  }, [emailTemplates]);

  useEffect(() => {
    setTimeout(() => {
      if (!isShowEditor) {
        setIsShowEditor(true);
      }
    }, 500);
  }, [isShowEditor]);

  useEffect(() => {
    setTemplateContent(selectedTemplate.value);
  }, [selectedTemplate]);

  const handleChangeMailTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsShowEditor(false);
  };

  const resetForm = () => {
    reset();
    setSelectedTarget(initSelectedTarget);
    setSelectedCustomer(initSelectedCustomer);
    setSelectedTemplate(emailTemplates[0]);
    setEmailList([]);
    setIsShowEditor(false);
    setEmailFile(null);
  };

  const onSubmit = (data: any) => {
    const payload: requestMessageType = {
      title: data.title,
      target: selectedTarget.value,
      templateTitle: selectedTemplate.label,
      custom: selectedCustomer.value,
      description: `${templateContent}`,
      customeList:
        emailList.length > 0
          ? emailList.map((email: any) => {
              return { email: email };
            })
          : [],
      file: emailFile,
    };
    setIsLoading(true);
    dispatch(
      requestMessage(payload, (status, data) => {
        setIsLoading(false);
        if (status) {
          resetForm();
          alert('success', data ? data : 'Thành công', t);
        } else {
          alert('error', data ? data : 'Thất bại', t);
        }
      })
    );
  };

  const hideTrialSendMailModal = () => {
    setShowCustomeModal(false);
    setTrialEmailList([]);
  };

  const sendTestMail = () => {
    const payload = {
      email: emailListTrial,
      title: formTitle,
      templateTitle: selectedTemplate.label,
      description: `${templateContent}`,
    };
    setIsLoading(true);
    dispatch(
      sendTestMailAction(payload, (state, data) => {
        setIsLoading(false);
        hideTrialSendMailModal();
        if (state) {
          alert('success', data.message ? data.message : 'Thành công', t);
        } else {
          alert('error', data.message ? data.message : 'Thất bại', t);
        }
      })
    );
  };

  useEffect(() => {
    if (selectedCustomer.value === 'ALL') {
      setEmailList([]);
    }
  }, [selectedCustomer]);

  const handleChangeTags = (tags: any) => {
    setEmailList(tags);
  };
  const handleChangeTrialTags = (tags: any) => {
    setTrialEmailList(tags);
  };

  return (
    <>
      {isLoading && <LoadingFullScreen />}
      <form className='message-form'>
        <MessageCustomeModal
          show={showCustomeModal}
          onHide={hideTrialSendMailModal}
          handleChangeTags={handleChangeTrialTags}
          emailList={emailListTrial}
          handleSendTestMail={sendTestMail}
        />
        <div className='inputs-wrapper'>
          <div className='side-inputs'>
            <div className='form-input'>
              <label>{t('Đối tượng')}</label>
              <Select
                defaultValue={selectedTarget}
                isDisabled={true}
                options={targetOptions}
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                onChange={setSelectedTarget}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
              />
            </div>
            <div className='form-input'>
              <label>{t('Tập khách hàng')}</label>
              <Select
                value={selectedCustomer}
                options={customerSets}
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                onChange={setSelectedCustomer}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
              />
            </div>
            {selectedCustomer.value === 'LIST_CUSTOMER' && (
              <div className='form-input list-customer-wrap'>
                <label>{t('Nhập email khách hàng')}</label>
                <div className='form-group'>
                  <TagsInput
                    value={emailList}
                    validationRegex={
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    }
                    onChange={handleChangeTags}
                    className='form-control base-input'
                    addKeys={[188, 13]}
                    inputProps={{
                      placeholder: t('Nhập email khách hàng cách nhau dấu ,'),
                      style: { minWidth: '250px' },
                    }}
                    addOnBlur={true}
                  />
                </div>
                <p className='my-2'>Hoặc</p>
                <div>
                  <Dropzone
                    acceptFile={AccetedFile.excel}
                    file={emailFile}
                    setFile={setEmailFile}
                  />
                  <div style={{ textAlign: 'right', paddingRight: '16px', marginTop: '8px' }}>
                    <a href='https://static.payme.vn/web/bo/TemplateEmail.xlsx'>Tải file mẫu</a>
                  </div>
                </div>
              </div>
            )}
            <div className='form-input'>
              <Input
                type='text'
                name='title'
                label={t('Tiêu đề')}
                register={register}
                clearErrors={clearErrors}
                errors={errors.title}
                rules={{ required: true }}
                placeholder={t('Nhập tiêu đề')}
              />
            </div>
          </div>
          <div className='content-input'>
            <div className='form-input'>
              <label>{t('Email mẫu')}</label>
              <Select
                value={selectedTemplate}
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                options={mailTemplates}
                onChange={handleChangeMailTemplate}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
              />
            </div>
            <label>{t('Nội dung')}</label>

            {isShowEditor && (
              <CKEditor<{ onChange: CKEditorEventHandler<'change'> }>
                initData={selectedTemplate.value}
                onChange={(evt) => setTemplateContent(evt.editor.getData())}
                config={{
                  allowedContent: true,
                  height: '500px',
                  fullPage: true,
                  readOnly: sendAnnounceScope ? false : true,
                  filebrowserUploadUrl: `${process.env.NEXT_PUBLIC_API_UPLOAD}/Upload`,
                }}
                onFileUploadRequest={(evt: any) => {
                  const file = evt.data.fileLoader.file;
                  const xhr = evt.data.fileLoader.xhr;
                  const formData = new FormData();

                  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
                  if (!validImageTypes.includes(file.type)) {
                    evt.cancel();
                  }

                  formData.append('files', file);

                  xhr.open('POST', `${process.env.NEXT_PUBLIC_API_UPLOAD}/Upload`, true);
                  xhr.send(formData);

                  evt.stop();
                }}
                onFileUploadResponse={(evt: any) => {
                  evt.stop();

                  const data = evt.data,
                    xhr = data.fileLoader.xhr,
                    response = xhr.responseText.split('|');
                  if (response[1]) {
                    // An error occurred during upload.
                    data.message = response[1];
                    evt.cancel();
                  } else {
                    data.url =
                      process.env.NEXT_PUBLIC_API_UPLOAD +
                      '/' +
                      JSON.parse(response[0])?.data[0]?.path;
                  }
                }}
              />
            )}
          </div>
        </div>
        {sendAnnounceScope && (
          <div className='d-flex align-items-center justify-content-center mt-3'>
            <button
              style={{ height: 'fit-content', fontSize: 'medium', lineHeight: '40px' }}
              type='submit'
              onClick={handleSubmit(onSubmit)}
              className='btn btn-success'>
              {t('Gửi yêu cầu')}
            </button>

            <button
              style={{ height: 'fit-content', fontSize: 'medium', lineHeight: '40px' }}
              type='button'
              onClick={() => setShowCustomeModal(true)}
              className='filter-btn btn btn-active py-0 ml-3'>
              {t('Gửi thử')}
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default MessageForm;
