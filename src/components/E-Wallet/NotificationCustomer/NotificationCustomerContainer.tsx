import React, { useEffect, useState, useRef } from 'react';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import ReactSelect from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getListTemplate } from 'redux/actions';
import { EmailTemplateResponse, GetEmailTemplateInput } from 'models';
import TagsInput from 'react-tagsinput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateNotificationCustomer } from 'redux/actions/updateNotificationCustomer';
import alert from 'utils/helpers/alert';
import { useTranslation } from 'react-i18next';

const validationSchema = yup.object({
  title: yup.string().required('Tiêu đề không được rỗng'),
});

interface types {
  typeEmail?: boolean;
  typeNotification?: boolean;
}

const typeNotification = [
  { label: 'EMAIL', value: 'EMAIL' },
  { label: 'Thông báo InAPP + Push Notification', value: 'PUSH_NOTIFICATION' },
];

const typeCustomer = [
  { label: 'Theo danh sách', value: 'LIST_CUSTOMER' },
  // { label: 'Tất cả KH', value: 'ALL' },
];

const typeProject = [
  { label: 'INSIGHT', value: 'INSIGHT' },
  { label: 'AIZEN', value: 'AIZEN' },
];

const listTypeNotify = [
  {
    label: 'EVENT',
    value: 'EVENT',
  },
  {
    label: 'SYSTEM',
    value: 'SYSTEM',
  },
  {
    label: 'NEWS',
    value: 'NEWS',
  },
];

const typeEvent = [
  {
    label: 'HOME',
    value: 'HOME',
  },
];

