import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import LocationComponent from 'components/common/Location/LocationComponent';
import { LocationType, SearchStoreInput } from 'models';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { updateURLParameter } from 'utils/helpers/convertURL';

interface PropsComponent {
  isShowFilterAdvanced: boolean;
  setShowFilterAdvanced: (e: MouseEvent<HTMLAnchorElement>) => void;
  onAfter: (payload: SearchStoreInput) => void;
  loadingSearch: boolean;
}

interface DataFormSearch {
  merchantId?: number;
  storeId?: number;
  search?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
  province?: LocationType;
  district?: LocationType;
  wards?: LocationType;
}

export default function BoxSearchStoreManage({
  isShowFilterAdvanced,
  setShowFilterAdvanced,
  onAfter,
  loadingSearch,
}: PropsComponent): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { register, control, handleSubmit, reset, clearErrors, setValue } = useForm<any>({
    defaultValues: {
      province: '',
      district: '',
      wards: '',
    },
  });
  const [isClearForm, setClearForm] = useState<number>(0);
  const handleSubmitFormSearch = (data: DataFormSearch) => {
    let num: number = isClearForm;
    setClearForm(num++);
    let payload: SearchStoreInput = {
      filter: {},
      paging: {
        start: 0,
        limit: 21,
      },
      sort: {
        createdAt: 1,
      },
    };
    if (data?.search) payload = { ...payload, filter: { ...payload.filter, search: data?.search } };
    if (data?.createdAt?.from || data?.createdAt?.to) {
      if (data?.createdAt?.from)
        payload = {
          ...payload,
          filter: {
            ...payload.filter,
            createdAt: { ...payload.filter?.createdAt, from: data?.createdAt?.from },
          },
        };
      if (data?.createdAt?.to)
        payload = {
          ...payload,
          filter: {
            ...payload.filter,
            createdAt: { ...payload.filter?.createdAt, to: data?.createdAt?.to },
          },
        };
    }
    if (data?.merchantId)
      payload = { ...payload, filter: { ...payload.filter, merchantId: data?.merchantId } };
    if (data?.province?.identifyCode)
      payload = {
        ...payload,
        filter: { ...payload.filter, province: data?.province.title },
      };
    if (data?.district?.identifyCode)
      payload = {
        ...payload,
        filter: { ...payload.filter, district: data?.district.title },
      };
    if (data?.wards?.identifyCode)
      payload = { ...payload, filter: { ...payload.filter, wards: data?.wards.title } };
    let temp: any = {
      ...data,
      from: data.createdAt?.from,
      to: data.createdAt?.to,
    };
    delete temp.createdAt;
    for (const key in temp) {
      if (temp[key] && !(key === 'province' || key === 'district' || key === 'wards')) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      } else {
        const parseUrl = window.location.search.split('?')[1];
        const params = new URLSearchParams(parseUrl);
        params.delete(key);
        const URI = parseUrl
          ? `/cong-thanh-toan/quan-ly-cua-hang?${params.toString()}`
          : '/cong-thanh-toan/quan-ly-cua-hang';
        window.history.replaceState('', '', URI);
      }
    }
    onAfter(payload);
  };
  const clearFormSearch = () => {
    let num = isClearForm;
    num++;
    let payload: SearchStoreInput = {
      filter: {},
      paging: {
        start: 0,
        limit: 21,
      },
      sort: {
        createdAt: 1,
      },
    };
    setClearForm(num);
    reset();
    router.replace('/cong-thanh-toan/quan-ly-cua-hang', undefined, { shallow: true });
    onAfter && onAfter(payload);
  };
  useEffect(() => {
    if (router.query?.search) setValue('search', router.query?.search);
    if (router.query?.from) setValue('createdAt.from', router.query?.from);
    if (router.query?.to) setValue('createdAt.to', router.query?.to);
    if (router.query?.merchantId) setValue('merchantId', router.query?.merchantId);
  }, [router.query?.search, router.query?.from, router.query?.to, router.query?.merchantId]);
  return (
    <>
      <form className='search-storeManage' onSubmit={handleSubmit(handleSubmitFormSearch)}>
        <div className='search-storeManage__item merchant'>
          {/* <label htmlFor='' className='search-storeManage__label'>
            {t('Merchant')}
          </label> */}
          <AsyncSelect
            asyncType='MERCHANT'
            control={control}
            name='merchantId'
            keyReturn='merchantId'
            clearError={clearErrors}
            {...{
              className: 'search-merchant-select search-storeManage__merchant',
              classNamePrefix: 'merchant-async-select',
            }}
          />
        </div>
        <div className='search-storeManage__item multi-query'>
          {/* <label htmlFor='' className='search-storeManage__label'>
            {t('Tìm kiếm')}
          </label> */}
          <input
            type='text'
            className='search-storeManage__multi form-control'
            autoComplete={'off'}
            placeholder='ID cửa hàng, Tên cửa hàng, Tên đăng nhập'
            {...register('search')}
          />
        </div>
        <div className='search-storeManage__item date-time'>
          {/* <label htmlFor='' className='search-storeManage__label'>
            {t('Thời gian tạo')}
          </label> */}
          <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
        </div>
        <div className='search-storeManage__item location'>
          {/* <label htmlFor='' className='search-storeManage__label'>
            {t('Khu vực')}
          </label> */}
          {
            <LocationComponent
              className={''}
              isClear={isClearForm}
              setValue={setValue}
              isResize={true}
            />
          }
        </div>
        <div className='search-storeManage__item submit-btn'>
          <div className='search-storeManage__submit'>
            <label htmlFor='' className='search-storeManage__label'></label>
            <button type='submit' className='btn btn-primary btn-search' disabled={loadingSearch}>
              <i className='fas fa-search'></i>
              {t('Tìm kiếm')}
            </button>
          </div>
          <div className='search-storeManage__clear'>
            {/* <label htmlFor='' className='search-storeManage__label'></label> */}
            <button
              type='button'
              className='btn btn-primary btn-search clear-form'
              onClick={clearFormSearch}>
              <i className='fas fa-eraser mr-2'></i>
              {t('Xóa')}
            </button>
          </div>
          {/* <a
            href=''
            className='btn-filter__advanced'
            onClick={(e) => {
              clearFormSearch();
              setShowFilterAdvanced(e);
            }}>
            {isShowFilterAdvanced ? t('Ẩn tìm kiếm nâng cao') : t('Tìm kiếm nâng cao')}
          </a> */}
        </div>
      </form>
    </>
  );
}
