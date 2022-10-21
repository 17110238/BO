import React, {useState} from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useRouter } from 'next/router';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';

interface Props {
  handleSubmitSearch?: (a: any) => void;
  handleClearForm?: () => void;
}

const BoxSearchReportTransaction: React.FC<Props> = ({ handleClearForm, handleSubmitSearch }) => {

  const { t } = useTranslation('common');

  const router = useRouter();
  const { query } = useRouter();
  const { register, getValues, control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {
    },
  });

  const onClearForm = () => {

  }

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
  }

  return (
    <>
      <div className='box-search-approval-merchant box-search-report-transaction'>
        <Form onSubmit={handleSubmit(onSubmit)} className="row">
          <Form.Group as={Col} xl={3} className='form-day-month'>
            <Form.Label>{t('Ngày / Tháng')}</Form.Label>
            <Controller
              control={control}
              name={'state'}
              defaultValue={'AUTO_APPROVED'}
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
                  noOptionsMessage={() => t('Không có kết quả tìm kiếm')}
                  options={[]}
                  //value={[].find((val) => val.value === value)}
                  onChange={(e: SingleValue<any>) => onChange(e.value)}
                />
              )}
            />
          </Form.Group>
          <div className='form-group ml-3 form-date'>
            <Form.Label>{t('Duration')}</Form.Label>
            <div className='date-picker-custom'>
              <DatePickerCustomV2 placeholder={'DD/MM/YYYY'} control={control} />
            </div>
          </div>
          <div className='d-flex align-items-center ml-3 search-button-group'>
            <button className='btn btn-primary btn-search'>
              <i className='fas fa-search'></i>
              {t('Thống kê')}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default BoxSearchReportTransaction;
