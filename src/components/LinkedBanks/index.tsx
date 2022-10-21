import { getLinkedBanksInput, LinkedBanksType } from 'models/linkedBanks';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getLinkedBanksAction } from 'redux/actions/linkedBanksActions';
import LinkedBanksBoxSearch from './BoxSearch';
import ConfirmUnlinkModal from './ConfirmUnlinkModal';
import LinkedBanksDatatable from './Datable';
import LinkedBanksHeader from './Header';

interface Props {}

const LinkedBanks: FC = () => {
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [filter, setFilter] = useState({});
  const [linkedBanksData, setLinkedBanksData] = useState<LinkedBanksType[]>([]);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [unlinkItem, setUnlinkItem] = useState<LinkedBanksType>();

  const handleGetLinkedBanks = (start?: number, limit?: number, sort?: {}) => {
    const payload: getLinkedBanksInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
      sort: { createdAt: 1 },
    };
    function handleGetLinkedBanks(payload: getLinkedBanksInput) {
      setLoading(true);
      dispatch(
        getLinkedBanksAction(payload, (status, res) => {
          setLoading(false);
          setLinkedBanksData(res);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleGetLinkedBanks,
      submitForm,
      setSubmitForm,
    };
  };

  const handleFilter = (data: any) => {
    if (data) {
      const filterPayload = {
        searchValue: data.search,
        searchType: data.searchType,
        state: data.state,
      };
      if (data.search === '') delete filterPayload.searchValue;
      if (data.state === '') delete filterPayload.state;
      setFilter(filterPayload);
      setSubmitForm(true);
    }
  };

  const handleToggleFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const onOpenUnlinkModal = (item: LinkedBanksType) => {
    setShowModal(true);
    setUnlinkItem(item);
  };

  return (
    <div className='linkedbank-container'>
      <LinkedBanksHeader isShowFilter={isShowFilter} isClickFilter={handleToggleFilter} />
      {isShowFilter && <LinkedBanksBoxSearch handleFilter={handleFilter} isLoading={loading} />}
      <ConfirmUnlinkModal
        unlinkItem={unlinkItem}
        show={showModal}
        setSubmitForm={() => setSubmitForm(true)}
        hideModal={() => setShowModal(false)}
      />
      <LinkedBanksDatatable
        loading={loading}
        onOpenModal={onOpenUnlinkModal}
        data={linkedBanksData}
        handleGetLinkedBanks={handleGetLinkedBanks}
      />
    </div>
  );
};

export default LinkedBanks;
