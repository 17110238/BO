import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getMerchantReportCrossCheck } from 'redux/actions/accountantAction';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'ui/Form';
import { FilterSendMerchantReportCrossCheck } from 'models';

export interface Props {
  showModalSendEmail?: boolean
  onHide?: (a: string) => void
  handleSendMail: (a: string[]) => void
  email?: string
}


const ModalSendMail: React.FC<Props> = ({
  showModalSendEmail,
  onHide,
  handleSendMail,
  email
}) => {

  const { t } = useTranslation('common')
  const dispatch = useDispatch()

  const [emailList, setEmailList] = useState<any>([]);
  const [radio, setRadio] = useState<any>({
    emailDefault: true,
  })

  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    reset,
    setError,
    getValues,
    control,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const handleChangeTags = (tag: any) => {
    setEmailList(tag)
  }


  const onSubmit: SubmitHandler<any> = (data) => {
    const { email } = data;
    if (radio?.emailDefault) {
      handleSendMail(email ? [email] : []);
    } else {
      handleSendMail(email ? email.split(',') : []);
    }
  }

  useEffect(() => {
    clearErrors('email')
    if (radio?.emailDefault) {
      reset({ email })
      return;
    }
    reset({ email: '' })
  }, [radio.emailDefault]);

  return (
    <Modal
      show={showModalSendEmail}
      onHide={() => { onHide && onHide('modalSendMail') }}
      backdrop='static'
      className='modal-send-mail'
      // keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('Gửi mail')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='modal__send--mail-checkbox'>
          <Form.Check
            defaultChecked
            key="1"
            id="sendMailDefault"
            type="radio"
            inline
            name="sendMail"
            label="Gửi email mặc định"
            onChange={() => {
              setRadio({
                emailDefault: true,
              })
            }}
          />
          <Form.Check
            key="2"
            id="sendMailCustom"
            type="radio"
            inline
            name="sendMail"
            label="Gửi email tự nhập"
            onChange={() => {
              setRadio({
                emailDefault: false,
              })
            }}
          />
        </div>
        <form className='modal__send--mail-content' onSubmit={handleSubmit(onSubmit)}>
          {
            radio?.emailDefault ?
              <Input
                formGroupClassName={`${errors?.email?.type ? 'input-custom-error' : ''} input-send-mail`}
                type='text'
                name='email'
                label={t('')}
                register={register}
                clearErrors={clearErrors}
                errors={errors.email}
                rules={{ required: true }}
                placeholder={t('Email đối tác')}
              /> :
              <div className={`form-input list-merchant-wrap`}>
                <label>{t('Nhập email đối tác')}</label>
                <div className={`form-group ${errors?.email?.type ? 'input-custom-error' : ''} `}>
                  <Controller
                    control={control}
                    name='email'
                    defaultValue=''
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <TagsInput
                          value={field.value ? field.value.split(',') : []}
                          validationRegex={
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          }
                          onChange={(tag: string[]) => {
                            field.onChange(tag.join(','));
                          }}
                          className='form-control input-tags base-input'
                          // className={`${errors?.email?.message ? 'input-custom-error' : ''} form-control base-input`}
                          addKeys={[188, 13]}
                          inputProps={{
                            placeholder: t('Nhập email đối tác cách nhau dấu ,'),
                            style: { minWidth: '250px' },
                          }}
                          addOnBlur={true}
                        />
                      )
                    }}
                  />

                </div>
              </div>
          }
          <div className='modal__send-mail-button'>
            <button type='submit' className='btn btn-success m-auto'>Gửi</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalSendMail
