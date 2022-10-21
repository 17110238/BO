import React, { MouseEvent, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Card, Table } from 'react-bootstrap';
import Viewer from 'viewerjs';
import _ from 'lodash';
import dayjs from 'dayjs';
import ComfirmAvatar from '../Modal/ComfirmAvatar';
import RefuseAvatarModal from '../Modal/RefuseAvatar';
import { EwalletAccount } from 'models';
import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
interface Props {
  t: (a: string) => string;
  data: EwalletAccount[] | undefined;
  totalFilter?: number;
  onRowSelected?: any;
  deleteDefault?: boolean;
  setSubmitForm?: (a: boolean) => void;
  heightBoxSearch?: number;
  rest?: any;
  handlePreviousClick: () => void;
  handleNextClick: () => void;
  start: number;
  limit: number;
  isLoading: boolean;
}

const AvatarImage: React.FC<Props> = ({
  t,
  data,
  totalFilter,
  deleteDefault,
  setSubmitForm,
  heightBoxSearch,
  handlePreviousClick,
  handleNextClick,
  start,
  limit,
  isLoading,
  ...rest
}) => {
  const viewer = useRef<any>();
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
  const [checkedCheckboxes, setCheckedCheckboxes] = useState<any>([]);
  const [showRefuseAvatarModal, setShowRefuseAvatarModal] = useState<boolean>(false);
  const maleDefaultImage = '/2022/04/28/3kVmDuMkn.png';
  const femaleDefaultImage = '/2022/04/28/n0H5fCpxv.png';
  const noImage = '/assets/images/img-na.png';

  const handleCheckAllCheckBox = (data: any) => {
    setIsCheckedAll(!isCheckedAll);
    const getCheckedCheckboxesAll = checkedCheckboxes.concat(data);
    !isCheckedAll ? setCheckedCheckboxes(getCheckedCheckboxesAll) : setCheckedCheckboxes([]);
    let checkboxes: any = document.getElementsByName('name[]');
    checkboxes.lenght === 0 ? setIsCheckedAll(false) : '';
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = isCheckedAll ? false : true;
    }
  };

  useEffect(() => {
    const ids = checkedCheckboxes.map((checkbox: any) => checkbox.id);
    const checkedCheckboxesFilter = checkedCheckboxes.filter(
      ({ id }: any, index: any) => !ids.includes(id, index + 1)
    );
    setCheckedCheckboxes(checkedCheckboxesFilter);
  }, [isCheckedAll]);

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-avatar-img') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      title: false,
      button: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, []);
  const [imgSrc, setImgSrc] = useState<string>('');
  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [imgSrc]);

  const handleCheckboxChange = (profile: any) => {
    const isChecked = checkedCheckboxes.some(
      (checkedCheckbox: any) => checkedCheckbox.id === profile.id
    );

    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter((checkedCheckbox: any) => checkedCheckbox.id !== profile.id)
      );
    } else {
      const profileAvatar = profile?.avatar
        ? profile?.avatar
        : profile?.gender === 'MALE'
        ? maleDefaultImage
        : femaleDefaultImage;
      setCheckedCheckboxes(checkedCheckboxes.concat({ ...profile, avatar: profileAvatar }));
    }
  };

  const handleErrorImage: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;

    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  const handlePreviewImg = (img: any, gender: any) => {
    const getAvatarImage = img ? img : noImage;
    if (getAvatarImage) {
      setImgSrc(process.env.NEXT_PUBLIC_API_UPLOAD + getAvatarImage);
      viewer.current && viewer.current.show();
    }
    viewer.current && viewer.current.show();
  };

  const handleShowConfirmAvtarModal = () => {
    setIsShowConfirmModal(true);
  };

  const handleClose = () => {
    setIsShowConfirmModal(false);
  };

  const handleShowRefuseAvatar = () => {
    setShowRefuseAvatarModal(true);
  };

  const handleCloseAvatar = () => {
    setShowRefuseAvatarModal(false);
  };

  const handleResetCheckbox = () => {
    setCheckedCheckboxes([]);
    setIsCheckedAll(false);
  };

  return (
    <div className='avatar-image-container'>
      <ComfirmAvatar
        profileList={checkedCheckboxes}
        show={isShowConfirmModal}
        handleClose={handleClose}
        handleRecall={setSubmitForm}
        handleResetCheckbox={handleResetCheckbox}
        t={t}
      />
      <RefuseAvatarModal t={t} handleClose={handleCloseAvatar} show={showRefuseAvatarModal} />
      <img src={imgSrc} className='preview-avatar-img' onError={handleErrorImage} />
      <Table bordered>
        <thead>
          <tr>
            <th className='avatar-image-container__title'>{t('List Avatar')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='avatar-image-header'>
              <Button variant='primary' onClick={(e: any) => handleCheckAllCheckBox(data)}>
                {isCheckedAll ? t('Uncheck All') : t('Check all')}
              </Button>
              <Button
                variant='warning'
                onClick={(e: any) => {
                  checkedCheckboxes.length <= 0
                    ? handleShowRefuseAvatar()
                    : handleShowConfirmAvtarModal();
                }}>
                {t('Từ chối Avatar')}
              </Button>
            </td>
          </tr>
          <tr>
            <td className='avatar-image-body'>
              {data && data.length > 0 ? (
                data.map((avatarImage) => (
                  <Card className='avatar-image-body__item p-2' key={avatarImage.id}>
                    <input
                      type='checkbox'
                      className='avatar-image-body__item--checkbox'
                      name='name[]'
                      checked={checkedCheckboxes.some(
                        (checkedCheckbox: any) => checkedCheckbox.id === avatarImage.id
                      )}
                      onChange={() => handleCheckboxChange(avatarImage)}
                    />
                    <Card.Img
                      variant='top'
                      src={
                        avatarImage?.avatar
                          ? process.env.NEXT_PUBLIC_API_UPLOAD + avatarImage?.avatar
                          : noImage
                      }
                      className='mb-2 cursor-pointer'
                      onClick={() => handlePreviewImg(avatarImage?.avatar, avatarImage.gender)}
                    />
                    <div className='avatar-image-body__item-title'>
                      <p className='avatar-image-body__item-title-name'>{avatarImage.fullname}</p>
                      <span className='avatar-image-body__item-title-time'>
                        {avatarImage?.createdAt
                          ? dayjs(avatarImage?.createdAt).format('HH:mm:ss DD/MM/YYYY')
                          : ''}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className='d-flex justify-content-center align-items-center nodata'>
                  <div className='d-flex flex-column'>
                    <img src='/assets/img/no-data.png' />
                    <p className='d-flex justify-content-center mt-3'>{t('No data')}</p>
                  </div>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <div className='avatar-image-paging d-flex justify-content-end'>
                <Button
                  className='d-flex align-items-center justify-content-center '
                  disabled={start <= 0 ? true : false}
                  variant={`${start <= 0 ? 'light' : 'primary'}`}
                  onClick={() => {
                    handlePreviousClick();
                    handleResetCheckbox();
                  }}>
                  <i className='fa fa-chevron-left font-weight-bold' aria-hidden='true'></i>
                  <span>{t('Previous')}</span>
                </Button>
                <Button
                  disabled={data && data?.length < limit ? true : false}
                  variant={`${data && data?.length < limit ? 'light' : 'primary'}`}
                  className='next ml-2 d-flex align-items-center justify-content-center'
                  onClick={() => {
                    handleNextClick();
                    handleResetCheckbox();
                  }}>
                  <span>{t('Next')}</span>
                  <i className='fa fa-chevron-right' aria-hidden='true'></i>
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
        {isLoading && <LoadingFullScreen />}
      </Table>
    </div>
  );
};

export default AvatarImage;
