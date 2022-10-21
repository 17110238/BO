import DatePickerCustomV2 from 'components/common/DatePickerCustom/DatePickerCustomV2';
import { useRouter } from 'next/router';
import { FC, MouseEventHandler, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface Props {
  handleSubmitSearch?: (data: any) => void;
  submitForm?: boolean;
  setSubmitForm?: any;
  showFilter?: any;
  loading: boolean;
}

const BoxSearchEwalletReport: FC<Props> = ({
  showFilter,
  handleSubmitSearch,
  loading,
  submitForm,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    register,
    getValues,
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      createdAt: {
        from: dayjs().subtract(7, 'day').startOf('day').utc().format(),
        to: dayjs().endOf('date').utc().format(),
      },
    },
  });

  const onClearForm: MouseEventHandler<any> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    handleSubmitSearch && handleSubmitSearch({});
  };

  const onSubmit: SubmitHandler<any> = (data: any, e) => {
    e?.preventDefault();
    Object.entries(data).forEach((value) => {
      if (!value[1]) {
        delete data[value[0]];
      }
    });
    let temp = {
      ...data,
      from: data.createdAt?.from ? data.createdAt?.from : '',
      to: data.createdAt?.to ? data.createdAt?.to : '',
    };
    delete temp.createdAt;
    if (!temp.from) {
      delete temp.from;
    }
    if (!temp.to) {
      delete temp.to;
    }
    let payload = { ...temp };
    handleReplaceUrl(payload, router);
    // console.log('data', data);
    handleSubmitSearch && handleSubmitSearch(data);
  };

  useEffect(() => {
    const params = { ...router.query };
    if (!Object.keys(router.query).length) return;
    delete params.to;
    delete params.from;

    const payload = clearFalsyObject({
      ...params,
      createdAt: {
        from: router.query?.from,
        to: router.query?.to,
      },
    });

    reset(payload, { keepDefaultValues: true });
  }, []);

  return (
    showFilter && (
      <Form className='box-search-container'>
        <div className='form-group mb-3 form-date'>
          <div className='date-picker-custom'>
            <DatePickerCustomV2 placeholder={'DD/MM/YYYY HH:mm'} control={control} />
          </div>
        </div>
        <div className='d-flex align-items-center mb-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            style={{ marginTop: 0 }}
            className='btn btn-primary btn-search'>
            <i className='fas fa-search'></i>
            {t('Tìm kiếm')}
          </button>

          <button type='button' onClick={onClearForm} className='btn-clear ml-2'>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </button>
        </div>
      </Form>
    )
  );
};

export default BoxSearchEwalletReport;
