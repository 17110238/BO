import DatePickerBackUp from 'components/common/DatePickerCustom/DatePickerBackUp';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useMemo } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import { clearFalsyObject, handleReplaceUrl } from 'utils/helpers/replaceUrl';
import { PayloadDate } from './BankReportFormContainer';
dayjs.extend(quarterOfYear);

interface BoxSearchBankReportType extends PayloadDate {
  quarter: number;
  year: number;
}
interface Props {
  handleSubmitSearch?: (a: any) => void;
  handleClearForm?: () => void;
  loading?: boolean;
}

export default function BoxSearchReportSocial({
  handleSubmitSearch,
  handleClearForm,
  loading,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();

  const initData = useMemo(
    () => ({
      createdAt: {
        from: dayjs().startOf('quarter').utc().format(),
        to: dayjs().endOf('quarter').utc().format(),
      },
    }),
    []
  );

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BoxSearchBankReportType>({
    defaultValues: initData,
    reValidateMode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<BoxSearchBankReportType> = (data: BoxSearchBankReportType, e) => {
    e?.preventDefault();
    const formatData = _.pick(clearFalsyObject(data), 'createdAt');

    handleReplaceUrl(formatData, router);

    handleSubmitSearch && handleSubmitSearch(formatData);
  };

  const onClearForm: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    router.replace(router.pathname, undefined, { shallow: true });
    reset();
    handleClearForm && handleClearForm();
    handleSubmitSearch && handleSubmitSearch(initData);
  };

  // list option mechant state
  useEffect(() => {
    const params = { ...router.query };

    if (Object.keys(router.query).length > 0) {
      delete params.to;
      delete params.from;
      const payload = clearFalsyObject({
        createdAt: {
          from: router.query?.from ? (router.query?.from as string) : initData.createdAt.from,
          to: router.query?.to ? (router.query?.to as string) : initData.createdAt.to,
        },
      });

      reset(payload, { keepDefaultValues: true });
    }
  }, []);

  return (
    <div className='ewallet-bank-report__box-search'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Col} className='form-MC-state form-date-year'>
          <Controller
            control={control}
            name={'year'}
            defaultValue={dayjs().year()}
            render={({ field }) => (
              <ReactSelect
                isSearchable={false}
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
                options={yearOptionSelect}
                value={yearOptionSelect.find((val) => val.value === field.value) || null}
                onChange={(e: SingleValue<any>) => {
                  const currentCreatedAt = getValues('createdAt');

                  const createdAt = {
                    from: dayjs(currentCreatedAt.from || initData.createdAt.from)
                      .year(e.value)
                      .utc()
                      .format(),
                    to: dayjs(currentCreatedAt.to || initData.createdAt.to)
                      .year(e.value)
                      .utc()
                      .format(),
                  };
                  setTimeout(() => {
                    reset({ ...getValues(), createdAt }, { keepDefaultValues: true });
                  }, 50);
                  field.onChange(e.value);
                }}
              />
            )}
          />
        </Form.Group>
        <Form.Group as={Col} className='form-MC-state form-date-season'>
          <Controller
            control={control}
            name={'quarter'}
            defaultValue={dayjs().quarter()}
            render={({ field }) => (
              <ReactSelect
                isSearchable={false}
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
                options={quarterOptionSelect}
                value={quarterOptionSelect.find((val) => val.value === field.value) || null}
                onChange={(e: SingleValue<any>) => {
                  const currentCreatedAt = getValues('createdAt');

                  const createdAt = {
                    from: dayjs(currentCreatedAt.from || initData.createdAt.from)
                      .quarter(e.value)
                      .startOf('quarter')
                      .utc()
                      .format(),
                    to: dayjs(currentCreatedAt.to || initData.createdAt.to)
                      .quarter(e.value)
                      .endOf('quarter')
                      .utc()
                      .format(),
                  };
                  setTimeout(() => {
                    reset({ ...getValues(), createdAt }, { keepDefaultValues: true });
                  }, 50);
                  field.onChange(e.value);
                }}
              />
            )}
          />
        </Form.Group>
        <div className='form-group form-date'>
          <DatePickerBackUp
            rules={{ from: { required: true }, to: { required: true } }}
            className={`${errors?.createdAt?.from ? ' date-picker-from-error' : ' '}
              ${errors?.createdAt?.to ? ' date-picker-to-error' : ' '}
              `}
            placeholder={'DD/MM/YYYY'}
            control={control}
            fixMaxDate={false}
          />
        </div>
        <div className='d-flex align-items-center search-button-group'>
          <button
            className='btn btn-primary btn-search'
            disabled={loading}
            style={{ minWidth: 130 }}>
            {loading ? (
              <i className='fas fa-spinner fa-pulse'></i>
            ) : (
              <>
                <i className='fas fa-search'></i>
                {t('Tìm kiếm')}
              </>
            )}
          </button>
          <div className={`btn btn-clear ${loading && 'btn--disabled'}`} onClick={onClearForm}>
            <i className='fas fa-eraser mr-2'></i>
            {t('Clear')}
          </div>
        </div>
      </Form>
    </div>
  );
}

const yearOptionSelect = new Array(dayjs().year() + 1 - 2019).fill(null).map((_, index) => {
  return {
    value: 2019 + index,
    label: `Năm ${2019 + index}`,
  };
});

const quarterOptionSelect = new Array(4).fill(null).map((_, index) => {
  return {
    value: index + 1,
    label: `Quý ${index + 1}`,
  };
});
