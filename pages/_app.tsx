import listMenuSidebar from 'constants/SidebarMenuList';
import i18next from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-tabs/style/react-tabs.css';
import 'react-day-picker/lib/style.css';
import 'jsoneditor-react/es/editor.min.css';

import { I18nextProvider } from 'react-i18next';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import checkPermissionPath from 'utils/helpers/checkPermissionPath';
import { common_en, common_vi } from '../locales';
import '../public/assets/scss/main.scss';
import { persistor, store, wrapper } from '../store';
import _ from 'lodash';
import { setCookie } from 'utils/helpers';
import { pageNHNN } from '../src/constants/pageNHNN'

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  fallbackLng: 'vi',
  lng: 'vi',
  resources: {
    en: {
      common: common_en, // 'common' is our custom namespace
    },
    vi: {
      common: common_vi,
    },
  },
});

declare global {
  interface Window {
    MyNamespace: any;
  }
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts: any = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const parseMenu = {
  'cong-thanh-toan': 'ctt',
  'vi-dien-tu': 'wallet',
  'cham-soc-khach-hang': 'cstool',
  'ngan-hang-nha-nuoc': 'bank',
};

interface scopeUserProps {
  scope: string[];
  profile?: any;
}
function App(props: any) {
  const { Component, pageProps } = props;

  const router = useRouter();
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const listScope = accountInfo?.scope !== undefined ? accountInfo?.scope : [];
  let availableSidebarItems: any = [];

  listMenuSidebar.forEach((element) => {
    element?.scope?.forEach((item) => {
      const count = accountInfo.scope.length > 0 && accountInfo.scope.findIndex((p) => p === item);
      if (count != -1) {
        element?.children.forEach((ele) => {
          const i = ele?.scope?.findIndex((a) => a === item);
          if (i !== -1) {
            element?.children.map((count) => {
              availableSidebarItems.push(count?.path);
            });
          }
        });
      }
    });
  });
  const dataPath = _.unionBy(availableSidebarItems, (item) => item);

  const [hasLogin, setHasLogin] = useState<Object>({
    isCheck: false,
    isLogin: null,
  });

  useEffect(() => {
    localStorage.setItem('backUrl', props.backUrl?.backUrl);
    window.addEventListener('loading', () => {
      if (!getCookie('checkAccessToken')) {
        localStorage.clear();
        setCookie('accessToken', '', -1);
        router.push('/login');
      }
    });
    // if (!getCookie('checkAccessToken')) {
    //   localStorage.clear();
    //   setCookie('accessToken', '', -1);
    //   router.push('/login')
    // }
  }, []);

  useEffect(() => {
    const arr = ['/login', '/e-contact/[token]', '404'];
    const findPath = arr.find((elm) => elm === router.pathname);
    if (findPath) {
      setHasLogin({ isCheck: true, isLogin: !findPath });
    } else {
      const checkPathPermission = checkPermissionPath(listScope, router.pathname);
      if (!checkPathPermission && accountInfo?.scope !== undefined) {
        router.push(dataPath[0] as any);
      } else {
        setHasLogin({ isCheck: true, isLogin: !findPath });
      }
    }
  }, [router.pathname]);

  useEffect(() => {
    const checkCookie = getCookie('accessToken');
    const checkLocalStore = localStorage.getItem('accessToken');
    if (!checkCookie || !checkLocalStore || !getCookie('checkAccessToken')) {
      router.replace('/login');
    } else {
      if (router.pathname === '/login' || router.pathname === '/') {
        router.push(dataPath[0] as any);
      }
      if (accountInfo.profile.username !== "nhnngiamsat" && (pageNHNN.findIndex((item) => item === router.pathname) !== -1)) {
        router.push('/404');
      }
    }
  }, [router.pathname]);

  // useEffect(() => {
  //   window.addEventListener('beforeunload', function (e) {
  //     e.preventDefault();
  //     e.returnValue = '';
  //     localStorage.clear();
  //     setCookie('accessToken', '', -1);
  //   });
  //   return () => {
  //     window.removeEventListener('beforeunload', (e) => {});
  //   };
  // }, []);

  return (
    <I18nextProvider i18n={i18next}>
      {/* <ApolloProvider client={client}> */}
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <div className='root-next'>
            <Head>
              <title>BO PayME</title>
              <link href='https://cdn.quilljs.com/1.0.0/quill.snow.css' rel='stylesheet'></link>
            </Head>
            <Component {...pageProps} />
          </div>
        </PersistGate>
      </Provider>
      {/* </ApolloProvider> */}
    </I18nextProvider>
  );
}
App.getInitialProps = async ({ ctx }: any) => {
  const { req, res } = ctx;

  if (res) {
    // server
    const Cookies = require('cookies');
    const cookies = new Cookies(req, res);
    if (req.url.indexOf('/login') === -1 && req.url.indexOf('/404') === -1) {
      if (req.url.indexOf('/assets/css/style.css.map') === -1) {
        cookies.set('previoussUrl', req.url, { path: `/`, HttpOnly: false });
      }
      const accessToken = cookies.get('accessToken');
      if (!accessToken) {
        res.writeHead(307, { Location: '/login' });
        res.end();
      }
    }
    const backUrl = cookies.get('previoussUrl');
    if (backUrl) {
      return { backUrl: { backUrl } };
    }
  } else {
    //client
  }

  return { props: {} };
};

export default wrapper.withRedux(App);
