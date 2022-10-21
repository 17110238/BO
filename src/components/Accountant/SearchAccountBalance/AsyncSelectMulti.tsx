import { MerchantAccount } from 'models';
import React, { useEffect, useState } from 'react';
import { Control, Controller, UseFormClearErrors } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select';
import { searchMerchant } from 'redux/actions';
import { customStylesMuti } from 'utils/helpers/changeUrl';

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
    data?: number[];
}
const LIMIT_SEARCH = 30;
const AsyncSelectMCAMuti: React.FC<Props> = ({
    control,
    name,
    isAllowSearchAll = false,
    placeHolder,
    clearError,
    refSelect,
    rules = {},
    data = [],
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
                search: inputValue.trim(),
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
                            const newOptions = [...res.data,...optionLoaded ];
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
            }, 2000)
        );
    };

    useEffect(() => {
        const payload = {
            filter: {
                merchantId: data,
            }
        }
        if (data?.length) {
            dispatch(
                searchMerchant(payload, (state, res) => {
                    if (state) {
                        const newOptions = [...res.data,...optionLoaded ];
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
        }
    }, [])

    const options: any[] = [
        ...(optionLoaded?.map((mc: any) => {
            return {
                ...mc,
                value: + mc.merchantId,
                label: `${mc?.merchantId && mc?.merchantId?.length <= 2
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
            render={({ field: { value, onChange, onBlur } }) => {
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
                        isMulti
                        styles={customStylesMuti}
                        isClearable
                        isLoading={loadingSelect}
                        placeholder={'Chọn merchant không export '}
                        filterOption={(options, input) => true}
                        options={options}
                        onChange={(options) => {
                            return onChange(options?.map((option) => option.value))
                        }}
                        // options={options}
                        value={options.filter((option) => {
                            return value?.includes(option.value)
                        })}
                        onMenuScrollToBottom={handleMenuScrollBottom}
                        // onChange={(newValue: SingleValue<MerchantAccountSelectType>) => {
                        //     clearError(name);
                        //     field.onChange(newValue?.value ? +newValue.value : undefined);
                        // }}
                        {...rest}
                    />
                );
            }}
        />
    );
};

export default AsyncSelectMCAMuti;
