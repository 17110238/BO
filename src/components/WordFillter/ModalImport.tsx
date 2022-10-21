import callApiUPLOAD from 'api/UploadFiles';
import Dropzone from 'components/common/Dropzone';
import { AccetedFile, EWalletWordFillter } from 'models';
import React, { memo, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListWordFillter, updateWordFillter } from 'redux/actions/eWalletWordFillter';
import alert from 'utils/helpers/alert';
interface TypeModalImport {
  show: boolean;
  onHide: () => void;
  data: EWalletWordFillter | undefined;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
    submitForm?: boolean;
    setSubmitForm?: (a: boolean) => void;
  };
}
interface FormSubmit {
  file: File;
}
const rulesForm = {
  isActive: { required: true },
  withdrawTransaction: { required: true },
};
interface Typepayload {
  crossCheckId: number;
  approvedAccountId: number;
  withdrawTransaction: string;
}
const ModalImport = (props: TypeModalImport) => {
  const { t } = useTranslation('common');
  const { show, onHide, data, getDataList } = props;
  const [emailFile, setEmailFile] = useState<any>(null);
  const [validate, setValidate] = useState<any>(false);
  const [isFileValid, setIsFileValid] = useState(true);
  const dispatch = useDispatch();
  const approveAccountID = useSelector<any, number>(
    (state) => state.authReducers.accountInfo?.profile.accountId
  );
  const handleUploadFile = async (data: File) => {
    const formData = new FormData();
    formData.append('files', data);
    try {
      const { data: res } = await callApiUPLOAD(formData);
      if (res.code === 1000) {
        // process.env.NEXT_PUBLIC_API_UPLOAD
        let obj = {
          name: res.data[0].fileName,
          path: res.data[0].path,
        };

        setEmailFile(obj);
      }
    } catch (error) {
      alert('error', 'Error Upload File', t);
    }
  };
  useEffect(() => {
    return () => {
      const payload: any = {
        paging: {
          start: 0,
          limit: 20,
        },
        sort: {},
      };
      dispatch(getListWordFillter(payload, (status, res) => {}));
    };
  }, []);

  const handleSubmitUpdate = () => {
    if (!emailFile) {
      // setValidate(true)
      setIsFileValid(false);
      return;
    }
    console.log(emailFile?.path);

    const payload: any = {
      id: data?.id,
      title: data?.title,
      description: data?.description,
      isActive: data?.isActive,
      fileName: data?.fileName,
      type: data?.type,
      file: emailFile?.path,
    };
    dispatch(
      updateWordFillter(payload, (status, res) => {
        if (status) {
          alert('success', res.message);
          onHide();
        } else {
          alert('error', res.message);
        }
      })
    );
  };
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>{t(`Cập nhật [${data?.description}]`)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Dropzone
              acceptFile={AccetedFile.excel}
              file={emailFile}
              setFile={handleUploadFile}
              isFileValid={isFileValid}
              setIsFileValid={setIsFileValid}
              setDelete={setEmailFile}
            />
            {validate && (
              <p className='mt-10 mb-0 txt-valid'>
                <i className='i-valid' />
                {t('File không được để trống')}
              </p>
            )}
            <div className='d-flex justify-content-end mt-3'>
              <Button variant='primary' onClick={() => handleSubmitUpdate()}>
                {' '}
                <i className='fa fa-paper-plane'></i> {t('Gửi')}{' '}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(ModalImport);
