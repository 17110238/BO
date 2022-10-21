import { yupResolver } from '@hookform/resolvers/yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import { Account, ProcessListType } from 'models';
import { Role } from 'models/role/listRole';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import { createProcessingFlow } from 'redux/actions';
import alert from "utils/helpers/alert";
import * as yup from 'yup';
interface ModalAddProps {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  submitForm: boolean;
  handleRecallProcessingList: (a: any) => void;
}

const ModalAdd = ({
  t,
  show,
  handleClose,
  submitForm,
  handleRecallProcessingList
}: ModalAddProps) => {
  const dispatch = useDispatch();
  const isLoading = useSelector<any>((state) => state?.processingFlowReducer?.loadingModal);
  const [processListError, setProcessListError] = useState<boolean>(false);
  const listRole: any = useSelector<any, Role>((state) => state?.roleReducer?.listRole);
  const boUserList: any = useSelector<any, Account>((state) => state?.userReducers?.userBoInfoArray);
  const listRoleOptions = listRole.map((role: Role) => {
    return {
      ...role,
      label: role.description
    }
  })

  const removeDuplicateBoUser = Array.from(new Set(boUserList.map((user: ProcessListType) => user?.username)))
    .map(username => {
      return boUserList.find((user: ProcessListType) => user.username === username)
    })

  const getFilterUserByScopeList = (role: string) => {
    return removeDuplicateBoUser.filter((user: Account | any) => {
      return user.group.includes(role);
    })
  }

  const convertUsernameListOption = (users: Account[]) => {
    return users.map((account: Account | any) => {
      return {
        label: account.username,
        value: account,
      }
    })
  }

  const convertEmailListOption = (users: Account[]) => {
    return users.map((account: Account | any) => {
      return {
        label: account.email,
        value: account,
      }
    })
  }
  const schema = yup.object({
    eventId: yup.string().required(),
    eventName: yup.string().required(),
    processList: yup.array()
      .of(
        yup.object().shape({
          user: yup.array().min(1).required(),
          group: yup.string().required(),
        })
      )
  }).required()


  const { register, control, handleSubmit, reset, formState: { errors }, getValues, watch } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver<any>(schema),
  });

  const { fields, append, remove, update } = useFieldArray<any>({
    control,
    name: "processList",
  });

  const handleCloseModal = () => {
    handleClose();
    reset();
  }

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const onSubmit: SubmitHandler<any> = (data, e) => {
    if (!data.processList.length) {
      setProcessListError(true);
      return;
    }

    const removeNullData = data?.processList?.map((obj: ProcessListType) => {
      return Object.fromEntries(Object.entries(obj).filter(([_, v]) => !!v));
    })
    const convertProcessingList = removeNullData?.map((processing: any) => {
      if (processing.email.length) {
        return {
          ...processing,
          email: processing.email.map((emailInfo: any) => {
            return emailInfo.value.email
          }).join()
        }
      } else {
        return {
          ...processing,
          email: null,
        }
      }
    }).map((processing: any, index: number) => {
      return {
        email: processing.email,
        group: processing.group,
        order: ++index,
        user: processing.user.map((userInfo: {
          label: string,
          value: Account,
        }) => {
          const { id, username, phone, fullname } = userInfo.value;

          return {
            accountId: id,
            username: username,
            phone: phone,
            fullname: fullname,
          }
        })
      }
    })

    const newData = {
      ...data,
      processList: convertProcessingList
    }

    dispatch(
      createProcessingFlow(newData, (status, response) => {
        if (status) {
          alert('success', response.message, t);
          handleRecallProcessingList(true);
        } else {
          alert('error', response.message, t);
        }
        handleCloseModal();
      })
    )
  };

  return (
    <Modal className='modal-add-processing-flow' show={show} onHide={handleCloseModal} backdrop="static">
      <div className='title-add'>
        <p>{t('Thêm quy trình duyệt')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt=''
        />
      </div>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <div className='inputs-group d-flex flex-column form-group form-element-textarea mb-20'>
            <Col className="px-0">
              <div className={`form-group ${errors.eventId ? 'form-group__error' : ''}`}>
                <label>
                  {t('Mã quy trình')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Form.Control
                  type="text"
                  {...register('eventId')}
                />
                {
                  errors?.eventId &&
                  <span className='form-group__error-text'>
                    {t('Mã quy trình không được để trống')}
                  </span>
                }
              </div>
            </Col>
            <Col className="px-0">
              <div className={`form-group ${errors.eventName ? 'form-group__error' : ''}`}>
                <label>
                  {t('Tên quy trình')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Form.Control
                  type="text"
                  {...register('eventName')}
                />
                {
                  errors?.eventName &&
                  <span className='form-group__error-text'>
                    {t('Tên quy trình không được để trống')}
                  </span>
                }
              </div>
            </Col>
            <div>
              <label className='input-group__title'>{t('Thứ tự duyệt')}</label>
              <div className='w-100'>
                {
                  fields?.map(({ id, telegram, email, group, user }: any, index: number) => {
                    return (
                      <div key={id} className='processing-flow-block pb-2'>
                        <Container className="px-0">
                          <div className='d-flex mb-2 justify-content-between'>
                            <div className="form-group w-100 pr-0 quantity-input">
                              <Controller
                                defaultValue={index + 1}
                                control={control}
                                name={`processList[${index}].order`}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <>
                                    <label>{t('Duyệt bước')}</label>
                                    <Form.Control
                                      disabled
                                      className='text-center'
                                      value={index + 1}
                                      onChange={(e) => onChange(index)}
                                    />
                                  </>
                                )}
                              />
                            </div>
                            <button type="button" className='btn btn-cancel p-0' onClick={() => remove(index)}>
                              <i className="fas fa-times mx-1"></i>
                            </button>
                          </div>
                          <Col className="px-0" >
                            <div className={`form-group ${errors?.processList?.[index]?.group ? 'form-group__error' : ''}`}>
                              <label>
                                {t('Chọn bộ phận')}
                                <span className='text-danger'> (*)</span>
                              </label>
                              <Controller
                                defaultValue={group}
                                control={control}
                                name={`processList[${index}].group`}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <ReactSelect
                                    placeholder=""
                                    className='select-input-form'
                                    classNamePrefix='input-select'
                                    options={listRoleOptions}
                                    value={listRoleOptions.find((item: any) => item.key === value)}
                                    onChange={(e: SingleValue<any>) => {
                                      if (e.key !== group) {
                                        update(index, {
                                          ...fields[index],
                                          email: watch(`processList[${index}].email`) ,
                                          user: watch(`processList[${index}].user`),
                                          userNameList: convertUsernameListOption(getFilterUserByScopeList(e.key)),
                                          emailList: convertEmailListOption(getFilterUserByScopeList(e.key))
                                        })
                                      }
                                      onChange(e.key)
                                    }}
                                  />
                                )}
                              />
                              {
                                errors?.processList?.[index]?.group &&
                                <span className='form-group__error-text'>
                                  {t('Bộ phận không được để trống')}
                                </span>
                              }
                            </div>
                          </Col>
                          <Col className="px-0">
                            <div className={`form-group multi ${errors?.processList?.[index]?.user ? 'form-group__error' : ''}`}>
                              <label>
                                {t('Chọn người duyệt')}
                                <span className='text-danger'> (*)</span>
                              </label>
                              <Controller
                                control={control}
                                name={`processList[${index}].user`}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <ReactSelect
                                    placeholder=""
                                    isMulti
                                    className='select-input-form'
                                    classNamePrefix='input-select'
                                    options={getValues(`processList[${index}].userNameList`)}
                                    onChange={(value: any) => {
                                      onChange(value);
                                    }}
                                    defaultValue={user}
                                  />
                                )}
                              />
                              {
                                errors?.processList?.[index]?.user &&
                                <span className='form-group__error-text'>
                                  {t('Người duyệt không được để trống')}
                                </span>
                              }
                            </div>
                          </Col>

                          <Col className="px-0">
                            <div className="form-group">
                              <label>{t("Telegram")}</label>
                              <Controller
                                defaultValue={telegram}
                                control={control}
                                name={`processList[${index}].telegram`}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <Form.Control
                                    value={value ? value.trim() : ''}
                                    onChange={(e) => onChange(e.target.value)}
                                  />
                                )}
                              />
                            </div>
                          </Col>
                          <Col className="px-0">
                            <div className="form-group">
                              <label>{t("Email")}</label>
                              <Controller
                                defaultValue={email}
                                control={control}
                                name={`processList[${index}].email`}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <ReactSelect
                                    placeholder=""
                                    isMulti
                                    className='select-input-form'
                                    classNamePrefix='input-select'
                                    defaultValue={email}
                                    options={getValues(`processList[${index}].emailList`)}
                                    onChange={(value: any) => onChange(value)}
                                  />
                                )}
                              />
                            </div>
                          </Col>
                        </Container>
                      </div>
                    )
                  })
                }
                <Button
                  className='btn-add w-100'
                  variant='info'
                  onClick={() => {
                    append({
                      email: [],
                    });
                    setProcessListError(false);
                  }}
                >
                  <i className="fas fa-plus"></i>
                </Button>
                {
                  processListError &&
                  <span className='form-group__error-text'>
                    {t("Phải có ít nhất 1 thứ tự duyệt")}
                  </span>
                }
              </div>
            </div>
            <Button type="submit" className='btn-add align-self-end mt-2' variant='primary'>
              {t('Đồng ý')}
            </Button>
          </div>
        </Form>

      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalAdd; 
