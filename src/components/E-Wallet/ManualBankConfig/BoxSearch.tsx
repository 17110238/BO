import { DepositBankType } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

export interface SearchParams {
  bank?: string;
  state?: string;
}
interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  boxSearchRef: any;
  listDepositBank: Array<DepositBankType>;
  filter: any;
  t: (a: string) => string;
  isLoading: boolean;
}

const searchState = ['Tất cả trạng thái', 'Mở', 'Đóng'];

const BoxSearch: React.FC<Props> = ({
  t,
  showFilter,
  handleSubmitSearch,
  submitForm = false,
  boxSearchRef,
  listDepositBank,
  filter,
  isLoading,
}) => {
  const { register, getValues, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: {},
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

  const [bankOptions, setApplicationOptions] = useState<any[]>([
    { label: t('Tất cả ngân hàng'), value: '' },
  ]);

  useEffect(() => {
    listDepositBank.map((bank: any) => {
      let obj: any = {};
      obj.label = bank.bankName;
      obj.value = bank.swiftCode;
      bankOptions.push(obj);
    });
  }, [listDepositBank]);

  const searchTypeOptions = searchState.map((search) => ({
    value: search,
    label: t(`${search}`),
  }));

  return (
    <div className='box-search-manual-bank-config' ref={boxSearchRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='application' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'bank'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả ngân hàng') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={bankOptions}
                value={bankOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                }}
              />
            )}
          />
        </Form.Group>

        <Form.Group as={Col} className='searchType' xl='3' md='6' sm='6'>
          <Controller
            control={control}
            name={'state'}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ReactSelect
                styles={{
                  ...customStyles,
                  menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                  menu: (provided) => ({ ...provided, zIndex: 2 }),
                }}
                defaultValue={{ value: '', label: t('Tất cả trạng thái') }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#EFF2F7',
                    primary: '#00be00',
                  },
                })}
                options={searchTypeOptions}
                value={searchTypeOptions.find((val) => val.value === value)}
                onChange={(e: SingleValue<any>) => {
                  onChange(e.value);
                }}
              />
            )}
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
