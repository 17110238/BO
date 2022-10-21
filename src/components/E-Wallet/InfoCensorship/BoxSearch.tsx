import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export interface SearchParams {
  search?: string;
  type?: string;
  createdAt?: { from?: any; to?: any };
  updatedAvatarAt?: { from?: any; to?: any };
  searchValue?: string;
  searchType?: string;
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  setSubmitForm: (a: boolean) => void;
  boxSearchRef: any;
  filter: any;
  handleShowDataTable: (table: string) => void;
  isLoading: boolean;
}

const typeIdState = ['aliasName', 'avatarImage'];

const BoxSearch: React.FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  boxSearchRef,
  handleShowDataTable,
  isLoading,
  setSubmitForm,
  filter,
}) => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { query }: any = useRouter();
  const [showAliasName, setShowAliasName] = useState<boolean>(true);
  const [showName, setShowName] = useState<string>('');
  const handleShowAliasName = (value: string) => {
    value === 'aliasName' ? setShowAliasName(true) : setShowAliasName(false);
    setShowName(value);
  };

  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } =
    useForm<SearchParams>({
      defaultValues: {
        createdAt: {
          from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
          to: dayjs().endOf('date').utc().format(),
        },
      },
    });

  const updateURLParameter = (url: string, param: any, paramVal: any): string => {
    let newAdditionalURL = '';
    let tempArray = url.split('?');
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = '';
    if (additionalURL) {
      tempArray = additionalURL.split('&');
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split('=')[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = '&';
        }
      }
    }
    let rows_txt = temp + '' + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt;
  };

  const onSubmit: SubmitHandler<SearchParams> = (data: any, e) => {
    e?.preventDefault();
    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };

    let payload = {
      ...data,
      search: data.search,
      searchValue: data.searchValue,
    };
    !data.createdAt?.from && delete payload.createdAt.from;
    !data.createdAt?.to && delete payload.createdAt.to;

    if (showName === 'avatarImage') {
      delete payload.createdAt;
      payload.updatedAvatarAt = {
        from: data.createdAt?.from ? data.createdAt?.from : '',
        to: data.createdAt?.to ? data.createdAt?.to : '',
      };
    } else {
      delete payload.updatedAvatarAt;
    }

    !payload.updatedAvatarAt?.from && delete payload?.updatedAvatarAt?.from;
    !payload.updatedAvatarAt?.to && delete payload?.updatedAvatarAt?.to;

    delete temp.createdAt;
    for (const key in temp) {
      if (Array.isArray(temp[key]) && temp[key].length > 0) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key][0]))
        );
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      }
    }
    handleSubmitSearch && handleSubmitSearch(payload);
  };

  const transactionIdOptions = typeIdState.map((transaction) => ({
    value: transaction,
    label: t(`${transaction}`),
  }));

  return (
    <div className='box-search-information-censorship' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='search' md='6' xl='3' sm='12'>
          <Form.Control
            type='text'
            placeholder={`${t('Enter')}: ${
              t('UserID').charAt(0).toLocaleLowerCase() + t('UserID').slice(1)
            }, ${t('Số điện thoại').charAt(0).toLocaleLowerCase() + t('Số điện thoại').slice(1)} `}
            autoComplete='off'
            {...register('search')}
          />
        </Form.Group>

        {showAliasName && (
          <Form.Group as={Col} className='alias' md='6' xl='2' sm='12'>
            <Form.Control type='text' placeholder='aliasName' autoComplete='off' />
          </Form.Group>
        )}

        <div className='form-group ml-3 form-date'>
          <div className='date-picker-custom'>
            <DatePickerCustomV2
              placeholder={'DD/MM/YYYY'}
              control={control}
              {...register('updatedAvatarAt')}
            />
          </div>
        </div>

        <Form.Group as={Col} className='type' xl='2' md='12' sm='12'>
          <ReactSelect
            styles={{
              ...customStyles,
              menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
              menu: (provided) => ({ ...provided, zIndex: 2 }),
            }}
            defaultValue={{ value: '', label: 'aliasName' }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#EFF2F7',
                primary: '#00be00',
              },
            })}
            options={transactionIdOptions}
            onChange={(e: SingleValue<any>) => {
              handleShowDataTable(e.value);
              handleShowAliasName(e.value);
            }}
          />
        </Form.Group>
        <div className='d-flex ml-2 search-button-group'>
          <button className='btn btn-primary btn-search' disabled={isLoading as any}>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default BoxSearch;
