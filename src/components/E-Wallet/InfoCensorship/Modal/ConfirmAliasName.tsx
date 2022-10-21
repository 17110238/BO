import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import alert from 'utils/helpers/alert';
import { confirmAliasName } from 'redux/actions';
import { convertEnumtoArray } from 'utils/helpers/convertEnumtoArray';
import { ProfileAliasActionEnum, ProfileAliasInput } from 'models';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';

interface Props {
    t: (a: string) => string;
    show: boolean;
    handleClose: () => void;
    profiledAliasId: number;
    aliasName: string | undefined;
    handleRecall: (a: boolean) => void;
    action: string;
}

const actionOptions = [...convertEnumtoArray(ProfileAliasActionEnum)];

const ConfirmAliasName: React.FC<Props> = ({
    t,
    show,
    handleClose,
    profiledAliasId,
    action,
    aliasName,
    handleRecall,
}) => {
    const dispatch = useDispatch();
    const loading = useSelector<any>((state) => state?.infoCensorReducer?.loading);
    const handleConfirmAliasName = () => {
        const payload: ProfileAliasInput = {
            aliasName,
            profiledAliasId,
            action: actionOptions.find((value) => value === action),
        };
        dispatch(
            confirmAliasName(payload, (status, response) => {
                if (status) {
                    alert('success', response?.message, t);
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
                    <Button className='btn-confirm' variant='secondary' onClick={() => handleConfirmAliasName()}>
                        {t('Đồng ý')}
                    </Button>
                    <Button variant='danger' className='btn-confirm' onClick={handleClose}>
                        {t('Cancel')}
                    </Button>
                </div>
                {loading && <LoadingFullScreen />}
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmAliasName;
