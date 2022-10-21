
import React, { memo, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { Controller, useForm ,SubmitHandler} from 'react-hook-form';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import { Input } from 'ui/Form';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
interface TypeModalCancel {
    show: boolean,
    onHide: () => void
    id:number
}
interface FormSubmit {
    description?: string
}
const rulesForm = {
    isActive: { required: true },
    description: { required: true },
};
const ModalCancel = (props: TypeModalCancel) => {
    const { t } = useTranslation('common')
    const { show, onHide, id } = props
   
    
    const { register, formState: { errors }, handleSubmit, clearErrors, setError, setValue, reset, control, } = useForm<FormSubmit>({ mode: 'onSubmit', reValidateMode: 'onSubmit', });
   const handleSubmitUpdate: SubmitHandler<any>= (data)=>{
    
   }
    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{t("Cập nhật đã thanh toán")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleSubmitUpdate)} >
                        <Input
                            type='text'
                            label={t('Mã giao dịch ngân hàng / ví')}
                            register={register}
                            name='description'
                            errors={errors?.description}
                            clearErrors={clearErrors}
                            rules={rulesForm?.description}
                            placeholder={t('Nhập mã giao dịch NN/Ví')}
                            autoComplete='off'
                        />
                        <div className="d-flex justify-content-end">
                        <Button variant="primary"  type='submit'> <i className='fa fa-paper-plane'></i> Gửi</Button>
                        </div>
                       
                    </form>
                </Modal.Body>
                <Modal.Footer>
                
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default memo(ModalCancel) 
