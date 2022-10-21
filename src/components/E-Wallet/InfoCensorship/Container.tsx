import useElementSize from 'hook/useElementSize';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BoxSearch, { SearchParams } from './BoxSearch';
import Header from './Header';
import AvatarImage from './DataTable/AvatarImage';
import AliasName from './DataTable/AliasName';
import { getListAvatarImage } from 'redux/actions';
import { EwalletAccount, SearchEwalletAccountInput } from 'models';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Container: React.FC = () => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(true);
  const [avatarImageList, setListAliasName] = useState<EwalletAccount[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({
    createdAt: {
      from: dayjs().subtract(30, 'day').startOf('day').utc().format(),
      to: dayjs().endOf('date').utc().format(),
    },
  });
  const [recall, setRecall] = useState<boolean>(false);
  const [squareRef, { width, height }] = useElementSize();
  const AVATAR_TABLE = 'avatarImage';
  const ALIAS_TABLE = 'aliasName';

  const defaultTable = ALIAS_TABLE;
  const [showDataTable, setShowDataTable] = useState<string>(defaultTable);
  const [start, setStart] = useState<number>(0);
  const [limit, setLimit] = useState<number>(21);

  const handleSubmitSearch = (data: SearchParams) => {
    if (!data.searchValue) {
      delete data.searchValue;
      delete data.searchType;
    }
    if (!data.search) {
      delete data.search;
    }
    if (showDataTable === AVATAR_TABLE) {
      setFilter({ ...data });
    }

    if (showDataTable === ALIAS_TABLE) {
      setFilter({ ...data, searchType: 'ALIASNAME' });
      setSubmitForm(true);
    }
  };

  useEffect(() => {
    if (showDataTable === AVATAR_TABLE || showDataTable === AVATAR_TABLE) {
      const newFilter: any = { ...filter, createdAt: filter.createdAt };
      newFilter['updatedAvatarAt'] = newFilter['createdAt'];
      delete newFilter['createdAt'];

      const payload: SearchEwalletAccountInput = {
        filter: {
          ...newFilter,
        },
        paging: {
          start,
          limit,
        },
      };
      setLoading(true);
      dispatch(
        getListAvatarImage(payload, (status, res) => {
          setSubmitForm(false);
          if (res) {
            setListAliasName(res);
          } else {
            setListAliasName([]);
          }
          setLoading(false);
        })
      );
    }
  }, [filter, start, recall, showDataTable]);

  const handleShowDataTable = (table: string) => {
    setSubmitForm(true);
    setShowDataTable(table);
  };

  const handleNextClick = () => {
    setStart(start + 21);
  };

  const handlePreviousClick = () => {
    setStart(start - 21);
  };

  const handleGetListAliasName = (start?: number, limit?: number, sort?: {}) => {
    const newFilter: any = { ...filter, updatedAvatarAt: filter.createdAt };
    newFilter['createdAt'] = newFilter['updatedAvatarAt'];
    delete newFilter['updatedAvatarAt'];
    const payload: SearchEwalletAccountInput = {
      filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };
    function handleGetListAliasName(payload: SearchEwalletAccountInput) {
      setLoading(true);
      dispatch(
        getListAvatarImage(payload, (status, res) => {
          setSubmitForm(false);
          if (res) {
            setListAliasName(res);
          } else {
            setListAliasName([]);
          }
          setLoading(false);
        })
      );
    }
    return {
      payload,
      getList: handleGetListAliasName,
      submitForm,
    };
  };

  const handleRecallAvatar = () => {
    setRecall(!recall);
  };

  return (
    <div className='box-content information-censorship-container'>
      <Header showFilter={showFilter} toggleFilter={toggleFilter} t={t} />

      {showFilter && (
        <BoxSearch
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          filter={filter}
          handleShowDataTable={handleShowDataTable}
          isLoading={isLoading}
        />
      )}
      {showDataTable === AVATAR_TABLE ? (
        <AvatarImage
          t={t}
          data={avatarImageList}
          setSubmitForm={handleRecallAvatar}
          heightBoxSearch={height + 1}
          handleNextClick={handleNextClick}
          handlePreviousClick={handlePreviousClick}
          start={start}
          limit={limit}
          isLoading={isLoading}
        />
      ) : showDataTable === ALIAS_TABLE ? (
        <AliasName
          t={t}
          data={avatarImageList}
          getDataList={handleGetListAliasName}
          setSubmitForm={setSubmitForm}
          heightBoxSearch={height + 1}
          isLoading={isLoading}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Container;
