import React from 'react';
import MainLayout from 'layouts/MainLayout';
import LockedCardsContainer from 'components/LockedCards/Container';

function index() {
  return (
    <MainLayout>
      <LockedCardsContainer />
    </MainLayout>
  );
}

export default index;
