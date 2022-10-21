import callApiUPLOAD from 'api/UploadFiles';
import { LocationType } from 'models';
import { RegisterImgCustomerSupportDetailInput } from 'models/customerSuport/customerSuport';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addReplyTicket } from 'redux/actions';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';

interface Props {
  id?: number | any;
  show?: boolean | undefined;
  onResetId?: () => void;
  onCheckUpdate?: (data: boolean) => void;
  onSubmitForm?:()=>void;
 
}
interface SelectProp extends LocationType {
  value?: string;
  label?: string;
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
  }),

  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};
const FormAddRelyDashBoardTicket: React.FC<Props> = ({
  id,
  onResetId,
  onCheckUpdate,
  onSubmitForm
}) => {
  const { t } = useTranslation('common');
  const [dataImg, setDataImg] = useState<string[]>([]);
  const viewer = useRef<any>();
  const [identifyImages, setIdentifyImages] = useState<string[]>([]);
  const [img, setImg] = useState<string>('');

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      zIndex: 10000,
      title: false,
      button: false,
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
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, []);

  useEffect(() => {
    if (dataImg.length > 0) {
      setIdentifyImages(dataImg);
    }
  }, [dataImg]);

  //update show image by viewerjs
  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [img]);

  const handlePreviewImg = (e: MouseEvent<HTMLDivElement>, row?: any) => {
    viewer.current && viewer.current.show();
    const target = e.target as HTMLDivElement;
    setImg(row);
  };

  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    const name = e.target.name;

    if (!files?.length) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const { data: res } = await callApiUPLOAD(formData);
      const updateImage: RegisterImgCustomerSupportDetailInput = {};
      if (res.code === 1000) {
        switch (name) {
          case 'images':
            updateImage.attachImages = [
              ...(identifyImages || []),
              ...res.data.map((info: { path: string }) => {
                return process.env.NEXT_PUBLIC_API_UPLOAD + info.path;
              }),
            ];
            setIdentifyImages(updateImage.attachImages);
            setValue('images', updateImage.attachImages);
            clearErrors('images');
            break;
          default:
            updateImage.attachImages = [
              ...(identifyImages || []),
              ...res.data.map((info: { path: string }) => {
                return process.env.NEXT_PUBLIC_API_UPLOAD + info.path;
              }),
            ];
            setIdentifyImages(updateImage.attachImages);
            setValue('images', updateImage.attachImages);
            clearErrors('images');
            break;
        }
      }
    } catch (err) {
      alert('error', 'Error Upload File', t);
    }
  };
  const handleRemoveImage: React.MouseEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    const name = target.getAttribute('data-name');
    const index = +(target.getAttribute('data-index') || -1);
    e.stopPropagation();
    switch (name) {
      case 'attachImages': {
        identifyImages.splice(index, 1);
        setIdentifyImages([...identifyImages]);
        setValue('images', [...identifyImages]);
        break;
      }

      default:
        break;
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  // useSelector
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    reset,
    getValues,
    setError,
    resetField,
    unregister,
    formState: { errors },
    control,
  } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {},
  });

  // handle event onSubmit
  const handleSubmitForm: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    const { content, images } = data;
    if (!images.length) delete data.images;
    const payload = { ticketId: id, ...data };
    dispatch(
      addReplyTicket(payload, (status, res) => {
        if (status) {
          alert('success', t('Thêm phản hồi thành công'), t);
          reset();
          setIdentifyImages([]);
          onResetId && onResetId();
          onSubmitForm && onSubmitForm();
          onCheckUpdate && onCheckUpdate(true);
        } else {
          alert('error', t('Thêm phản hồi thất bại'), t);
          onResetId && onResetId();
        }
      })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)} autoComplete='off'>
        <div className='head-title'>{'Thêm phản hồi'}</div>
        <div className='d-flex content-body flex-column inputs-group'>
          <div className='inputs-group-image'>
            <span>{t('File đính kèm')}</span>
            <div
              className='form-group form-add-reply-dashboard'
              style={{ backgroundColor: 'white' }}>
              <label>{t('Hình ảnh')}</label>
              <div className='d-flex'>
                <div className='d-flex align-items-center'>
                  <label className={`btn-upload ${errors ? 'btn-upload-error' : ''}`}>
                    <i className='fas fa-cloud-upload-alt fa-2x'></i>
                    <input
                      {...register('images')}
                      accept='image/*'
                      type='file'
                      name='images'
                      hidden
                      onChange={handleUploadImage}
                      multiple
                    />
                    {t('Tải ảnh')}
                  </label>
                </div>
                <div className='image-groups'>
                  {identifyImages?.map((img, index) => {
                    return !img.endsWith('pdf') ? (
                      <div
                        className='row-img-preview'
                        data-index={index}
                        key={index}
                        onClick={(e) =>
                          handlePreviewImg(
                            e,
                            img.startsWith('http') ? img : process.env.NEXT_PUBLIC_API_UPLOAD + img
                          )
                        }>
                        <img
                          src={
                            img.startsWith('http') ? img : process.env.NEXT_PUBLIC_API_UPLOAD + img
                          }
                          alt='img-kyc'
                          onError={handleErrorImage}
                        />

                        <i
                          className='icon-remove fa-lg fas fa-times-circle'
                          data-index={index}
                          data-name='attachImages'
                          onClick={handleRemoveImage}></i>
                      </div>
                    ) : (
                      <div className='row-img-preview' key={index}>
                        <a href={img} target='_blank'>
                          <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' />
                        </a>

                        <i
                          className='icon-remove fa-lg fas fa-times-circle'
                          data-index={index}
                          data-name={'attachImages'}
                          onClick={handleRemoveImage}></i>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={`form-group form-input-textarea`} style={{ width: '100%' }}>
              <label>
                {/* {t('Expired time')} */}
                <label className='mr-0'>{t('Nội dung')}</label>
              </label>
              <textarea
                className='input-textarea'
                placeholder={t('Ghi nội dung')}
                style={{ width: '100%', maxHeight: '150px', minHeight: '80px' }}
                {...register('content')}
              />
            </div>
            <button className='btn btn-primary' type='submit'>
              {'Gửi phản hồi'}
            </button>
          </div>
        </div>
      </form>
      <div className='preview-identity-img d-none ' style={{ zIndex: '10000' }}>
        <img src={img} alt='peview' />
      </div>
    </>
  );
};

export default FormAddRelyDashBoardTicket;
