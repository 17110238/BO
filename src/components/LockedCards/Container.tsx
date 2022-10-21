import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitHandler } from 'react-hook-form';
import HeaderLockedCards from './Header';
import BoxSearchLockedCards from './BoxSearch';
import DataTableLockedCards from './DataTable';
import { useRouter } from 'next/router';
import { LockedCard, GetLockedCardsInput } from 'models/lockedCards/lockedCardsState';
import { getLockedCards } from 'redux/actions/lockedCardActions';
import ModalLockCard from './lockCard/ModalLockCard';

export interface SearchParams {
  serialNumber?: string;
}

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [filter, setFilter] = useState({});
  const router = useRouter();
  const [lockedCards, setLockedCards] = useState<LockedCard[]>([]);
  const [isShowModalLockCard, setIsShowModalLockCard] = useState<boolean>(false);

  const getPayloadFromURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const payload: any = {};
    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    return payload;
  };

  useEffect(() => {
    const payload = getPayloadFromURL();
    if (Object.keys(payload).length !== 0) {
      handleSubmitSearch && handleSubmitSearch(payload);
    }
  }, []);

  const updateURLParams = (filter: any) => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams();
    for (const key in filter) {
      if (filter[key]) {
        searchParams.set(key, filter[key]);
      } else {
        searchParams.delete(key);
      }
    }
    if (searchParams.toString())
      router.replace(path + '?' + searchParams.toString(), undefined, { shallow: true });
    else router.replace(path, undefined, { shallow: true });
  };

  const handleSubmitSearch: SubmitHandler<SearchParams> = (data) => {
    const payload: any = { ...data };

    Object.keys(payload).forEach((key) => !payload[key] && delete payload[key]);

    updateURLParams(payload);
    setFilter({ ...payload });
    setSubmitForm(true);
  };

  const handleGetMismatchOrderTransList = (start?: number, limit?: number, sort?: {}) => {
    const payload: GetLockedCardsInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleGetMismatchOrderTransList(payload: GetLockedCardsInput) {
      dispatch(
        getLockedCards(payload, (status, res) => {
          setSubmitForm(false);
          setLockedCards(res);
        })
      );
    }

    return {
      payload,
      getList: handleGetMismatchOrderTransList,
      submitForm,
    };
  };

  return (
    <div className='locked-cards-container'>
      <HeaderLockedCards showFilter={showFilter} toggleFilter={toggleFilter} t={t} />
      <BoxSearchLockedCards
        showFilter={showFilter}
        submitForm={submitForm}
        handleSubmitSearch={handleSubmitSearch}
        setSubmitForm={setSubmitForm}
        getPayloadFromURL={getPayloadFromURL}
        onLockCard={() => setIsShowModalLockCard(true)}
      />
      <DataTableLockedCards
        t={t}
        data={lockedCards}
        getDataList={handleGetMismatchOrderTransList}
        setSubmitForm={setSubmitForm}
      />
      <ModalLockCard
        setSubmitForm={setSubmitForm}
        handleClose={() => setIsShowModalLockCard(false)}
        show={isShowModalLockCard}
        t={t}
      />
    </div>
  );
};

export default Container;
