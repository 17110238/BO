import { LocationType } from 'models';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { handleConvertSearch } from 'utils/helpers/elasticsearch';

interface indentifyCode {
  province?: LocationType;
  district?: LocationType;
  wards?: LocationType;
}

interface PropsComponent {
  isShow: boolean;
  onHide: () => void;
  handleChangeLocation: (value: any, isSelect: string) => void;
  dataProvince: Array<LocationType>;
  dataDistrict: Array<LocationType>;
  dataWard: Array<LocationType>;
  indentifyCode: indentifyCode;
  inititalLocation: boolean;
}

interface dataTemp {
  province: Array<LocationType>;
  district: Array<LocationType>;
  wards: Array<LocationType>;
}

interface selectLocation {
  province: boolean;
  district: boolean;
  wards: boolean;
}

export default function ModalLocation({
  isShow,
  onHide,
  handleChangeLocation,
  dataProvince,
  dataDistrict,
  dataWard,
  indentifyCode,
  inititalLocation,
}: PropsComponent) {
  const { t } = useTranslation();
  const [isSelectLocation, setSelectLocation] = useState<selectLocation>({
    province: true,
    district: false,
    wards: false,
  });
  const [searchData, setSearchData] = useState<string>('');
  const [dataTemp, setDataTemp] = useState<dataTemp>({
    province: [],
    district: [],
    wards: [],
  });
  const renderLocation = (data: Array<LocationType>, isLocation: string) => {
    return data.map((item: LocationType) => {
      return (
        <div
          key={Math.random()}
          className='modal-storeLocation__group'
          onClick={() => {
            if (isLocation === 'province') {
              setSearchData('');
              setDataTemp({
                province: [],
                district: [],
                wards: [],
              });
              setSelectLocation({ ...isSelectLocation, province: false, district: true });
              handleChangeLocation(item.identifyCode, 'province');
            }
            if (isLocation === 'district') {
              setSearchData('');
              setDataTemp({
                province: [],
                district: [],
                wards: [],
              });
              setSelectLocation({ ...isSelectLocation, district: false, wards: true });
              handleChangeLocation(item.identifyCode, 'district');
            }
            if (isLocation === 'wards') {
              setSearchData('');
              setDataTemp({
                province: [],
                district: [],
                wards: [],
              });
              setSelectLocation({ province: true, district: false, wards: false });
              handleChangeLocation(item.identifyCode, 'wards');
              onHide();
            }
          }}>
          <div className='modal-storeLocation__text'>
            <span>{item.title}</span>
          </div>
          <div className='modal-storeLocation__icon'>
            <button>
              <i className='fa fa-angle-right'></i>
            </button>
          </div>
        </div>
      );
    });
  };

  const handleSearchLocation = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchData(e.target.value);
    if (e.target.value || searchData) {
      if (isSelectLocation.province && !(isSelectLocation.district && isSelectLocation.wards)) {
        let data: any = handleConvertSearch(dataProvince, e.target.value);
        setDataTemp({ province: data, district: [], wards: [] });
      }
      if (isSelectLocation.district && !(isSelectLocation.province && isSelectLocation.wards)) {
        let data: any = handleConvertSearch(dataDistrict, e.target.value);
        setDataTemp({ district: data, province: [], wards: [] });
      }
      if (isSelectLocation.wards && !(isSelectLocation.province && isSelectLocation.district)) {
        let data: any = handleConvertSearch(dataWard, e.target.value);
        setDataTemp({ wards: data, province: [], district: [] });
      }
    } else {
      setDataTemp({
        province: [],
        district: [],
        wards: [],
      });
    }
  };
  useEffect(() => {
    if (inititalLocation) {
      if (
        indentifyCode.province?.identifyCode ||
        (indentifyCode.district?.identifyCode && !indentifyCode.wards?.identifyCode)
      )
        setSelectLocation({ province: false, district: true, wards: false });
      if (
        (indentifyCode.province?.identifyCode && indentifyCode.district?.identifyCode) ||
        indentifyCode.wards?.identifyCode
      ) {
        setSelectLocation({ province: false, district: false, wards: true });
      }
    }
  }, [indentifyCode, inititalLocation]);
  useEffect(() => {
    if (
      indentifyCode.province?.identifyCode &&
      indentifyCode.district?.identifyCode &&
      !indentifyCode.wards?.identifyCode
    )
      setSelectLocation({ province: false, district: true, wards: false });
    if (
      indentifyCode.province?.identifyCode &&
      indentifyCode.district?.identifyCode &&
      indentifyCode.wards?.identifyCode
    ) {
      setSelectLocation({ province: false, district: false, wards: true });
    }
  }, []);
  return (
    <>
      <Modal
        className='modal-storeLocation'
        backdropClassName='top-modal-backdrop'
        show={isShow}
        onHide={onHide}
        backdrop='static'>
        <Modal.Header closeButton>
          <div className='modal-storeLocation__backLocation'>
            {!isSelectLocation.province && (
              <button
                onClick={() => {
                  setSearchData('');
                  if (isSelectLocation.district && !isSelectLocation.wards) {
                    setSelectLocation({
                      province: true,
                      district: false,
                      wards: false,
                    });
                  }
                  if (!isSelectLocation.district && isSelectLocation.wards) {
                    setSelectLocation({
                      province: false,
                      district: true,
                      wards: false,
                    });
                  }
                }}>
                <i className='fa fa-arrow-left'></i>
              </button>
            )}
          </div>
          <div className='modal-storeLocation__title'>
            <p>{t('Chọn khu vực')}</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-storeLocation__search'>
            <i
              className='fa fa-times'
              style={searchData ? { display: 'block' } : {}}
              onClick={() => {
                setSearchData('');
                setDataTemp({
                  province: [],
                  district: [],
                  wards: [],
                });
              }}
            />
            <input
              className='modal-storeLocation__inputSearch'
              placeholder='Tìm kiếm khu vực'
              onChange={handleSearchLocation}
              value={searchData}
            />
          </div>
          <form className='modal-storeLocation__content'>
            {isSelectLocation.province &&
              dataProvince?.length > 0 &&
              renderLocation(
                dataTemp.province.length > 0 ? dataTemp.province : dataProvince,
                'province'
              )}
            {isSelectLocation.district &&
              dataDistrict.length > 0 &&
              renderLocation(
                dataTemp.district.length > 0 ? dataTemp.district : dataDistrict,
                'district'
              )}
            {isSelectLocation.wards &&
              dataWard.length > 0 &&
              renderLocation(dataTemp.wards.length > 0 ? dataTemp.wards : dataWard, 'wards')}
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
