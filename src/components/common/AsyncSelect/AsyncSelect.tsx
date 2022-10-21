import { t } from 'i18next';
import { AccountMerchant, MccCodeListType, MerchantAccount } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Control, Controller, UseFormClearErrors, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getMccCodeList, searchAccountMc, searchMerchant } from 'redux/actions';
import { searchMerchantInfoList } from 'redux/actions/merchantInfoActions';
import LoadingMore from '../Loading/LoadingMore';

interface Props {
  control: Control<any>;
  name: string;
  isAllowSearchAll?: boolean;
  rules?: any;
  placeHolder?: string;
  formatLabel?: (mc: any) => any;
  showName?: boolean;
  disableQuery?: boolean;
  className?: string;
  clearError: UseFormClearErrors<any>;
  emptyMessage?: string;
  initLabel?: string;
  keyReturn: string;
  returnType?: 'number' | 'text' | 'full';
  asyncType: 'MERCHANT' | 'ACCOUNT_MERCHANT' | 'MCCODE' | 'INFORMERCHANT';
  height?: string;
}
const LIMIT_SEARCH = 25;
const LIMIT_TIME_CALL_API = 2000;

const AsyncSelectMC: React.FC<Props> = ({
  control,
  name,
  isAllowSearchAll = true,
  disableQuery = false,
  rules = {},
  placeHolder,
  showName,
  className,
  emptyMessage,
  initLabel,
  asyncType,
  keyReturn,
  returnType = 'number',
  clearError,
  formatLabel,
  height,
  ...rest
}) => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [isShowInput, setIsShowInput] = useState<boolean>(false);

  const [callTimeout, setCallTimeout] = useState<any>();
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);
  const [loadingSelectMore, setLoadingSelectMore] = useState<boolean>(false);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [labelSelected, setLabelSelected] = useState<any>();
  const [optionLoaded, setOptionLoaded] = useState<MerchantAccount[]>([]);
  const [totalRow, setTotalRow] = useState<number>();

  const startSearch = useRef<number>(0);

  const fieldValue = useWatch({
    control,
    name,
  });

  const handleInputChange = (newValue: string) => {
    callTimeout && clearTimeout(callTimeout);
    setOptionLoaded([]);
    setInputSearch(newValue);
    startSearch.current = 0;
    newValue.length && loadOptions(newValue);
    !newValue.length && setLoadingSelect(false);
  };

  const generateFilter = (inputValue: string, type?: string) => {
    let filter = {};
    //format filter on type;
    switch (asyncType) {
      case 'MERCHANT':
        filter =
          type === 'QUERY_ID'
            ? {
                merchantId: [+inputValue],
                state: ['APPROVED'],
              }
            : {
                search: inputValue,
                state: ['APPROVED'],
              };
        break;
      case 'ACCOUNT_MERCHANT':
        filter = {
          search: inputValue,
        };
        break;
      case 'MCCODE':
        filter = {
          codeContent: inputValue,
        };
        break;
      case 'INFORMERCHANT':
        filter = {
          searchValue: inputValue,
          searchType: 'FULLNAME',
        };
        break;
      default:
        break;
    }

    return filter;
  };

  const generateUniqueList = (
    payload: any,
    callback?: (state: boolean, uniData: any[], totalRow: number) => void
  ) => {
    // call API with type and return uniqueData in callback.
    switch (asyncType) {
      case 'MERCHANT':
        dispatch(
          searchMerchant(payload, (status, res) => {
            if (status && res?.data?.length) {
              const newOptions = [...optionLoaded, ...res?.data];
              const uniqueOptions = Array.from(
                new Set(newOptions.map((mc: MerchantAccount) => +(mc.merchantId || -1)))
              ).map((id) => {
                return newOptions.find((mc: MerchantAccount) => +(mc.merchantId || -1) === id);
              });
              callback && callback(true, uniqueOptions, res?.data?.length || 0);

              return;
            }

            callback && callback(false, [], 0);
          })
        );
        break;
      case 'ACCOUNT_MERCHANT':
        dispatch(
          searchAccountMc(payload, (state, res) => {
            if (state) {
              const newOptions = [...optionLoaded, ...res.data];
              const uniqueOptions = Array.from(
                new Set(newOptions.map((item: AccountMerchant) => +(item.accountId || -1)))
              ).map((id) => {
                return newOptions.find((item: AccountMerchant) => +(item.accountId || -1) === id);
              });

              callback && callback(true, uniqueOptions, res?.data?.length || 0);

              return;
            }

            callback && callback(false, [], 0);
          })
        );
        break;
      case 'MCCODE':
        dispatch(
          getMccCodeList(payload, (state, res) => {
            if (state && res?.data?.length) {
              const newOptions = [...optionLoaded, ...res?.data];
              const uniqueOptions = Array.from(
                new Set(newOptions.map((item: MccCodeListType) => +(item.code || -1)))
              ).map((id) => {
                return newOptions.find((item: MccCodeListType) => +(item.code || -1) === id);
              });

              callback && callback(true, uniqueOptions, res?.data?.length || 0);

              return;
            }

            callback && callback(false, [], 0);
          })
        );
        break;

      case 'INFORMERCHANT':
        dispatch(
          searchMerchantInfoList(payload, (state, res) => {
            if (state && res?.length) {
              const newOptions = [...optionLoaded, ...res];
              const uniqueOptions = Array.from(
                new Set(newOptions.map((item: MccCodeListType) => +(item.id || -1)))
              ).map((id) => {
                return newOptions.find((item: MccCodeListType) => +(item.id || -1) === id);
              });

              callback && callback(true, uniqueOptions, res?.length || 0);

              return;
            }

            callback && callback(false, [], 0);
          })
        );
        break;

      default:
        callback && callback(false, [], 0);

        break;
    }
  };

  const loadOptions = (inputValue: string, loadingFull: boolean = true) => {
    const payload = {
      filter: generateFilter(inputValue.trim()),
      paging: {
        start: startSearch.current,
        limit: LIMIT_SEARCH,
      },
      sort: {
        createdAt: -1,
      },
    };
    loadingFull && setLoadingSelect(true);
    setCallTimeout(
      setTimeout(() => {
        generateUniqueList(payload, (state, data, total) => {
          loadingFull && setLoadingSelect(false);
          setLoadingSelectMore(false);
          if (state) {
            startSearch.current += LIMIT_SEARCH;
            setOptionLoaded([...data]);
            setTotalRow(total);
          } else {
            setOptionLoaded([]);
            setTotalRow(0);
          }
        });
      }, LIMIT_TIME_CALL_API)
    );
  };

  const labelSelect = (item: any) => {
    // format label on type
    switch (asyncType) {
      case 'MERCHANT':
        return (
          <p className='m-0'>
            {`${showName ? item?.contactInfo?.name : item?.businessOverview?.abbreviationName} - `}
            {item?.businessOverview?.brandName ? (
              <span className='font-weight-bold'>
                {`${item?.businessOverview?.brandName?.toUpperCase()} `}
              </span>
            ) : (
              <span className='font-italic text-light-blur'>{`[ Rỗng ] `}</span>
            )}
            {`- (${item?.merchantId})`}
          </p>
        );
      case 'ACCOUNT_MERCHANT':
        return (
          <p>
            {item?.accountId && item?.accountId?.length <= 2
              ? `${item?.accountId}`
              : item.accountId}{' '}
            - {item?.username}
          </p>
        );

      case 'MCCODE':
        return <p>{item.content}</p>;
      case 'INFORMERCHANT':
        return <p>{item?.id}-{item?.fullname}-{item?.phone}</p>;
      default:
        return '';
    }
  };

  const options: any[] =
    inputSearch.length && !loadingSelect && isShowInput && optionLoaded.length
      ? [
          { label: 'Tất cả', value: -1 },
          ...optionLoaded?.map((mc: any) => {
            return {
              ...mc,
              value: mc[keyReturn as keyof {}],
              label: formatLabel ? formatLabel(mc) : labelSelect(mc),
            };
          }),
        ]
      : [];

  !isAllowSearchAll && options.shift();

  const handleMenuScrollBottom = () => {
    if (!inputSearch.length) return;
    setLoadingSelectMore(true);
    loadOptions(inputSearch, false);
  };

  const handleSelectInput = (field: any, item: any) => {
    const result: React.MouseEventHandler<HTMLDivElement> = (e) => {
      clearError(name);
      setIsShowInput(false);
      setLabelSelected(item?.label);

      switch (returnType) {
        case 'full':
          field.onChange(item?.value ? item : undefined);
          break;
        case 'number':
          field.onChange(item?.value ? +item.value : undefined);
          break;
        default:
          field.onChange(item?.value ? item.value : undefined);
          break;
      }
    };

    return result;
  };

  const clearValue = (field?: any) => {
    const result: React.MouseEventHandler<HTMLElement> = (e) => {
      setIsShowInput(false);
      setOptionLoaded([]);
      setInputSearch('');
      setLabelSelected(undefined);
      field && field.onChange(undefined);
    };

    return result;
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.async-select-basic-ui *') ||
        target.closest('.async-select-basic-ui__box-search *')
      )
        return;
      setIsShowInput(false);
      setOptionLoaded([]);
      setInputSearch('');
    };
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (router?.query && router.query[name] && !disableQuery) {
      const filter = generateFilter(router.query[name] as string, 'QUERY_ID');

      generateUniqueList({ filter }, (state, data, total) => {
        if (state) {
          setOptionLoaded([...data]);
          setLabelSelected(labelSelect(data[0]));
          setInputSearch(router.query[name] as string);
        }
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (!fieldValue) {
      clearValue()({} as React.MouseEvent<HTMLElement, MouseEvent>);
    }
  }, [fieldValue]);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      key={1}
      render={({ field }) => {
        return (
          <div
            key={1}
            className={`async-select-basic-ui ${
              isShowInput ? 'async-select-basic-ui--focused' : ''
            } ${className}`}>
            <label
              htmlFor={`asyncSearch${name}`}
              onClick={() => {
                setIsShowInput(!isShowInput);
              }}>
              {labelSelected || initLabel || t('Danh sách đối tác')}
              <span>
                {labelSelected && (
                  <i className='fas fa-times-circle' onClick={clearValue(field)}></i>
                )}
                <i className='fas fa-chevron-down'></i>
              </span>
            </label>
            {isShowInput && (
              <div className='async-select-basic-ui__box-search'>
                <div className='async-select-basic-ui__search-async-input'>
                  <i className='fas fa-search'></i>
                  <input
                    onChange={(e) => handleInputChange(e.target.value)}
                    type='text'
                    value={inputSearch}
                    id={`asyncSearch${name}`}
                    placeholder={placeHolder || 'Tìm kiếm'}
                  />
                </div>
                <div
                  className='async-select-basic-ui__search-async-group'
                  style={{ height: `${height}px` }}>
                  {options?.length ? (
                    options?.map((item) => {
                      return (
                        <div
                          key={item.value}
                          className={`search-async-group__item ${
                            item.label === labelSelected ? 'search-async-group__item--selected' : ''
                          }`}
                          onClick={handleSelectInput(field, item)}>
                          {item.label}
                        </div>
                      );
                    })
                  ) : (
                    <div className='search-async-group__empty'>
                      {loadingSelect ? (
                        <div className='loader'></div>
                      ) : (
                        <>
                          <img
                            src='/assets/images/select-empty.png'
                            width={69}
                            height={65}
                            alt='empty img'
                          />
                          <span>{emptyMessage || t('Không có dữ liệu')}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className='async-select-basic-ui__load-more-btn'
                  onClick={() => !loadingSelectMore && handleMenuScrollBottom()}>
                  {options.length && +totalRow! === LIMIT_SEARCH ? (
                    !loadingSelectMore ? (
                      <div>{t('Tải thêm')}</div>
                    ) : (
                      <LoadingMore width={{}} />
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default AsyncSelectMC;
