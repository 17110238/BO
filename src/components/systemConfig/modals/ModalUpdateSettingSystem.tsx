import { SettingSystemType } from 'models';
import dynamic from 'next/dynamic';
import { prependListener } from 'process';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { updateSettingSystem } from 'redux/actions';
import alert from 'utils/helpers/alert';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
const { JsonEditor: Editor } = require('jsoneditor-react');

interface Props {
  show: boolean;
  data?: SettingSystemType;
  onHide: (type?: string) => void;
}

const ModalUpdateSettingSystem: React.FC<Props> = ({ show, data, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [tabInput, setTabInput] = useState<
    {
      index: number,
      hasError: boolean
    }>({
      index: 0,
      hasError: false
    });

  const {
    register,
    formState: { errors },
    control,
    reset,
    handleSubmit,
    watch,
    getValues,
    clearErrors,
  } = useForm<SettingSystemType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitUpdateTransactionValue: SubmitHandler<SettingSystemType> = (dataSubmit, e) => {
    e?.preventDefault();
    try {
      if (data?.type === 'json') dataSubmit.value = dataSubmit.value ? JSON.stringify(JSON.parse(dataSubmit.value)) : '{}';

    } catch (error) {
      setTabInput(pre => ({ ...pre, hasError: true }))
      return;
    }

    delete dataSubmit.key;
    delete dataSubmit.type;

    dispatch(
      updateSettingSystem(dataSubmit, (state, res) => {
        alert(state ? 'success' : 'error', res?.message, t);
        state && onHide && onHide('RESET_LIST');
      })
    );
  };

  const handleSelectTab = (index: number) => {
    if (index === 1 && data?.type === 'json') {
      try {
        JSON.stringify(JSON.parse(getValues('value')!));

        setTabInput({
          index,
          hasError: false
        })
      } catch (error) {
        setTabInput(pre => ({
          ...pre,
          hasError: true
        }));
      }
      return;
    }
    setTabInput(pre => ({
      ...pre,
      index
    }))
  }

  const renderInputForm = () => {
    switch (data?.type) {
      case 'json':
        return (
          <Tabs selectedIndex={tabInput.index} onSelect={handleSelectTab}>
            <TabList>
              <Tab>Text</Tab>
              <Tab>Editor</Tab>
            </TabList>
            <TabPanel>
              <div
                className='form-group form-input-textarea'
                style={{
                  backgroundColor: 'rgba(184, 182, 182, 0.3)',
                  width: '100%',
                  maxHeight: '250px',
                  minHeight: '200px',
                }}>
                <label>Giá trị</label>
                <Controller
                  control={control}
                  name='value'
                  render={({ field }) => {
                    return (
                      <textarea
                        spellCheck={false}
                        className='input-textarea'
                        placeholder='Giá trị'
                        {...field}
                        value={(() => {
                          try {
                            return JSON.stringify(
                              JSON.parse(field?.value?.replaceAll("'", '"') || '{}'),
                              null,
                              4
                            );
                          } catch (error) {
                            return field.value;
                          }
                        })()}
                        onChange={(e) => {
                          const target = e.target as HTMLTextAreaElement;

                          field.onChange(target?.value);
                          tabInput.hasError && setTabInput(pre => ({ ...pre, hasError: false }));
                        }}
                        style={{ width: '100%', minHeight: '100%', flexGrow: '1' }}></textarea>
                    );
                  }}
                />
                {tabInput.hasError && <span className='text-danger d-flex align-items-center' style={{ fontSize: 14 }}><i className='i-valid' /> Dữ liệu không đúng định dạng</span>}
              </div>
            </TabPanel>
            <TabPanel>
              <div
                className='form-group form-input-textarea form-input-jsonview'
                style={{
                  backgroundColor: 'rgba(184, 182, 182, 0.3)',
                  width: '100%',
                  maxHeight: '250px',
                  minHeight: '200px',
                }}>
                <label>Giá trị</label>

                <Controller
                  control={control}
                  name='value'
                  render={({ field }) => {
                    return (
                      <div className='jsoneditor-custom'>
                        <Editor
                          value={JSON.parse(field.value || '{}')}
                          onChange={(newValue: any) => {
                            field.onChange(JSON.stringify(newValue || {}));
                          }}
                          theme='ace/theme/github'
                        />
                      </div>
                    );
                  }}
                />
              </div>
            </TabPanel>
          </Tabs>
        );
      case 'boolean':
        return (
          <div className='form-group flex-row justify-content-between'>
            <label>{t('Giá trị')}</label>
            <label className='switch mr-0'>
              <input
                type='checkbox'
                {...register('value', {
                  setValueAs: (value) => value.toString(),
                })}
              />
              <span className='slider around'></span>
            </label>
          </div>
        );
      default:
        return (
          <div className='form-group'>
            <label>{t('Giá trị')}</label>
            <input type={data?.type === 'number' ? 'number' : 'text'} {...register('value')} />
          </div>
        );
    }
  };

  useEffect(() => {
    if (show) {
      reset(data);
      setTabInput({ index: 0, hasError: false });
    }
  }, [show, data]);

  return (
    <Modal
      show={show}
      onHide={() => {
        reset();
        onHide && onHide();
      }}
      backdropClassName='top-modal-backdrop'
      className='modal-update-setting-system'
      backdrop='static'
      //keyboard={false}
      >
      <Modal.Header closeButton>
        <p>
          {t(`Cập nhật cấu hình`)}
          <span className='highlist--strong'>#id: {data?.id}</span>
        </p>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSubmitUpdateTransactionValue)}>
          <div className='inputs-group'>
            <div className='form-input-tab'>{renderInputForm()}</div>

            <div
              className='form-group form-input-textarea'
              style={{ backgroundColor: 'rgba(184, 182, 182, 0.3)' }}>
              <label>Mô tả</label>
              <textarea
                spellCheck={false}
                className='input-textarea'
                placeholder='Diễn giải'
                {...register('description')}
                style={{ width: '100%', maxHeight: '250px', minHeight: '100px' }}></textarea>
            </div>
          </div>
          <div>
            <button className='btn btn-primary w-100'>
              <i className='fas fa-save'></i>
              {t('Cập nhật')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUpdateSettingSystem;
