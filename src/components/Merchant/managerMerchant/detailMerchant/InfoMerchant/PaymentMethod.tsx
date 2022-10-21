import LocationComponent from 'components/common/Location/LocationComponent';
import dayjs from 'dayjs';
import { ContactInfoType, MerchantAccount } from 'models';
import numeral from 'numeral';
import React, { useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-maskedinput';
import { useSelector } from 'react-redux';
import ReactSelect, { SingleValue } from 'react-select';
import TagsInput from 'react-tagsinput';
import { Input } from 'ui/Form';

interface Props {
  form: UseFormReturn<MerchantAccount>;
  //   merchantType?: string;
}

const PaymentMethod: React.FC<Props> = ({ form }) => {
  const {
    setValue,
    control,
    getValues,
    clearErrors,
    watch,
    register,
    formState: { errors },
  } = form;
  const { t } = useTranslation('common');
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const handleExpandDetailMethod = () => {};

  return (
    <div className='info-content-v2 gateway-methods-v2'>
      <div className='inputs-group-v2'>
        <div className='form-group flex-full'>
          <p className='gateway-methods-v2__title '>{t('Phương thức Cổng Thanh Toán')}</p>
          {/* Check all */}
          <div className='my-2 d-flex align-items-center'>
            <input
              type='checkbox'
              className='mr-2'
              name='name[]'
              // checked={checkedCheckboxes.some(
              //   (checkedCheckbox: any) => checkedCheckbox.id === avatarImage.id
              // )}
              // onChange={() => handleCheckboxChange(avatarImage)}
            />
            <span className='title-checkbox-all'>{t('Tất cả phương thức thanh toán')}</span>
          </div>
          <div className='methods-select'>
            <div className='row'>
              <div className='col-lg-3 col-sm-12 col-md-6 my-2 d-flex flex-column method-item  py-2 px-3'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex align-items-center'>
                    <input
                      type='checkbox'
                      className='mr-2'
                      name='name[]'
                      // checked={checkedCheckboxes.some(
                      //   (checkedCheckbox: any) => checkedCheckbox.id === avatarImage.id
                      // )}
                      // onChange={() => handleCheckboxChange(avatarImage)}
                    />
                    <span className='method-item'>
                      Ví Payme <span className='state-method'>Chờ duyệt</span>
                    </span>
                  </div>
                  <div>
                    <i
                      className='fa fa-angle-right expand-icon'
                      onClick={() => {
                        handleExpandDetailMethod();
                      }}></i>
                  </div>
                </div>
                <div className='p-2'>
                  <div className={'form-input-checkbox'}>
                    <label>{t('Chuyển tiền ngay')}</label>
                    <label className='switch'>
                      <input
                        type='checkbox'
                        defaultChecked={false}
                        // {...register(
                        //   `paymentMethodExtend.${indexOfMethod(+check)}.extraData.isTransferNow` as const
                        // )}
                      />
                      <span className='slider around' />
                    </label>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-sm-12 col-md-6 my-2 d-flex flex-column method-item  py-2 px-3'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex align-items-center'>
                    <input
                      type='checkbox'
                      className='mr-2'
                      name='name[]'
                      // checked={checkedCheckboxes.some(
                      //   (checkedCheckbox: any) => checkedCheckbox.id === avatarImage.id
                      // )}
                      // onChange={() => handleCheckboxChange(avatarImage)}
                    />
                    <span className='method-item'>Ví Payme</span>
                  </div>
                  <div>
                    <i
                      className='fa fa-angle-right expand-icon'
                      onClick={() => {
                        handleExpandDetailMethod();
                      }}></i>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-sm-12 col-md-6 my-2 d-flex flex-column method-item  py-2 px-3'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex align-items-center'>
                    <input
                      type='checkbox'
                      className='mr-2'
                      name='name[]'
                      // checked={checkedCheckboxes.some(
                      //   (checkedCheckbox: any) => checkedCheckbox.id === avatarImage.id
                      // )}
                      // onChange={() => handleCheckboxChange(avatarImage)}
                    />
                    <span className='method-item'>Ví Payme</span>
                  </div>
                  <div>
                    <i
                      className='fa fa-angle-right expand-icon'
                      onClick={() => {
                        handleExpandDetailMethod();
                      }}></i>
                  </div>
                </div>
              </div>
              <div className='col-lg-3 col-sm-12 col-md-6 my-2 d-flex flex-column method-item  py-2 px-3'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex align-items-center'>
                    <input
                      type='checkbox'
                      className='mr-2'
                      name='name[]'
                      // checked={checkedCheckboxes.some(
                      //   (checkedCheckbox: any) => checkedCheckbox.id === avatarImage.id
                      // )}
                      // onChange={() => handleCheckboxChange(avatarImage)}
                    />
                    <span className='method-item'>Ví Payme</span>
                  </div>
                  <div>
                    <i
                      className='fa fa-angle-right expand-icon'
                      onClick={() => {
                        handleExpandDetailMethod();
                      }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
