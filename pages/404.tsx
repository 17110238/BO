import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import Lottie from 'react-lottie-player';
import json from '../public/assets/json/404.json';
import listMenuSidebar from 'constants/SidebarMenuList';

export default function CommingSoonPage() {
  const { t } = useTranslation('common');
  return (
    <div className='main-content'>
      <div className='not-found-page container-fluid '>
        <div className='logo-payme mx-auto mt-5 pt-2'>
          <img src='/assets/img/icon-logo-payme.svg' alt='' />
        </div>

        <div className='not-found-box mx-auto text-center py-5 my-4'>
          <div className='not-found-content'>
            <Lottie loop animationData={json} play style={{ width: 900, height: 400 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
