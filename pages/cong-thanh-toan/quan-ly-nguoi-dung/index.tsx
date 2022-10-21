import React from 'react';
import MainLayout from 'layouts/MainLayout';
import UserContainer from 'components/User/UserContainer';

function index() {
  return (
    <MainLayout >
      <UserContainer />
    </MainLayout>
  );
}

export default index;
