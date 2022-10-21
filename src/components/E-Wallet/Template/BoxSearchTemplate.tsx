import React, { useEffect, useState, useMemo } from 'react'
import { templateTypes } from 'components/Template/BoxSearchTemplate'
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import ReactSelect, { SingleValue } from 'react-select';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import _ from 'lodash';



interface Props {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void
}

interface SearchParams {
  id?: number,
  type?: string | string[] | any;
}

const BoxSearchTemplate: React.FC<Props> = ({
  showFilter,
  valuesSearch,
  submitForm,
  handleSubmitSearch,
  handleClearForm,
  onChangeDateSearch,
  paymentMethodList,
  setSubmitForm
}) => {

  const { t } = useTranslation('common');
  const router = useRouter();
  const defaultValue = {};
  const [initialValue, setInitialValue] = useState<any>({});
  const query = router.query;
  const stringifyQuery = JSON.stringify(query);
  const [type, setType] = useState<string | any>('');


  const { register, getValues, control, handleSubmit, reset } = useForm<SearchParams>({
    defaultValues: useMemo(() => {
      return initialValue;
    }, [initialValue]),
  });

  useEffect(() => {
    reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (submitForm) {
      handleSubmitSearch && handleSubmitSearch(getValues());
    }
  }, [submitForm, showFilter]);

  useEffect(() => {
    if (_.isEmpty(query)) {
      handleSubmitSearch && handleSubmitSearch(defaultValue!);
      setInitialValue(defaultValue);
    }

    if (_.has(query, 'type')) {
      const filter = {
        type: query?.type
      }
      handleSubmitSearch && handleSubmitSearch(filter);
      setInitialValue(filter);

      if (query.type === '') {
        router.replace('/vi-dien-tu/quan-ly-template', undefined, { shallow: true });
      }
    }
  }, [query]);

  return (
    <>
      {showFilter && <div className='box-search-template-list'>
        <Form>
          <Form.Group as={Col} className='template-type mb-0' xl='2' sm='3'>
            {/* <Form.Label>{t('Loại')}</Form.Label> */}
            <Controller
              control={control}
              name={'type'}
              defaultValue={''}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <ReactSelect
                  styles={{
                    ...customStyles,
                    menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                    menu: (provided) => ({ ...provided, zIndex: 2 })
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
                  options={templateTypes}
                  value={templateTypes.find((val) => val.value === value)}
                  placeholder=''
                  onChange={(e: SingleValue<any>) => {
                    onChange(e.value);
                    setType(e.value);
                    router.replace(`quan-ly-template?type=${e.value}`, undefined, { shallow: true });
                  }}
                />
              )}
            />
          </Form.Group>
        </Form>
      </div >}
    </>

  )
}


export default BoxSearchTemplate