export default function NotificationCustomerContainer(): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isType, setType] = useState<types>({
    typeEmail: true,
    typeNotification: false,
  });
  const [listTemplate, setListTemplate] = useState<Array<EmailTemplateResponse>>([]);
  const [dataContent, setDataContent] = useState<string | undefined>('');
  const [listCustomer, setListCustomer] = useState<any>([]);
  let [isShowEditor, setShowEditor] = useState<number>(0);
  const [file, setFile] = useState<any>();
  const [isShowTagsInput, setShowTagsInput] = useState<boolean>(true);
  const handleSubmitUpdate = (data: any): void => {
    let payload: any = {};
    if (isType.typeEmail) {
      payload = {
        project: data.project,
        type: data.type,
        customer: data.customer,
        title: data.title,
        content: dataContent,
        customerList: listCustomer,
      };
      let ckeditor = document.getElementById('cke_editor1');
      if (dataContent) {
        if (ckeditor) {
          ckeditor.style.border = '1px solid #d1d1d1';
        }
      } else {
        if (ckeditor) {
          ckeditor.style.border = '1px solid red';
          return;
        }
      }
      if (data.template) payload = { ...payload, content: dataContent };
    }
    if (isType.typeNotification) {
      payload = {
        type: data.type,
        title: data.title,
        customer: data.customer,
        project: data.project,
        content: '',
        customerList: listCustomer,
      };
      if (data?.content) {
        payload = {
          ...payload,
          content: data.content,
        };
      } else {
        setError('content', {
          type: 'required',
          message: 'Nội dung không được rỗng',
        });
        return;
      }
      if (data?.url) payload = { ...payload, url: data.url };
      if (data?.redirectSchema) payload = { ...payload, redirectSchema: data.redirectSchema };
      if (data?.titleSchema) payload = { ...payload, titleSchema: data.titleSchema };
      if (data?.notiType) payload = { ...payload, notiType: data.notiType };
    }
    if (file) {
      payload = { ...payload, file };
    }
    dispatch(
      updateNotificationCustomer(payload, (status, res) => {
        if (status) {
          alert('success', res.message, t);
        } else {
          alert('error', res.message, t);
        }
      })
    );
  };
  const handleChangeTags = (tags: any) => {
    setListCustomer(tags);
  };
  useEffect(() => {
    const payload: GetEmailTemplateInput = {
      filter: {},
      paging: {
        start: 0,
        limit: 999,
      },
    };
    dispatch(
      getListTemplate(payload, (status, res) => {
        if (status) {
          setListTemplate(res.data);
        }
      })
    );
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if (isShowEditor > 0) {
        setShowEditor(0);
      }
    }, 1);
  }, [isShowEditor]);
  useEffect(() => {
    if (dataContent) {
      if (Array.isArray(dataContent?.split(/\r\n|\r|\n/g))) {
        if (dataContent?.split(/\r\n|\r|\n/g).length < 8) {
          setDataContent('');
        }
      }
    }
  }, [dataContent]);
  useEffect(() => {
    const tagInput = document.getElementsByClassName(
      'react-tagsinput-input'
    ) as HTMLCollectionOf<HTMLInputElement>;
    if (tagInput) {
      tagInput[0].autocomplete = 'off';
    }
  }, []);
  return (
    <div className='notifyCustomer-container'>
      <form
        className='notifyCustomer-content'
        onSubmit={handleSubmit(handleSubmitUpdate, (errors) => {
          const data: any = getValues();
          if (!dataContent) {
            let ckeditor = document.getElementById('cke_editor1');
            if (ckeditor) {
              ckeditor.style.border = '1px solid red';
            }
          }
          if (!data?.content) {
            setError('content', {
              type: 'required',
              message: 'Nội dung không được rỗng',
            });
          }
        })}>
        <div className='notifyCustomer-group'>
          <label className='notifyCustomer-label'>Dự án</label>
          <Controller
            control={control}
            name={'project'}
            defaultValue={'INSIGHT'}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <ReactSelect
                  styles={customStyles}
                  className='notifyCustomer-select'
                  classNamePrefix='notifyCustomer-select'
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={typeProject}
                  value={typeProject.find((item: any) => item.value === value)}
                  onChange={(e) => onChange(e?.value)}
                />
              );
            }}
          />
        </div>
        <div className='notifyCustomer-group'>
          <label className='notifyCustomer-label'>Loại</label>
          <Controller
            control={control}
            name={'type'}
            defaultValue={'EMAIL'}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <ReactSelect
                  styles={customStyles}
                  className='notifyCustomer-select'
                  classNamePrefix='notifyCustomer-select'
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={typeNotification}
                  value={typeNotification.find((item: any) => item.value === value)}
                  onChange={(e) => {
                    onChange(e?.value);
                    setShowEditor(0);
                    if (e?.value === 'EMAIL') setType({ typeEmail: true, typeNotification: false });
                    if (e?.value === 'PUSH_NOTIFICATION') {
                      setType({ typeEmail: false, typeNotification: true });
                      setValue('title', '');
                      setValue('url', '');
                      setValue('titleSchema', '');
                      setValue('content', '');
                      setListCustomer([]);
                    }
                  }}
                />
              );
            }}
          />
        </div>
        {isType.typeNotification && (
          <div className='notifyCustomer-group'>
            <label className='notifyCustomer-label'>Thao tác đến sự kiện</label>
            <Controller
              control={control}
              name={'redirectSchema'}
              defaultValue={'HOME'}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                  <ReactSelect
                    styles={customStyles}
                    className='notifyCustomer-select'
                    classNamePrefix='notifyCustomer-select'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={typeEvent}
                    value={typeEvent.find((item: any) => item.value === value)}
                    onChange={(e) => onChange(e?.value)}
                  />
                );
              }}
            />
          </div>
        )}
        <div className='notifyCustomer-group'>
          <label className='notifyCustomer-label'>
            Tập Khách Hàng<span className='text-danger'>(*)</span>
          </label>
          <Controller
            control={control}
            name={'customer'}
            defaultValue={'LIST_CUSTOMER'}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <ReactSelect
                  styles={customStyles}
                  className='notifyCustomer-select'
                  classNamePrefix='notifyCustomer-select'
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#EFF2F7',
                      primary: '#00be00',
                    },
                  })}
                  options={typeCustomer}
                  value={typeCustomer.find((item: any) => item.value === value)}
                  onChange={(e) => {
                    onChange(e?.value);
                    if (e?.value === 'ALL') {
                      setShowTagsInput(false);
                      setListCustomer([]);
                    } else setShowTagsInput(true);
                  }}
                  isDisabled={isType.typeNotification ? false : true}
                />
              );
            }}
          />
          {isShowTagsInput && (
            <div className='notifyCustomer-tagInput'>
              <TagsInput
                value={listCustomer}
                onChange={handleChangeTags}
                validationRegex={
                  isType.typeEmail
                    ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    : /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/
                }
                inputProps={{
                  placeholder: t(
                    isType.typeEmail
                      ? 'Danh sách email cách nhau dấu ,'
                      : 'Danh sách phone cách nhau dấu ,'
                  ),
                  style: { minWidth: '250px' },
                }}
                addOnBlur={true}
              />
            </div>
          )}
        </div>
        <div className='notifyCustomer-group custom'>
          <label className='notifyCustomer-upload'>
            <i className='fas fa-cloud-upload-alt fa-2x' />
            <input
              type='file'
              accept='.xlsx, .xls, .csv'
              multiple
              className='notifyCustomer-input__upload'
              onChange={(e) => {
                const files: any = e.target?.files;
                for (const file of files) {
                  setFile(file);
                }
              }}
            />
            <p>Tải file</p>
          </label>
          {file && (
            <div className='notifyCustomer-previewFile'>
              <img src='/assets/icon/xlsx.png' alt='' />
              <a
                href=''
                className='notifyCustomer-removeImage'
                onClick={(e) => {
                  e.preventDefault();
                  setFile(undefined);
                }}>
                <i className='icon-remove fa-lg fas fa-times-circle' data-index='1'></i>
              </a>
            </div>
          )}
          <div className='notifyCustomer-downloadFile'>
            <a
              href={
                isType.typeNotification
                  ? '/assets/template/temp_phone.xlsx'
                  : '/assets/template/temp_email.xlsx'
              }
              download={true}>
              Download file mẫu
            </a>
          </div>
        </div>
        {isType.typeEmail && (
          <div className='notifyCustomer-group'>
            <label className='notifyCustomer-label'>Email mẫu</label>
            <Controller
              control={control}
              name={'template'}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                  <ReactSelect
                    styles={customStyles}
                    className='notifyCustomer-select'
                    classNamePrefix='notifyCustomer-select'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={listTemplate.map((item: EmailTemplateResponse) => {
                      return {
                        label: item.title,
                        value: item.id,
                      };
                    })}
                    placeholder={t('Chọn template mẫu')}
                    onChange={(e) => {
                      onChange(e?.value);
                      const obj = listTemplate.find(
                        (item: EmailTemplateResponse) => item.id === e?.value
                      );
                      if (obj && Object.keys(obj).length > 0) {
                        const num = isShowEditor + 1;
                        setDataContent(obj.content);
                        setShowEditor(num);
                      }
                    }}
                  />
                );
              }}
            />
          </div>
        )}
        {isType.typeNotification && (
          <div className='notifyCustomer-group'>
            <label className='notifyCustomer-label'>Loại thông báo</label>
            <Controller
              control={control}
              name={'notiType'}
              defaultValue={'EVENT'}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                  <ReactSelect
                    styles={customStyles}
                    className='notifyCustomer-select'
                    classNamePrefix='notifyCustomer-select'
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    options={listTypeNotify}
                    value={listTypeNotify.find((item: any) => item.value === value)}
                    onChange={(e) => onChange(e?.value)}
                  />
                );
              }}
            />
          </div>
        )}
        {isType.typeNotification && (
          <div
            className={`notifyCustomer-group ${
              errors.content?.message ? 'notifyCustomer-group-error' : ''
            }`}>
            <label className='notifyCustomer-label'>
              Nội dung <span className='text-danger'>(*)</span>
            </label>
            <textarea cols={5} rows={2} className='notifyCustomer-input' {...register('content')} />
            {errors.content?.message && (
              <span className='notifyCustomer-error'>{errors.content?.message}</span>
            )}
          </div>
        )}
        <div
          className={`notifyCustomer-group ${
            errors.title?.message ? 'notifyCustomer-group-error' : ''
          }`}>
          <label className='notifyCustomer-label'>
            Tiêu đề <span className='text-danger'>(*)</span>
          </label>
          <input
            type='text'
            {...register('title')}
            className='notifyCustomer-input'
            placeholder='Nhập tiêu đề'
          />
          {errors.title?.message && (
            <span className='notifyCustomer-error'>{errors.title?.message}</span>
          )}
        </div>
        {isType.typeNotification && (
          <div className='notifyCustomer-group'>
            <label className='notifyCustomer-label'>Link nội dung sự kiện</label>
            <input
              type='text'
              className='notifyCustomer-input'
              placeholder='Nhập nội dung sự kiện'
              {...register('url')}
            />
          </div>
        )}
        {isType.typeNotification && (
          <div className='notifyCustomer-group'>
            <label className='notifyCustomer-label'>Tiêu đề thao tác</label>
            <input
              type='text'
              className='notifyCustomer-input'
              placeholder='Nhập tiêu đề thao tác'
              {...register('titleSchema')}
            />
          </div>
        )}
        {isType.typeEmail && isShowEditor === 0 && (
          <div className='notifyCustomer-group ckeditor'>
            <label className='notifyCustomer-label mb-2'>Nội dung</label>
            <CKEditor<{ onChange: CKEditorEventHandler<'change'> }>
              initData={dataContent}
              onChange={(e) => {
                let ckeditor = document.getElementById('cke_editor1');
                if (ckeditor) {
                  ckeditor.style.border = '1px solid #d1d1d1';
                }
                setDataContent(e.editor.getData());
              }}
              config={{
                fullPage: true,
                allowedContent: true,
                height: '300px',
                width: '100%',
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
          </div>
        )}
        {isType.typeEmail && isShowEditor > 0 && (
          <div className='notifyCustomer-group ckeditor'>
            <label className='notifyCustomer-label mb-2'>Nội dung</label>
            <CKEditor
              initData={dataContent}
              onChange={(e) => {
                setDataContent(e.editor.getData());
              }}
              config={{
                fullPage: true,
                allowedContent: true,
                height: '300px',
                width: '100%',
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
          </div>
        )}
        <div className='notifyCustomer-submit'>
          <button>{t('Tạo Message')}</button>
        </div>
      </form>
    </div>
  );
}
