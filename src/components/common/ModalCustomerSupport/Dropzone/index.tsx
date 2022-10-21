import { filter } from 'lodash';
import { AccetedFile } from 'models';
import React, { FC, useEffect, useState } from 'react';
import callApiUPLOAD from 'api/UploadFiles';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import alert from 'utils/helpers/alert';
import CloudUploadIcon from 'components/common/Icons/CloudUpload';
import { AnyIfEmpty } from 'react-redux';

interface Props {
  setFile: (file: any) => void;
  acceptFile: AccetedFile;
  isFileValid?: boolean;
  setIsFileValid?: any;
  file: any;
  setDelete?: any;
  multiple?: boolean;
  checkadd?: boolean;
  isStaticUpload?: boolean;
  onDropProps?: any;
}

const Dropzone: FC<Props> = ({
  setFile,
  acceptFile,
  isFileValid = true,
  setIsFileValid,
  multiple,
  file,
  setDelete,
  checkadd = false,
  isStaticUpload = false,
  onDropProps,
}) => {
  const onDrop = (files: any) => {
    if (multiple) {
      !file && setFile([]);
      return files.map((file: any) => {
        setFile((prevFile: any) => [...prevFile, file]);
      });
    }
    setFile(files[0]);
    setIsFileValid && setIsFileValid(true);
  };

  const handleRemoveFile = (e: any, index?: any) => {
    e.stopPropagation();

    if (multiple) {
      const splicedState = [...file];
      splicedState.splice(index, 1);
      setFile(splicedState);
    } else {
      if (setDelete) {
        setDelete && setDelete(null);
      } else {
        setFile(null);
      }
    }
  };

  const handleDropRejected = (fileRejections: FileRejection[], event: DropEvent) => {
    return fileRejections[0].errors.map((error) => {
      switch (error.code) {
        case 'file-invalid-type':
          alert('error', 'File không đúng định dạng yêu cầu');
          break;
        case 'file-too-large':
          alert('error', 'Dung lượng file phải nhỏ hơn 20MB');
          break;
        default:
          alert('error', 'Tải file thất bại');
          break;
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: isStaticUpload ? onDropProps : onDrop,
    accept: acceptFile,
    maxSize: 20971520,
    onDropRejected: handleDropRejected,
  });

  const renderAcceptedFileIcon = () => {
    if (acceptFile.includes(AccetedFile.excel)) {
      return (
        <div style={{ fontSize: '32px', color: 'green', marginBottom: '8px', textAlign: 'center' }}>
          <i className='fas fa-file-excel' />
        </div>
      );
    } else if (acceptFile.includes(AccetedFile.word)) {
      return (
        <div style={{ fontSize: '32px', color: 'blue', marginBottom: '8px', textAlign: 'center' }}>
          <i className='fas fa-file-word' />
        </div>
      );
    } else if (acceptFile.includes(AccetedFile.pdf)) {
      return (
        <div style={{ fontSize: '32px', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>
          <i className='fas fa-file-pdf' />
        </div>
      );
    }
  };

  const handleRenderFiles = () => {
    return file.map((file: any, index: number) => {
      // console.log('file', file);
      return (
        <div key={index} className='card-dropzone'>
          {acceptFile === AccetedFile.img ? (
            <img
              src={file?.startsWith('http')? file : process.env.NEXT_PUBLIC_API_UPLOAD + file}
              alt={file?.name}
            />
          ) : (
            <>
              {renderAcceptedFileIcon()}
              <p style={{ color: '#919191' }}>{file.name}</p>
            </>
          )}
          <div className='cancel-icon'>
            <i
              onClick={(e) => handleRemoveFile(e, index)}
              className='fa fa-times'
              aria-hidden='true'></i>
          </div>
        </div>
      );
    });
  };

  return !checkadd ? (
    <div
      {...getRootProps({
        className: `dropzone ${
          multiple
            ? (isDragActive || file?.length > 0) && 'dragged'
            : (isDragActive || file) && 'dragged'
        } ${!isFileValid && 'error'}`,
      })}>
      <input {...getInputProps()} />
      {(multiple ? file?.length > 0 : file) ? (
        multiple ? (
          handleRenderFiles()
        ) : (
          <div className='card-dropzone'>
            {renderAcceptedFileIcon()}
            <p style={{ color: '#919191' }}>{file.name}</p>
            <div onClick={handleRemoveFile} className='cancel-icon'>
              <i className='fa fa-times' aria-hidden='true'></i>
            </div>
          </div>
        )
      ) : (
        <div className='default-content'>
          <div style={{ width: '32px', height: '32px', marginBottom: '8px' }}>
            <CloudUploadIcon />
          </div>
          {isDragActive ? (
            <p>Thả file tại đây...</p>
          ) : (
            <p>Kéo thả file vào đây, hoặc chọn file từ máy của bạn</p>
          )}
        </div>
      )}
    </div>
  ) : (
    <>
      {' '}
      <div
        {...getRootProps({
          className: `dropzone ${
            multiple
              ? (isDragActive || file?.length > 0) && 'dragged'
              : (isDragActive || file) && 'dragged'
          } ${!isFileValid && 'error'}`,
        })}>
        <input {...getInputProps()} />
        <div className='default-content'>
          <div style={{ width: '32px', height: '32px', marginBottom: '8px' }}>
            <CloudUploadIcon />
          </div>
          {<p>Click hoặc kéo thả ảnh vào đây...</p>}
        </div>
      </div>
      {(multiple ? file?.length > 0 : file) ? (
        multiple ? (
          <div className='dropzone-mutil-container'>{handleRenderFiles()}</div>
        ) : (
          <div className='card-dropzone'>
            {renderAcceptedFileIcon()}
            <p style={{ color: '#919191' }}>{file.name}</p>
            <div onClick={handleRemoveFile} className='cancel-icon'>
              <i className='fa fa-times' aria-hidden='true'></i>
            </div>
          </div>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default Dropzone;
