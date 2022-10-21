// import customStyles from 'utils/helpers/customStylesForReactSelect';
import { LocationType } from 'models';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getListCustomerSupport } from 'redux/actions';
import alert from 'utils/helpers/alert';
import { CKEditor, CKEditorEventHandler } from 'ckeditor4-react';
interface Props {
  id?: number | any;
  show: boolean | undefined;
  onHide: (type?: string) => void;
  onResetId?: () => void;
  onCheckUpdate?: () => void;
}

export const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: `1px solid #eff2f7`,
    color: state.isSelected ? '#0b0b0b' : '#0b0b0b',
    fontSize: '14px',
    fontFamily: 'Nunito Sans',
    height: 'auto',
    minHeight: '42px',
    display: 'inline-block',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    boxShadow: '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 9999,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: 'none',
    background: 'none',
    borderRadius: '12px',
    color: '#00be00',
    height: '40px',
    minWidth: '107px',
    boxShadow: 'none',
  }),

  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
const ModalEmailMerchantContent: React.FC<Props> = ({
  id,
  show,
  onHide,
}) => {
  const { t } = useTranslation('common');

  const [templateContent, setTemplateContent] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListCustomerSupport(
        {
          filter: { id: +id },
        },
        (status, res) => {
          if (status) {
            const { assignTarget } = res[0];
          } else {
            alert('error', t(res.message), t);
          }
        }
      )
    );
  }, []);
  const handleHide = () => {
    onHide && onHide();

  };
  return (
    <Modal show={show} onHide={handleHide} backdrop='static' className='modal-email-merchant-container'>
      <Modal.Header closeButton>
        <Modal.Title>{t('Tempalate Email')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <CKEditor<{ onChange: CKEditorEventHandler<'change'> }>
                      initData={templateContent ?  templateContent : ''}
                      onChange={(evt) => setTemplateContent(evt.editor.getData())}
                      config={{
                        height: '580px',
                        filebrowserUploadUrl: `${process.env.NEXT_PUBLIC_API_UPLOAD}/Upload`,
                        allowedContent: true,
                        entities: false,
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


      </Modal.Body>
    </Modal>
  );
};

export default ModalEmailMerchantContent;
