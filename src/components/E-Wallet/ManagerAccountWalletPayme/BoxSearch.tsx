import { useRouter } from 'next/router';
import React, {MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import _ from 'lodash';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';
import { DataGetListCompany } from 'models';

interface Props {
  handleSubmitSearch?: (data: any) => void;
  loadingButton?: boolean;
  showFilter?: boolean;
  dataCompany: DataGetListCompany[]
}

interface OptionCompany {
  label?: string;
  value?: number;
}

// const optionCompany: OptionCompany[] = [
//   { label: "Tất cả công ty", value: 0 },
//   { label: "PAYME", value: 1 },
//   { label: "GATE", value: 2 },
//   { label: "DATAWORLD", value: 3 },
//   { label: "SSC EDTECH", value: 4 }
// ]

const BoxSearch: React.FC<Props> = ({
  handleSubmitSearch,
  loadingButton,
  showFilter,
  dataCompany
}) => {
  const { t } = useTranslation('common')
  const router = useRouter();
  const { query } : any = router;

  const [initialValue, setInitialValue] = useState<any>({});
  
  const { register, getValues, control, handleSubmit, reset, setValue, clearErrors, formState: { errors }, watch, setError } = useForm<any>(
    {
      defaultValues: useMemo(() => {
        return initialValue;
      }, [initialValue]),
    }
  );

  const onSubmit: SubmitHandler<any> = (data, e) => {
    e?.preventDefault();
    const convertFilter = {
      ...data,
    };
    const spreadCreatedAt = removeEmpty(_.pickBy(_.omit(convertFilter)));
    router.replace(`/vi-dien-tu/quan-ly-tk-vi-nv-payme?${convertToQueryString(spreadCreatedAt)}`, undefined, {
      shallow: true,
    });
  }
  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(`/vi-dien-tu/quan-ly-tk-vi-nv-payme`, undefined, { shallow: true });
  };

  useEffect(() => {
    reset();
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch({});
      setInitialValue({});
      return;
    }
    if (!_.isEmpty(query)) {
      const convertedQueryObj = _.omit(
        {
          ...query,
        },
      );

      if(convertedQueryObj.hasOwnProperty('accountGroupId')){
        convertedQueryObj["accountGroupId"] = +convertedQueryObj.accountGroupId
      }
      const result = removeEmpty(convertedQueryObj);
      handleSubmitSearch && handleSubmitSearch(result);
      setInitialValue(result);
    }
  }, [query]);

  const optionCompany: OptionCompany[] = [{ label: "Tất cả công ty", value: 0 },...dataCompany.map((value) => ({
    value: value.id,
    label: value.name
  }))];

  return (
    <>
      {
        showFilter && <div className='box-search__manager-accounts-wallet-payme'>
          <Form onSubmit={handleSubmit(onSubmit)} className="row">
            <Form.Group as={Col} className='form-search' xl='4' lg='4'>
              <Form.Control
                type='text'
                className='box-search__txt-search'
                placeholder={t('Tìm kiếm: SĐT, Họ Tên')}
                autoComplete='off'
                {...register('txtSearch')}
              />
            </Form.Group>
            <Form.Group as={Col} xl={3} lg={4} className='bos-search___group-company'>
              <Controller
                defaultValue={0}
                control={control}
                name={'accountGroupId'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ReactSelect
                    styles={customStyles}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary25: '#EFF2F7',
                        primary: '#00be00',
                      },
                    })}
                    classNamePrefix="select-group-company"
                    placeholder=''
                    noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                    value={optionCompany.find((c: any) => c.value === value)}
                    options={optionCompany}
                    onChange={(e: SingleValue<any>) => {
                      onChange(e.value);
                    }}
                  />
                )}
              />
            </Form.Group>
            <div className='form-btn form-group d-flex search-button-group col-xl-3 ml-0'>
              <button className='btn btn-primary btn-search' style={{ whiteSpace: 'nowrap', minWidth: '80px' }} disabled={loadingButton}>
                {!loadingButton && (
                  <>
                    <i className="fas fa-search"></i>
                    {t('Tìm kiếm')}
                  </>
                )}
                {loadingButton && <><i className='fas fa-spinner fa-pulse'></i>{t('Tìm kiếm')}</>}
              </button>
              <div className='btn-clear ml-3' onClick={onClearForm} style={{minWidth: '80px', cursor: "pointer"}} >
                <i className='fas fa-eraser mr-2'></i>
                {t('Clear')}
              </div>
            </div>
          </Form>
        </div>
      }
    </>
  )
}

export default BoxSearch