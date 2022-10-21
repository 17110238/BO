import { MerchantAccount } from 'models';
import React, { useState } from 'react';
import { Control, Controller, UseFormClearErrors } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select';
import { searchMerchant } from 'redux/actions';
import { customStylesV1 } from 'utils/helpers/changeUrl';

interface MerchantAccountSelectType extends MerchantAccount {
  value: number | undefined;
  label: string;
}

interface Props {
  control: Control<any>;
  name: string;
  clearError: UseFormClearErrors<any>;
  isAllowSearchAll?: boolean;
  rules?: any;
  placeHolder?: string;
  refSelect?: any;
}
const LIMIT_SEARCH = 30;
const AsyncSelectMCA: React.FC<Props> = ({
  control,
  name,
  isAllowSearchAll = false,
  placeHolder,
  clearError,
  refSelect,
  rules = {},
  ...rest
}) => {
  const dispatch = useDispatch();

  const [callTimeout, setCallTimeout] = useState<any>();
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [startSearch, setStartSearch] = useState<number>(0);
  const [optionLoaded, setOptionLoaded] = useState<MerchantAccount[]>([]);

  const handleInputChange = (newValue: string) => {
    callTimeout && clearTimeout(callTimeout);
    setInputSearch(newValue);
    setStartSearch(0);
    newValue.length && loadOptions(newValue);
    !newValue.length && setLoadingSelect(false);
  };

  const loadOptions = (inputValue: string) => {
    const payload = {
      filter: {
        search: inputValue,
      },
      paging: {
        start: startSearch,
        limit: LIMIT_SEARCH,
      },
      sort: {
        createdAt: -1,
      },
    };
    setLoadingSelect(true);
    setCallTimeout(
      setTimeout(() => {
        dispatch(
          searchMerchant(payload, (state, res) => {
            if (state) {
              const newOptions = [...optionLoaded, ...res.data] ||[];
              const uniqueOptions = Array.from(
                new Set(newOptions.map((mc: MerchantAccount) => +(mc.merchantId || -1)))
              ).map((id) => {
                return newOptions.find((mc: MerchantAccount) => +(mc.merchantId || -1) === id);
              });
            
              setLoadingSelect(false);
              setStartSearch(startSearch + LIMIT_SEARCH);
              setOptionLoaded([...uniqueOptions]);
            }
          })
        );
      }, 1000)
    );
  };

  const options: any[] = [
    ...(optionLoaded?.map((mc: MerchantAccount) => {
      return {
        ...mc,
        value: mc.merchantId,
        label: `${
          mc?.merchantId && mc?.merchantId?.length <= 2
            ? `(#${mc?.merchantId} )`
            : `(#${mc?.merchantId} )`
        }\t  \t${mc?.businessOverview?.abbreviationName}`,
      };
    }) || [{ label: 'ALL\t  \tTất cả', value: -1 }]),
  ];

  isAllowSearchAll && options.shift();

  const handleMenuScrollBottom = () => {
    if (!inputSearch.length) return;

    loadOptions(inputSearch);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={undefined}
      render={({ field }) => {
        return (
          <AsyncSelect
            ref={refSelect}
            onInputChange={handleInputChange}
            noOptionsMessage={() => {
              return 'Nhập để tìm kiếm đối tác';
            }}
            theme={(theme: any) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#EFF2F7',
                primary: '#00be00',
              },
            })}
            styles={customStylesV1}
            isClearable
            isLoading={loadingSelect}
            placeholder={'Nhập để tìm kiếm '}
            options={options}
            filterOption={(options, input) => true}
            onMenuScrollToBottom={handleMenuScrollBottom}
            onChange={(newValue: SingleValue<MerchantAccountSelectType>) => {
              clearError(name);
              field.onChange(newValue?.value ? +newValue.value : undefined);
            }}
            {...rest}
          />
        );
      }}
    />
  );
};

export default AsyncSelectMCA;
