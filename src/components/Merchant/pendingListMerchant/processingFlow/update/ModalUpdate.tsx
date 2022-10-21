import { yupResolver } from '@hookform/resolvers/yup';
import { Account, ProcessListType, ProcessingFlowResponse } from 'models';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Container, Form, Modal, Row, Col } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateProcessingFlow, getListRole } from 'redux/actions';
import alert from "utils/helpers/alert";
import * as yup from 'yup';
import Loading from 'components/common/Loading/LoadingFullScreen';
import ReactSelect, { SingleValue } from 'react-select';
// import { WithContext as ReactTags } from 'react-tag-input';
import { Role } from 'models/role/listRole';

interface ModalUpdateProps {
  t: (a: string) => string;
  show: boolean;
  handleClose: () => void;
  processingFlowInfo?: ProcessingFlowResponse | any;
  submitForm: boolean;
  handleRecallProcessingList: (a: any) => void;
}

const ModalUpdate = ({
  t,
  show,
  handleClose,
  processingFlowInfo,
  handleRecallProcessingList,
}: ModalUpdateProps) => {
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

  const removeDuplicateEmailBoUser = Array.from(new Set(boUserList.map((user: ProcessListType) => user?.username)))
    .map(username => {
      return boUserList.find((user: ProcessListType) => user.username === username)
    })

  const getFilterUserByScopeList = (role: string) => {
    return removeDuplicateEmailBoUser.filter((user: Account | any) => {
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

  const schema = yup
    .object({
      eventId: yup.string().required(),
      eventName: yup.string().required(),
      processList: yup.array().of(
        yup.object().shape({
          user: yup.array().min(1).required(),
          group: yup.string().required(),
        })
      ),
    })
    .required();

  const { register, control, handleSubmit, reset, formState: { errors }, getValues, watch } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: useMemo(() => {
      return processingFlowInfo;
    }, [processingFlowInfo]),
    resolver: yupResolver<any>(schema),
  });

  const { fields, append, remove, update } = useFieldArray<any>({
    control,
    name: 'processList',
  });

  const convertedProcessList = fields.map((processing: any, index: number) => {
    const { email, group, order, state, telegram, user } = processing;
    const convertedListRole = listRoleOptions.find((role: Role) => role.key === group);
    return {
      email: !Array.isArray(email) ? email?.split(',')?.map((emailInfo: any) => {
        return {
          label: emailInfo,
          value: emailInfo
        }
      }) : email,
      group: {
        label: convertedListRole?.description ?? '',
        value: convertedListRole?.key ?? '',
      },
      order,
      state,
      telegram,
      user: user?.map((userInfo: any) => {
        return {
          label: userInfo?.username,
          value: userInfo
        }
      }),
      userNameList: convertUsernameListOption(getFilterUserByScopeList(getValues(`processList[${index}].group`))),
      emailList: convertEmailListOption(getFilterUserByScopeList(getValues(`processList[${index}].group`)))
    }
  })

  useEffect(() => {
    reset(processingFlowInfo);
  }, [processingFlowInfo]);

  const handleCloseModal = () => {
    setProcessListError(false);
    handleClose();
    reset();
  };

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
      if (processing?.email?.length === 0) {
        return {
          ...processing,
          email: null,
        }
      } else if (Array.isArray(processing?.email)) {
        return {
          ...processing,
          email: processing?.email?.map((emailInfo: any) => {
            return emailInfo?.label
          }).join()
        }
      } else if (typeof processing?.email === 'string') {
        return {
          ...processing,
          email: processing.email
        }
      } else {
        return {
          ...processing,
          email: null,
        }
      }
    }).map((processing: any, index: number) => {
      return {
        group: processing.group,
        email: processing.email,
        order: ++index,
        user: processing?.user?.map((userInfo: any) => {
          if (userInfo?.hasOwnProperty('id')) {
            const { id, phone, username, fullname } = userInfo;

            return {
              accountId: id,
              phone,
              username,
              fullname
            }
          } else {
            const { accountId, phone, username, fullname } = userInfo;

            return {
              accountId,
              phone,
              username,
              fullname
            }
          }
        })
      }
    })

    const newData = {
      ...data,
      processList: convertProcessingList
    }

    dispatch(
      updateProcessingFlow(newData, (status, response) => {
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

  const handleAddEmail = (email: [] | string) => {
    if (Array.isArray(email)) {
      return [...email];
    }

    if (typeof email === 'string') {
      return [...email?.split(',')];
    }

    if (!email) {
      return []
    }
  }

  return (
    <Modal
      className='modal-add-processing-flow'
      show={show}
      onHide={handleCloseModal}
      backdrop='static'>
      <div className='title-add'>
        <p>{t('Cập nhật quy trình duyệt')}</p>
        <img
          src='/assets/img/icon-close-modal.svg'
          className='icon-close-modal icon-close'
          onClick={handleCloseModal}
          alt=''
        />
      </div>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
          <div className='inputs-group d-flex flex-column form-group form-element-textarea mb-20'>
            <Col className='px-0'>
              <div className={`form-group ${errors.eventId ? 'form-group__error' : ''}`}>
                <label>
                  {t('Mã quy trình')}
                  <span className='text-danger'> (*)</span>
                </label>
                <Controller
                  control={control}
                  name={'eventId'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Form.Control
                      defaultValue={processingFlowInfo?.eventId}
                      type='text'
                      {...register('eventId')}
                    />
                  )}
                />
                {errors?.eventId && (
                  <span className='form-group__error-text'>
                    {t('Mã quy trình không được để trống')}
                  </span>
                )}
              </div>
            </Col>
            <Col className='px-0'>
              <div className={`form-group ${errors.eventName ? 'form-group__error' : ''}`}>
                <label>
                  {t('Tên quy trình')}
                  <span className='text-danger'> (*)</span>
                </label>

                <Controller
                  control={control}
                  name={'eventName'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Form.Control
                      defaultValue={processingFlowInfo?.eventName}
                      type='text'
                      {...register('eventName')}
                    />
                  )}
                />
                {errors?.eventName && (
                  <span className='form-group__error-text'>
                    {t('Tên quy trình không được để trống')}
                  </span>
                )}
              </div>
            </Col>
            <div>
              <label className='input-group__title'>{t('Thứ tự duyệt')}</label>
              <div className='w-100'>
                {
                  fields.map(({ id, telegram, email, group, user }: any, index: number | any) => {
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
                                      {...register(`processList[${index}].order`)}
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
                                    defaultValue={convertedProcessList[index].group}
                                    className='select-input-form'
                                    classNamePrefix='input-select'
                                    options={listRoleOptions}
                                    onChange={(e: SingleValue<any>) => {
                                      if (e.key !== group) {
                                        update(index, {
                                          email: handleAddEmail(email),
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
                                    options={convertedProcessList[index].userNameList.filter((userInfo: Account | any) => {
                                      const usernames = getValues(`processList[${index}].user`)?.map((user: Account | any) => {
                                        if (user.hasOwnProperty('username')) {
                                          return user.username
                                        } else {
                                          return user.label
                                        }
                                      })

                                      return !usernames?.includes(userInfo.label);
                                    })}
                                    defaultValue={convertedProcessList[index].user}
                                    onChange={(value: any) => {
                                      onChange(value)
                                      update(index, {
                                        ...fields[index],
                                        user: value.map((item: any) => item?.value)
                                      })
                                    }}
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
                                    defaultValue={convertedProcessList[index].telegram}
                                    onChange={(e: any) => onChange(e.target.value)}
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
                                    options={convertedProcessList[index].emailList.filter(emailInfo => {
                                      return Array.isArray(getValues(`processList[${index}].email`)) ?
                                        !getValues(`processList[${index}].email`)?.includes(emailInfo.label)
                                        :
                                        !email?.split(',').includes(emailInfo.label)
                                    })}
                                    defaultValue={convertedProcessList?.[index]?.email}
                                    onChange={(value) => {
                                      onChange(value);
                                      update(index, {
                                        ...fields[index],
                                        email: watch(`processList[${index}].email`)
                                      })
                                    }}
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
                  }}>
                  <i className="fas fa-plus"></i>
                </Button>
                {processListError && (
                  <span className='form-group__error-text'>
                    {t("Phải có ít nhất 1 thứ tự duyệt")}
                  </span>
                )}
              </div>
            </div>
            <Button type='submit' className='btn-add align-self-end mt-2' variant='primary'>
              {t('Đồng ý')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && <Loading />}
    </Modal>
  );
};

export default ModalUpdate;
