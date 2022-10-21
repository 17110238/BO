// import customStyles from 'utils/helpers/customStylesForReactSelect';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setStateDashBoardTicket } from 'redux/actions';
import alert from 'utils/helpers/alert';
import Viewer from 'viewerjs';
import FormAddRelyDashBoardTicket from './FormAddRelyDashBoardTicket';
import FormInforTicket from './FormInforTicket';
import ListReplyTicketContainer from './ListReplyDashBoardTicketContainer';
interface Props {
  id?: number | any;
  show: boolean | undefined;
  onHide: (type?: string) => void;
  onResetId?: () => void;
  onCheckUpdate?: () => void;
  handleCheckUpdate?: () => void;
  router?: any;
  onSetModal?: any;
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
const ModalDashBoardRelyTicket: React.FC<Props> = ({
  id,
  show,
  onHide,
  onResetId,
  onCheckUpdate,
  handleCheckUpdate,
  onSetModal,
  router,
}) => {
  const { t } = useTranslation('common');
  const [checkAddTicket, setCheckaddTicket] = useState<boolean>(false);
  const [dataImg, setDataImg] = useState<string[]>([]);
  const [showUpdateTicket, setShowUpdateTicket] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState(null);
  const viewer = useRef<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router?.query?.ticketId) {
      onSetModal && onSetModal(true);
    }
  }, [router?.query?.ticketId]);

  const {
    reset,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      otherImages: dataImg || [],
    },
  });

  const formInfo = useForm<any>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const formImgInfo = useForm<any>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const {
    control: controlFormInfo,
    register: registerFormInfo,
    setValue: setValueFormInfo,
    getValues: getValueFormInfo,
    clearErrors: clearErrorsFormInfo,
    handleSubmit: handleSubmitFormInfo,
    watch,
    formState: { errors: errorsFormInfo },
  } = formInfo;

  const [img, setImg] = useState<string>('');

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img4') as HTMLElement;
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
    viewer.current && viewer.current.update();
  }, [img]);

  const {
    control: controlImgInfo,
    register: registerImgInfo,
    setValue: setValueImgInfo,
    getValues: getValueImgInfo,
    clearErrors: clearErrorsImgInfo,
    handleSubmit: handleSubmitImgInfo,
    formState: { errors: errorsImgInfo },
  } = formImgInfo;

  const handleHideUpdateTicket = () => {
    setShowUpdateTicket(!showUpdateTicket);
  };

  const handleChangeCheckUpdateTicket = (data: boolean) => {
    setCheckaddTicket(data);
  };

  const handlePreviewImg = (e: MouseEvent<any>, row?: any) => {
    viewer.current && viewer.current.show();
    const target = e.target as HTMLDivElement;
    setImg(row);
  };

  const handleChangeTicketId = (dataId: any) => {
    setTicketId(dataId);
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const handleHide = () => {
    reset();
    onHide && onHide();
    onResetId && onResetId();
    router.push(router.pathname);
  };

  const handleChangeState = (value: string) => {
    const payload = { ticketId: id, state: value };
    dispatch(
      setStateDashBoardTicket(payload, (status, res) => {
        if (status) {
          alert('success', t('Chuyển trạng thái thành công'), t);
          onResetId && onResetId();
          handleCheckUpdate && handleCheckUpdate();
        } else {
          alert('error', t('Chuyển trạng thái thất bại'), t);
          onResetId && onResetId();
        }
      })
    );
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleHide}
        backdrop='static'
        // keyboard={false}
        className='modal-dashboard-ticket-customer-support'>
        <Modal.Header closeButton>
          <Modal.Title>{t('Ticket Reply')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormInforTicket
            id={id}
            onChangeTicketId={handleChangeTicketId}
            onHideUpdateTicket={handleHideUpdateTicket}
            onChangeState={handleChangeState}
            onPreviewImg={handlePreviewImg}
            onErrorImage={handleErrorImage}
            checkAddTicket={checkAddTicket}
          />
          <div className='list-reply mb-3'>
            <div className='mb-3 head-title'>{'Danh sách phản hồi'}</div>
            <ListReplyTicketContainer
              checkAddTicket={checkAddTicket}
              onCheckUpdate={handleChangeCheckUpdateTicket}
              id={id}
            />
          </div>
          <div className='add-reply'>
            <FormAddRelyDashBoardTicket onSubmitForm={handleCheckUpdate} onCheckUpdate={handleChangeCheckUpdateTicket} id={id} />
          </div>
        </Modal.Body>
      </Modal>
      <div className='preview-identity-img4 d-none ' style={{ zIndex: '10000' }}>
        <img src={img} alt='peview' />
      </div>
    </>
  );
};

export default ModalDashBoardRelyTicket;
