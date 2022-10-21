import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

export interface SearchParams {
  type?: any;
  search?: string;
  group?: string;
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
  listScopeGroup: any[];
  t: (a: string) => string;
  isLoading: boolean;
}

const typeScope = ['scope', 'service'];
const BoxSearch: React.FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  setSubmitForm,
  submitForm = false,
  boxSearchRef,
  filter,
  t,
  isLoading,
  listScopeGroup,
}) => {
  const defaultType = 'scope';
  const [changePlayhoder, setChangePlayhoder] = useState<string>(defaultType);
  const { query }: any = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } =
    useForm<SearchParams>({});
  const all = { value: '', label: t('ALL') };
  const scopeMCArray = [all, ...listScopeGroup];
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
    };
    let payload = {
      ...data,
    };

    for (let key in temp) {
      if (temp.hasOwnProperty(key)) {
        if (temp[key] === undefined) {
          delete temp[key];
        }
      }
    }

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

  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [submitForm]);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      let flag = false;
      let temp: SearchParams = {};
      let from = query?.from && query?.from !== '' ? query?.from : '';
      let to = query?.to && query?.to !== '' ? query?.to : '';
      for (const key in query) {
        if (new RegExp(`<[^>]*script`).test(query[key])) {
          flag = false;
          break;
        }
        flag = true;
      }
      handleSubmitSearch && handleSubmitSearch(temp);
    }
  }, [query?.search, query?.state, query?.method]);

  const typeOptions = typeScope.map((transaction) => ({
    value: transaction,
    label: transaction,
  }));

  const handleChangePlayhoder = (value: string) => {
    setChangePlayhoder(value);
  };

  return (
    <div className='box-search-scope-dashboard' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='search' md='6' xl='4' sm='6'>
          <Form.Control
            type='text'
            placeholder={`${t('Enter')} ${changePlayhoder}`}
            autoComplete='off'
            {...register('search')}
          />
        </Form.Group>

        <Form.Group as={Col} className='type' xl='6' md='4' sm='6'>
          <Controller
            control={control}
            name={'type'}
            defaultValue={'scope'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={typeOptions[0]}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                options={typeOptions}
                value={typeOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value), handleChangePlayhoder(e.value);
                }}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='state' xl='4' md='6' sm='6'>
          <Controller
            control={control}
            name={'group'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('ALL') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                noOptionsMessage={() => {
                  return i18next.language === 'en' ? 'No options' : 'Không có kết quả tìm kiếm';
                }}
                options={scopeMCArray}
                value={scopeMCArray.find((val: any) => val.label === value)}
                onChange={(e: SingleValue<any>) => onChange(e.label)}
              />
            )}
          />
        </Form.Group>

        <div className='ml-3 search-button-group'>
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
