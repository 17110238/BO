import AsyncSelect from 'components/common/AsyncSelect/AsyncSelect';
import { MerChantResponse, SearchParamsEmailSms } from 'models/emailSms/emailSms';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getEmailSmsMerchant } from 'redux/actions/emailSmsAction';
import { handleReplaceUrl } from 'utils/helpers/replaceUrl';
import HeaderEmailSmsMC from './HeaderEmailSmsMC';

interface Props {
  handleSubmitSearch?: (data: SearchParamsEmailSms) => void;
  handleClearForm?: () => void;
  showFilter?: boolean;
  submitForm?: boolean;
  dataEmailSmsMerchant: MerChantResponse[];
  loading?: boolean;
}

// interface SearchParams {
//   merchantId?: string;
// }

const BoxSearchEmailSmsMC: React.FC<Props> = ({
  handleSubmitSearch,
  handleClearForm,
  showFilter,
  submitForm,
  dataEmailSmsMerchant,
  loading,
}) => {
  const { t } = useTranslation('common');
  const [start, setStart] = useState<number>(0);
  const [dataMerchant, setDataMerchant] = useState<MerChantResponse[]>([]);
  const [limit, setLimit] = useState<number>(20);
  const [isSearch, setIsSearch] = useState<boolean>(true);

  const dispatch = useDispatch();
  const { query }: any = useRouter();
  const router = useRouter();

  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors } = useForm<any>(
    {
      defaultValues: {},
    }
  );

  const refSelect = useRef<any>();

  const options = dataMerchant?.map((item) => {
    return {
      // value: item.merchantId,
      // label: item?.contactInfo?.name,
      value: item?.merChantId,
      label: item?.merChantName,
    };
  });

  options &&
    options.unshift({
      value: 0,
      label: t(`MC_ALL`),
    });

  // useEffect(() => {
  //   const payload = {
  //     // filter: {
  //     //   state: ['APPROVED'],
  //     // },
  //     paging: {
  //       start,
  //       limit,
  //     },
  //     sort: {
  //       createdAt: 1,
  //     },
  //   };

  //   dispatch(
  //     getEmailSmsMerchant(payload, (status, res) => {
  //       if (status) {
  //         setDataMerchant(res?.data);
  //       } else {
  //         setDataMerchant([]);
  //       }
  //     })
  //   );
  //   return () => {
  //     setDataMerchant([]);
  //   };
  // }, []);

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

  // useEffect(() => {
  //   if (submitForm) {
  //     handleSubmitSearch && handleSubmitSearch(getValues());
  //   }
  // }, [submitForm]);

  const onSubmit: SubmitHandler<SearchParamsEmailSms> = (data: any, e) => {
    e?.preventDefault();

    let temp = {
      ...data,
    };
    let payload = { ...data };

    for (const key in temp) {
      if (Array.isArray(temp[key]) && temp[key].length > 0) {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(''))
        );
      } else {
        window.history.replaceState(
          '',
          '',
          updateURLParameter(window.location.href, key, encodeURIComponent(temp[key]))
        );
      }
    }
    const formatData = JSON.parse(JSON.stringify(data));

    handleReplaceUrl(formatData, router);
    handleSubmitSearch && handleSubmitSearch(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace('/cong-thanh-toan/email-sms/mc', undefined, { shallow: true });
    handleSubmitSearch && handleSubmitSearch({});
    handleClearForm && handleClearForm();

    reset();
  };

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      if (query?.merchantId) setValue('merchantId', +query?.merchantId);
    }
  }, [query?.merchantId]);

  useEffect(() => {
    if (Object.keys(query).length > 0) {
      let flag = false;
      let temp: any = {};
      for (const key in query) {
        if (new RegExp(`<[^>]*script`).test(query[key])) {
          flag = false;
          break;
        }
        flag = true;
      }
      if (flag) {
        temp = {
          ...temp,
          merchantId: query?.merchantId !== 0 ? query?.merchantId : 0,
        };
        handleSubmitSearch && handleSubmitSearch({ ...temp, merchantId: +temp.merchantId });
      }
    }
  }, [query?.merchantId]);

  return (
    <>
      {
        showFilter &&
        <Form
          className='box-search-email-sms-mc d-flex row ml-0 mr-0 '
          onSubmit={handleSubmit(onSubmit)}>
          <Row
            className={`box-search ${showFilter ? '' : 'd-none'} col-lg-8 col-xl-7 col-12 mr-0 ml-0 mt-0 align-items-baseline`}>
            <Form.Group as={Col} xl='4' md='4' sm='8' className='pl-0 form-email-sms-mc'>
              <AsyncSelect
                asyncType='MERCHANT'
                control={control}
                clearError={clearErrors}
                name='merchantId'
                keyReturn='merchantId'
                {...{
                  className: 'search-merchant-select',
                  classNamePrefix: 'merchant-async-select',
                }}
              />
            </Form.Group>
            <Form.Group as={Col} xl='4' md='4' sm='3' className='d-flex align-items-end'>
              <button
                className='btn btn-primary btn-search'
                style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
                disabled={loading}>
                {!loading && (
                  <>
                    <i className='fas fa-search'></i>
                    {t('Search')}
                  </>
                )}
                {loading && <i className='fas fa-spinner fa-pulse'></i>}
              </button>
              <div className='btn-clear' onClick={onClearForm}>
                <i className='fas fa-eraser mr-2'></i>
                {t('Clear')}
              </div>
            </Form.Group>
          </Row>
          <HeaderEmailSmsMC
            totalEmail={
              dataEmailSmsMerchant.length > 0 && dataEmailSmsMerchant?.reduce((total, item, index) => {
                return total + item.mail!;
              }, 0)
              
            }
            totalSMS={
              dataEmailSmsMerchant.length > 0 &&
              dataEmailSmsMerchant?.reduce((total, item, index) => {
                return total + item.sms!;
              }, 0)
            }
          />
        </Form>
      }
    </>
  );
};

export default BoxSearchEmailSmsMC;
