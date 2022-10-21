
import React, { memo, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useDispatch, useSelector } from 'react-redux';
import { boCompleteCrossCheck } from 'redux/actions/accountantAction';
import alert from 'utils/helpers/alert';
import dayjs from 'dayjs';
interface TypeModalUpdatePayment {
    show: boolean,
    onHide: () => void
    id: number | undefined
    handleSubmitSearch:(value:any)=>void
}
interface FormSubmit {
    withdrawTransaction?: string
}
const rulesForm = {
    isActive: { required: true },
    withdrawTransaction: { required: true },
};
interface Typepayload {
    crossCheckId: number | undefined,
    approvedAccountId: number,
    withdrawTransaction: string,
}
const ModalUpdatePayment = (props: TypeModalUpdatePayment) => {
    const { t } = useTranslation('common')
    const { show, onHide, id ,handleSubmitSearch} = props
    const dispatch = useDispatch()
  
    const approveAccountID = useSelector<any,number>((state) => state.authReducers.accountInfo?.profile.accountId)
    const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, reset, control, } = useForm<FormSubmit>({ mode: 'onSubmit', reValidateMode: 'onSubmit', });
    const handleSubmitUpdate: SubmitHandler<any> = (data) => {
        const payload: Typepayload = {
            crossCheckId: id,
            approvedAccountId: approveAccountID,
            withdrawTransaction: data.withdrawTransaction,
        }
        dispatch(boCompleteCrossCheck(payload, (status, res) => {
            if (status) {
                alert('success', res.message);
                    const defaultValues = {
                        createdAt: {
                          from: dayjs().subtract(5, 'day').toISOString(),
                          to: dayjs().endOf('date').toISOString(),
                        },
                        typeSearch: "tranId" 
                    }
                handleSubmitSearch && handleSubmitSearch(defaultValues);
                onHide();
            } else {
                alert('error', res.message);
            }
        }))

    }
    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static" >
                <Modal.Header closeButton>
                    <Modal.Title>{t(`Cập nhật đã thanh toán ${id}`)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleSubmitUpdate)} >
                        <Input
                            type='text'
                            label={t('Mã giao dịch ngân hàng / ví')}
                            register={register}
                            name='withdrawTransaction'
                            errors={errors?.withdrawTransaction}
                            clearErrors={clearErrors}
                            rules={rulesForm?.withdrawTransaction}
                            placeholder={t('Nhập mã giao dịch NN/Ví')}
                            autoComplete='off'
                        />
                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type='submit'> <i className='fa fa-paper-plane'></i> Gửi</Button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default memo(ModalUpdatePayment) 
