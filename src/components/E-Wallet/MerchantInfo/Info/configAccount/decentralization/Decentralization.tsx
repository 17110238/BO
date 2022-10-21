import { t } from 'i18next';
import { EwalletAccount, SearchTypeEwalletAccountEnum } from 'models/merchantInfo/merchantInfoState';
import React from 'react';
import { Button } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { searchMerchantInfo, updateInfoAccountEWallet } from 'redux/actions/merchantInfoActions';
import alert from 'utils/helpers/alert';

const root = [
  'account.root',
  'account.customer.create',
  'account.customer.search',
  'account.order.create',
  'account.order.approve',
  'account.order.search',
];

interface Props {
  onHide: () => void
}

function Decentralization({ onHide }: Props) {
  const dispatch = useDispatch();
  const merchants = useSelector<any, EwalletAccount[]>((state) => state?.merchantInfoReducer.merchantAccountInfo);
  const accountId = useSelector<any, string>((state) => state?.merchantInfoReducer.accountId);
  const isLoading = useSelector<any, boolean>((state) => state?.merchantInfoReducer.loadingUpdate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<any>();

  const onSubmit: SubmitHandler<any> = ({ scope }, e) => {
    const payload = {
      id: parseInt(accountId),
      scope
    };

    dispatch(
      updateInfoAccountEWallet(payload, (status, res) => {
        if (status) {
          updateMerchantInfo();
          alert('success', res?.message, t);
          onHide();
        } else {
          alert('error', res?.message, t);
          onHide();
        }
      })
    );
  };

  const updateMerchantInfo = () => {
    const payload = {
      filter: {
        searchType: SearchTypeEwalletAccountEnum.ACCOUNT_ID,
        searchValue: accountId
      }
    }

    dispatch(
      searchMerchantInfo(payload, () => {})
    );
  }

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    e.key === 'Enter' && e.preventDefault();
  };

  const isBusinessAccount = () => {
    return merchants[0]?.scope?.includes('account.bussiness');
  }

  const isScratchIsec = () => {
    return merchants[0]?.scope?.includes('account.scratch.isec');
  }

  const isRoot = () => {
    return root.every(val => merchants[0]?.scope?.includes(val));
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => checkKeyDown(e)}
      className='merchant-info-config-decentralization'
    >
      <div className='options'>
        <div className='option'>
          <input type='checkbox' id='BUSSINESS_ACCOUNT' value='BUSSINESS_ACCOUNT' {...register('scope')} defaultChecked={isBusinessAccount()} />
          <label htmlFor='BUSSINESS_ACCOUNT'>Cho mua isec theo bulk</label>
        </div>
        <div className='option'>
          <input type='checkbox' id='SCRATCH_ISEC' value='SCRATCH_ISEC' {...register('scope')} defaultChecked={isScratchIsec()} />
          <label htmlFor='SCRATCH_ISEC'>API Gạch iSEC</label>
        </div>
        <div className='option'>
          <input type='checkbox' id='ROOT' value='ROOT' {...register('scope')} defaultChecked={isRoot()} />
          <label htmlFor='ROOT'>Sử dụng web phân phối</label>
        </div>
      </div>

      <div className='save-btn-container'>
        <Button type='submit' className='btn-submit btn' variant='primary'>
          {t('Lưu thông tin')}
        </Button>
      </div>
    </form>
  );
}

export default Decentralization;
