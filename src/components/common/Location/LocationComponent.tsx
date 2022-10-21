import ModalLocation from 'components/common/Location/ModalLocation';
import { data } from 'jquery';
import { LocationSearchPayload, LocationType } from 'models';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocationCityList, getSubLocationList } from 'redux/actions';

const styleTruncateText: any = {
  width: '90%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

interface propsComponent {
  className: string;
  isClear: number;
  setValue: any;
  indentifyWards?: string;
  isResize?: boolean;
  name?: string;
}
interface dataOption {
  label?: string;
  value?: string;
}

interface indentifyCode {
  province?: LocationType;
  district?: LocationType;
  wards?: LocationType;
}

export default function LocationComponent({
  className,
  isClear,
  setValue,
  indentifyWards,
  isResize = false,
  name = '',
}: propsComponent) {
  const dispatch = useDispatch();
  const [dataProvince, setDataProvince] = useState<Array<LocationType>>(useSelector((state: any) => state?.utility.locations));
  const [dataDistrict, setDataDistrict] = useState<Array<LocationType>>([]);
  const [dataWard, setDataWard] = useState<Array<LocationType>>([]);
  const [indentifyCode, setIndentifyCode] = useState<indentifyCode>({
    province: {},
    district: {},
    wards: {},
  });
  const [isShowLocation, setShowLocation] = useState<boolean>(false);
  const [inititalLocation, setInititalLocation] = useState<boolean>(false);
  const renderLocationText = (indentifyCode: indentifyCode): string => {
    let str: any = '';
    if (
      indentifyCode.province?.identifyCode &&
      !(indentifyCode.district?.identifyCode && indentifyCode.wards?.identifyCode)
    ) {
      str = indentifyCode.province.title;
    }
    if (
      indentifyCode.province?.identifyCode &&
      indentifyCode.district?.identifyCode &&
      !indentifyCode.wards?.identifyCode
    ) {
      str = indentifyCode.district.title + ', ' + indentifyCode.province.title;
    }
    if (
      indentifyCode.province?.identifyCode &&
      indentifyCode.district?.identifyCode &&
      indentifyCode.wards?.identifyCode
    ) {
      str =
        indentifyCode.wards.title +
        ', ' +
        indentifyCode.district.title +
        ', ' +
        indentifyCode.province.title;
    }
    return str;
  };
  const getSubLocationData = (payload: LocationSearchPayload, isBool: boolean = false): void => {
    dispatch(
      getSubLocationList(payload, (state, res) => {
        if (state) {
          if (!isBool) {
            setDataDistrict(res.data);
          }
          if (isBool) {
            setDataWard(res.data);
          }
        }
      })
    );
  };
  const getParentLocation = (payload: LocationSearchPayload) => {
    dispatch(
      getSubLocationList(payload, (state, res) => {
        if (state) {
          const dataParent: LocationSearchPayload = {
            identifyCode: res.data[0].parentIdentifyCode,
          };
          dispatch(
            getSubLocationList(dataParent, (stateRes, dataRes) => {
              if (stateRes) {
                setIndentifyCode({
                  province: dataProvince.find(
                    (item: LocationType) =>
                      Number(item.identifyCode) === Number(dataRes.data[0].parentIdentifyCode)
                  ),
                  district: dataRes.data[0],
                  wards: res.data[0],
                });
              }
            })
          );
        }
      })
    );
  };
  const handleChangeLocation = (value: any, isSelect: string) => {
    setInititalLocation(false);
    if (isSelect === 'province') {
      const result = dataProvince.find((item: LocationType) => item.identifyCode === value);
      setIndentifyCode({ province: result, district: {}, wards: {} });
    }
    if (isSelect === 'district') {
      const result = dataDistrict.find((item: LocationType) => item.identifyCode === value);
      setIndentifyCode({ ...indentifyCode, district: result, wards: {} });
    }
    if (isSelect === 'wards') {
      const result = dataWard.find((item: LocationType) => item.identifyCode === value);
      setIndentifyCode({ ...indentifyCode, wards: result });
    }
  };
  useEffect(() => {
    if (dataProvince.length < 1) {
      dispatch(
        getLocationCityList((state, res) => {
          if (state) {
            setDataProvince(res.data);
          }
        })
      );
    }
  }, []);

  useEffect(() => {
    if (indentifyCode.province?.identifyCode) {
      const payload: LocationSearchPayload = {
        parentIdentifyCode: indentifyCode.province.identifyCode,
      };
      getSubLocationData(payload);
    }
    if (indentifyCode.district?.identifyCode) {
      const payload: LocationSearchPayload = {
        parentIdentifyCode: indentifyCode.district.identifyCode,
      };
      getSubLocationData(payload, true);
    }
  }, [indentifyCode.province, indentifyCode.district]);

  useEffect(() => {
    setInititalLocation(false);
    setIndentifyCode({
      province: {},
      district: {},
      wards: {},
    });
    setDataDistrict([]);
    setDataWard([]);
    setValue('province', {});
    setValue('district', {});
    setValue('wards', {});
  }, [isClear]);

  useEffect(() => {
    if (!name) {
      setValue('province', indentifyCode.province ? indentifyCode.province : {});
      setValue('district', indentifyCode.district ? indentifyCode.district : {});
      setValue('wards', indentifyCode.wards ? indentifyCode.wards : {});
    } else {
      let obj: any = {
        city: indentifyCode.province ? indentifyCode.province : {},
        district: indentifyCode.district ? indentifyCode.district : {},
        ward: indentifyCode.wards ? indentifyCode.wards : {}
      }
      setValue(name, obj)
      // setValue('province', indentifyCode.province ? indentifyCode.province : {});
      // setValue('district', indentifyCode.district ? indentifyCode.district : {});
      // setValue('wards', indentifyCode.wards ? indentifyCode.wards : {});
    }

  }, [indentifyCode]);

  useEffect(() => {
    if (indentifyWards && dataProvince.length) {
      const payload: LocationSearchPayload = {
        identifyCode: indentifyWards,
      };

      getParentLocation(payload);
    }
  }, [indentifyWards, dataProvince]);

  return (
    <>
      <div
        className={`search-storeManage__location ${className}`}
        onClick={() => setShowLocation(true)}>
        <div className='location-text'>
          <i className='fa fa-map-marker-alt'></i>
          <span style={isResize ? styleTruncateText : {}}>
            {renderLocationText(indentifyCode) ? renderLocationText(indentifyCode) : 'Chọn khu vực'}
          </span>
        </div>
        <div className='location-icon'>
          <div>
            <i className='fa fa-angle-down'></i>
          </div>
        </div>
      </div>
      {isShowLocation && (
        <ModalLocation
          isShow={isShowLocation}
          onHide={() => {
            setInititalLocation(true);
            setShowLocation(false);
          }}
          handleChangeLocation={handleChangeLocation}
          dataProvince={dataProvince}
          dataDistrict={dataDistrict}
          dataWard={dataWard}
          indentifyCode={indentifyCode}
          inititalLocation={inititalLocation}
        />
      )}
    </>
  );
}
