import React, { KeyboardEvent, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
import { Controller, set, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import * as yup from 'yup';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { updateTicket, sendEmail, getLog } from 'redux/actions';
import { useTranslation } from 'react-i18next';
import alert from 'utils/helpers/alert';
interface Props {
  check: boolean | any;
  onHideCheck?: () => void | any;
  id?: number | any;
}

const EkditorCustomerSupport: React.FC<Props> = ({ check, onHideCheck, id }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [templateContent, setTemplateContent] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [typeTemplate, setTypeTemplate] = useState<string>('EMAIL');

  const [errorEditorContent, setErrorEditorContent] = useState<boolean>(false);

  const schema = yup
    .object({
      // shortName: yup.string().required(),
      // title: yup.string().required(),
      content: typeTemplate === 'EMAIL' ? yup.string() : yup.string().required(),
    })
    .required();

  const formInforr = useForm<any>({
    // mode: 'onChange',
    resolver: yupResolver<any>(schema),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = formInforr;

  const handleCloseModal = () => {
    onHideCheck && onHideCheck();
    setTypeTemplate('EMAIL');
    setErrorEditorContent(false);
    reset();
  };

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {
    let result = {
      ...data,
      type: typeTemplate,
    };

    if (result.type === 'EMAIL' && !templateContent) {
      setErrorEditorContent(true);
      return;
    }

    if (result.type !== 'EMAIL' && !result?.content) return;

    if (result.type === 'EMAIL') {
      result = {
        ...result,
        content: templateContent?.replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
      };
    }
    setLoading(true);
    dispatch(
      sendEmail({ id: +id, emailContent: result.content }, (status, response) => {
        if (status) {
          alert('success', 'Gửi mail thành công', t);
          handleCloseModal();
          setLoading(false);
        } else {
          alert('error', 'Gửi mail thất bại', t);
          setLoading(false);
        }
      })
    );
  };

  return (
    check && (
      <div className='form-ckeditor-container'>
        <Form className='form-ckeditor' onSubmit={handleSubmit(onSubmit)} onKeyDown={checkKeyDown}>
          <div className='group-submit'>
            <div
              className='btn btn-huy'
              onClick={() => {
                onHideCheck && onHideCheck();
              }}>
              Hủy Gửi
            </div>
            <div onClick={handleSubmit(onSubmit)} className='btn btn-gui'>
              <i className='fab fa-telegram-plane'></i>
              {'Gửi'}
            </div>
          </div>
          <CKEditor<{ onChange: CKEditorEventHandler<'change'> }>
            initData={''}
            onChange={(evt) => {
              setTemplateContent(evt.editor.getData());
              // setTemplateContent(evt.editor.document.getBody().getText())
            }}
            config={{
              fullPage: true,
              allowedContent: true,
              height: '380px',
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
                  process.env.NEXT_PUBLIC_API_UPLOAD + '/' + JSON.parse(response[0])?.data[0]?.path;
              }
            }}
          />
        </Form>
        {isLoading && <LoadingFullScreen />}
      </div>
    )
  );
};

export default EkditorCustomerSupport;
