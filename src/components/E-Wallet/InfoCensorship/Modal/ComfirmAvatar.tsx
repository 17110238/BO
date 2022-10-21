import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { confirmAvatarImage } from 'redux/actions';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

interface Props {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  handleRecall?: (a: boolean) => void;
  profileList: any[];
  handleResetCheckbox: () => void;
}

const ComfirmAvatar: React.FC<Props> = ({
  t,
  show,
  handleClose,
  profileList,
  handleRecall,
  handleResetCheckbox,
}) => {
  const dispatch = useDispatch();
  const handleConfirmAvatar = () => {
    const profileListFilter: any = [];
    profileList.map((profile) => {
      const obj: any = {};
      obj.accountId = profile.id;
      obj.avatar = profile.avatar;
      profileListFilter.push(obj);
    });
    const payload = {
      rejectAvatars: profileListFilter,
    };
    dispatch(
      confirmAvatarImage(payload, (status, response) => {
        if (status) {
          alert('success', response?.message, t);
          handleResetCheckbox();
          handleRecall?.(true);
        } else {
          alert('error', response?.message, t);
        }
        handleClose();
      })
    );
  };

  return (
    <Modal className='modal-info-censor-confirm' show={show} onHide={handleClose}>
      <Modal.Body>
        <div className='text-center'>
          <i className='fa fa-question-circle mt-3 icon-close' aria-hidden='true' />
        </div>
        <p className='text-center mt-3 mb-2 font-weight-normal' style={{ fontSize: 16 }}>
          {t('Bạn có đồng ý từ chối avatar không?')}
        </p>
        <div className='d-flex justify-content-center'>
          <Button className='btn-confirm' variant='secondary' onClick={() => handleConfirmAvatar()}>
            {t('Đồng ý')}
          </Button>
          <Button variant='danger' className='btn-confirm' onClick={handleClose}>
            {t('Cancel')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ComfirmAvatar;
