import i18next from 'i18next';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import _ from 'lodash';
import { convertToQueryString, removeEmpty } from 'utils/helpers/handleQuerySearch';

export interface SearchParams {
  type?: string | string[] | any;
}

interface BoxSearchTransactionProps {
  showFilter?: boolean;
  valuesSearch?: SearchParams;
  submitForm: boolean;
  handleSubmitSearch?: (data: SearchParams) => void;
  handleClearForm?: () => void;
  onChangeDateSearch?: (data: Date, name: string) => void;
  paymentMethodList?: any[];
  setSubmitForm: (a: boolean) => void;
}


export const templateTypes = [
  {
    label: 'Chọn template',
    value: '',
  },
  {
    label: 'Email',
    value: 'EMAIL'
  },
  {
    label: 'SMS',
    value: 'SMS'
  },
  {
    label: 'Thông báo',
    value: 'NOTIFICATION'
  },
]

export default function BoxSearchTemplate({
  showFilter,
  handleSubmitSearch,
  handleClearForm,
  submitForm = false,
  valuesSearch,
  setSubmitForm,
}: BoxSearchTransactionProps) {
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
        router.replace('quan-ly-template', undefined, { shallow: true });
      }
    }
  }, [query]);

  return (
    <div className='box-search-template-list'>
      <Form>
        <Form.Group as={Col} className='template-type' xl='3'>
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
                onChange={(e: SingleValue<any>) =>{ 
                  onChange(e.value);
                  setType(e.value);
                  router.replace(`quan-ly-template?type=${e.value}`, undefined, { shallow: true });
                }}
              />
            )}
          />
        </Form.Group>
      </Form>
    </div>
  );
}
