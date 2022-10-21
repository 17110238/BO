import { SettingWalletAdvanceType } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { updateWalletSettingAdvance } from 'redux/actions';
import alert from 'utils/helpers/alert';
// const ReactJson = dynamic(import('react-json-view'), { ssr: false });
const { JsonEditor: Editor } = require('jsoneditor-react');

interface Props {
  show: boolean;
  data?: SettingWalletAdvanceType;
  onHide: (type?: string) => void;
}

const ModalUpdateSettingAdvance: React.FC<Props> = ({ show, data, onHide }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const [tabInput, setTabInput] = useState<{
    index: number;
    hasError: boolean;
  }>({
    index: 0,
    hasError: false,
  });

  const { register, control, reset, handleSubmit, getValues } = useForm<SettingWalletAdvanceType>({
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const handleSubmitUpdateTransactionValue: SubmitHandler<SettingWalletAdvanceType> = (
    dataSubmit,
    e
  ) => {
    e?.preventDefault();
    try {
      if (data?.type === 'json')
        dataSubmit.value = dataSubmit.value
          ? JSON.stringify(JSON.parse(dataSubmit.value.toString()))
          : '{}';
    } catch (error) {
      setTabInput((pre) => ({ ...pre, hasError: true }));
      return;
    }

    delete dataSubmit.key;
    delete dataSubmit.type;
    dataSubmit.appId = undefined;
    dataSubmit.appName = undefined;

    dispatch(
      updateWalletSettingAdvance(
        { ...dataSubmit, value: dataSubmit?.value?.toString() },
        (state, res) => {
          alert(state ? 'success' : 'error', res?.message, t);
          state && onHide && onHide('RESET_LIST');
        }
      )
    );
  };

  const handleSelectTab = (index: number) => {
    if (index === 1 && data?.type === 'json') {
      try {
        JSON.stringify(JSON.parse(getValues('value')?.toString()!));

        setTabInput({
          index,
          hasError: false,
        });
      } catch (error) {
        setTabInput((pre) => ({
          ...pre,
          hasError: true,
        }));
      }
      return;
    }
    setTabInput((pre) => ({
      ...pre,
      index,
    }));
  };

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
                              JSON.parse(field?.value?.toString().replaceAll("'", '"') || '{}'),
                              null,
                              4
                            );
                          } catch (error) {
                            return field.value?.toString();
                          }
                        })()}
                        onChange={(e) => {
                          const target = e.target as HTMLTextAreaElement;

                          field.onChange(target?.value);
                          tabInput.hasError && setTabInput((pre) => ({ ...pre, hasError: false }));
                        }}
                        style={{ width: '100%', minHeight: '100%', flexGrow: '1' }}></textarea>
                    );
                  }}
                />
                {tabInput.hasError && (
                  <span className='text-danger d-flex align-items-center' style={{ fontSize: 14 }}>
                    <i className='i-valid' /> Dữ liệu không đúng định dạng
                  </span>
                )}
              </div>
            </TabPanel>
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
                      <div className='jsoneditor-custom'>
                        <Editor
                          value={JSON.parse(field.value?.toString() || '{}')}
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
                  setValueAs: (value) => value === 'true',
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
      if (data?.type === 'boolean') reset({ ...data, value: data?.value === 'true' });
      else reset(data);
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
        <form onSubmit={handleSubmit(handleSubmitUpdateTransactionValue)} noValidate>
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

export default ModalUpdateSettingAdvance;
