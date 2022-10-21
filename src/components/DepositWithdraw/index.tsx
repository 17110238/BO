import React, { useEffect, useState } from 'react';
import DepositWithdrawForm from './Form';
import DepositWithdrawUserTable from './UserTable';
import { searchMerchantInfo } from 'redux/actions/merchantInfoActions';
import { SearchTypeEwalletAccountEnum } from 'models/merchantInfo/merchantInfoState';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import alert from 'utils/helpers/alert';

const DepositWithdraw = () => {
  const dispatch = useDispatch();
  const [customerPayload, setCutomerPayload] = useState<any>({});
  const [isGettingInfo, setIsGettingInfo] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const {
    register,
    clearErrors,
    reset,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();
  const handleFetchUserInfo = () => {
    setIsGettingInfo(true);
    dispatch(
      searchMerchantInfo(
        { filter: { searchValue: phone, searchType: SearchTypeEwalletAccountEnum.PHONE } },
        (state, data) => {
          setIsGettingInfo(false);
          if (state) {
            setCutomerPayload(data);
          } else {
            alert('error', 'Thất bại');
          }
        }
      )
    );
  };

  useEffect(() => {
    if (phone !== '') {
      handleFetchUserInfo();
    } else {
      setIsGettingInfo(false);
      setCutomerPayload({});
      reset();
    }
  }, [phone]);

  const handleSearchUser = debounce((e: any) => {
    const { value } = e.target;
    setPhone(value);
  }, 500);

  return (
    <div className='deposit-withdraw-container'>
      <h4 className='header-title'>Cộng trừ số dư ví khách hàng</h4>
      <div className='main-section'>
        <DepositWithdrawForm
          customerPayload={customerPayload}
          isGettingInfo={isGettingInfo}
          handleSearchUser={handleSearchUser}
          register={register}
          clearErrors={clearErrors}
          errors={errors}
          control={control}
          handleSubmit={handleSubmit}
          handleFetchUserInfo={handleFetchUserInfo}
        />
        {Object.keys(customerPayload).length > 0 && (
          <DepositWithdrawUserTable customerPayload={customerPayload} />
        )}
      </div>
    </div>
  );
};

export default DepositWithdraw;
