import { yupResolver } from '@hookform/resolvers/yup';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { EmailTemplateResponse } from 'models';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { updateTemplateWallet } from 'redux/actions';
import alert from "utils/helpers/alert";
import * as yup from 'yup';
import { templateTypes } from 'components/Template/BoxSearchTemplate'

interface Props {
  t: (a: string) => string;
  show: boolean;
  info: EmailTemplateResponse;
  handleClose: () => void;
  setSubmitForm: (a: boolean) => void;
}

const UpdateTemplate: React.FC<Props> = ({
  t,
  show,
  handleClose,
  info,
  setSubmitForm,
}) => {

  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [typeTemplate, setTypeTemplate] = useState<string | any>('');
  const [templateContent, setTemplateContent] = useState<ReactNode | any>('');
  const [errorEditorContent, setErrorEditorContent] = useState<boolean>(false);
  const [radioEditor, setRadioEditor] = useState<any>({
    editor: false,
    ckEditor: true,
  })


  const schema = yup.object({
    shortName: yup.string().required(),
    title: yup.string().required(),
    content: typeTemplate === 'EMAIL' && radioEditor.ckEditor ? yup.string() : yup.string().required(),
  }).required()

  const { register, control, handleSubmit, reset, formState: { errors }, getValues, setValue } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: useMemo(() => {
      return info;
    }, [info]),
    resolver: yupResolver<any>(schema),
  });

  useEffect(() => {
    setTypeTemplate(info?.type);
    setTemplateContent(info?.content);
    reset(info);
  }, [info]);

  const handleCloseModal = () => {
    handleClose();
    setErrorEditorContent(false);
    setValue('editorContent', '');
    setRadioEditor({
      editor: false,
      ckEditor: true
    })
    reset();
  }

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {

    const defaultTemplateContent = `<html>\n<head>\n\t<title></title>\n</head>\n<body></body>\n</html>\n`
    if (templateContent === defaultTemplateContent) {
      data.content = data?.content?.replace(defaultTemplateContent, '')
    }

    let result = {
      ...data,
      type: typeTemplate,
    }

    if (result.type === 'EMAIL' && !templateContent) {
      setErrorEditorContent(true);
      return;
    }

    if (result.type !== 'EMAIL' && !result?.content) return;

    if (result.type === 'EMAIL') {
      result = {
        ...result,
        content: templateContent?.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
      }
    }

    setLoading(true);
    dispatch(
      updateTemplateWallet(result, (status, response) => {
        if (status) {
          alert('success', response.message, t);
          setSubmitForm && setSubmitForm(true);
          handleCloseModal();
          setLoading(false);
        } else {
          alert('error', response.message, t);
          setLoading(false);
        }
      })
    )
  };

  useEffect(() => {
    if (templateContent) {
      setErrorEditorContent(false);
      setValue('content', templateContent)
    }
  }, [templateContent])


  useEffect(() => {
    setErrorEditorContent(false);
    setValue('content', info?.content)
  }, [radioEditor])

  return (
    <Modal
      className='modal-template'
      show={show}
      backdrop="static"
      enforceFocus={false}
    >
      <div className='modal-template__title'>
        <p>{t('Cập nhật template')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt='close icon'
        />
      </div>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className="template-form-container"
        >
          <div className="content-wrapper">
            <div className="template-form__col-left inputs-group">
              <div className={`form-group`}>
                <label>
                  {t('Loại template')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Controller
                  control={control}
                  name={'type'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <ReactSelect
                      defaultValue={templateTypes[0]}
                      className='select-input-form'
                      classNamePrefix='input-select'
                      options={templateTypes}
                      value={templateTypes.find((item: any) => item.value === value)}
                      onChange={(e: SingleValue<any>) => {
                        onChange(e.value);
                        setTypeTemplate(e.value);
                        setErrorEditorContent(false);
                        if (info?.type === 'EMAIL') {
                          setValue('content', '');
                        } else {
                          setTemplateContent('');
                        }
                      }}
                    />
                  )}
                />
              </div>
              <div className={`form-group ${errors.shortName ? 'form-group__error' : ''}`}>
                <label>
                  {t('Tên rút gọn')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Form.Control
                  type="text"
                  {...register('shortName')}
                />
                {
                  errors?.shortName &&
                  <span className='form-group__error-text'>
                    {t('Tên rút gọn không được để trống')}
                  </span>
                }
              </div>
              <div className={`form-group ${errors.title ? 'form-group__error' : ''}`}>
                <label>
                  {t('Tiêu đề')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Form.Control
                  style={{ maxHeight: '300px' }}
                  type="text"
                  as="textarea"
                  {...register('title')}
                />
                {
                  errors?.title &&
                  <span className='form-group__error-text'>
                    {t('Tiêu đề không được để trống')}
                  </span>
                }
              </div>
              <div className={'form-group'}>
                <label>
                  {t('Diễn giải')}
                </label>
                <Form.Control
                  style={{ maxHeight: '100px' }}
                  type="text"
                  as="textarea"
                  {...register('description')}
                />
              </div>
            </div>
            <div className="template-form__col-right">
              {
                typeTemplate === 'EMAIL'
                  ?
                  <div className={`ckeditor-wrapper ${errorEditorContent ? 'error' : ''}`}>
                    <div className="radio-wrapper">
                      <Form.Check
                        defaultChecked
                        key="1"
                        id="editor-1"
                        type="radio"
                        inline
                        aria-label="ck-editor"
                        name="editor"
                        label="Nâng cao"
                        onChange={(e) => setRadioEditor({
                          editor: false,
                          ckEditor: true
                        })}
                      />
                      <Form.Check
                        key="2"
                        id="editor-2"
                        type="radio"
                        inline
                        aria-label="editor"
                        name="editor"
                        label="Thường"
                        onChange={(e) => setRadioEditor({
                          editor: true,
                          ckEditor: false
                        })}
                      />
                    </div>
                    {
                      radioEditor.ckEditor ?
                        <CKEditor<{ onChange: CKEditorEventHandler<'change'> }>
                          initData={info?.type === 'EMAIL' ? info?.content : ''}
                          onChange={(evt) => setTemplateContent(evt.editor.getData())}
                          config={{
                            height: '580px',
                            filebrowserUploadUrl: `${process.env.NEXT_PUBLIC_API_UPLOAD}/Upload`,
                            allowedContent: true,
                            entities: false,
                            fullPage: true,
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
                                process.env.NEXT_PUBLIC_API_UPLOAD + '/' + JSON.parse(response[0])?.data[0]?.path;
                            }
                          }}
                        />
                        : <div className="inputs-group">
                          <Form.Group className={`form-MC-state ${errors?.content ? 'form-group__error' : ''}`}>
                            <Form.Label>{t('Nội dung')}</Form.Label>
                            <Controller
                              control={control}
                              name={'content'}
                              defaultValue={getValues('content') || info?.content}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Form.Control
                                  type="text"
                                  as="textarea"
                                  {...register('content')}
                                />
                              )}
                            />
                            {
                              errors?.content &&
                              <span className='form-group__error-text'>
                                {t('Nội dung không được để trống')}
                              </span>
                            }
                          </Form.Group>
                        </div>
                    }
                  </div>
                  :
                  <div className="inputs-group">
                    <div className={`form-group ${errors.content ? 'form-group__error' : ''}`}>
                      <label>
                        {t('Nội dung')}
                      </label>
                      <Form.Control
                        style={{ maxHeight: '100px' }}
                        type="text"
                        as="textarea"
                        {...register('content')}
                      />
                      {
                        errors?.content &&
                        <span className='form-group__error-text'>
                          {t('Nội dung không được để trống')}
                        </span>
                      }
                    </div>
                  </div>
              }
              {
                errorEditorContent &&
                <label className='text-error'>(*) {t('Nội dung không được để trống')}</label>
              }
            </div>
          </div>

          <div className="btn-group mt-3">
            <Button type="submit" className='btn-add btn' variant='primary'>
              <i className="fas fa-check"></i>
              {t('Cập nhật')}
            </Button>
            {/* <Button className='btn-test btn' variant='primary'>
              {t('Gửi thử')}
            </Button> */}
          </div>
        </Form>

      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  )
}

export default UpdateTemplate