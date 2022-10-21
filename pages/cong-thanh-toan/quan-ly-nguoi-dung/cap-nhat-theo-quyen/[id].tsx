import React from 'react';
import MainLayout from 'layouts/MainLayout';
import UserContainer from 'components/User/UserContainer';
import Link from 'next/link';
import CreateUser from 'components/User/CreateUser';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CreateUserAccountScope from 'components/User/CreateUserScope';

function index() {
  return (
    <MainLayout >
      <CreateUserAccountScope />
    </MainLayout>
  );
}

export default index;
