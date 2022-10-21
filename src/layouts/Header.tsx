import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalPendingMerchant, showModalChangePassword } from 'redux/actions';
//import { showModalChangePassword } from 'redux/actions';
import dynamic from 'next/dynamic';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import swal from 'sweetalert2';
import { setCookie } from 'utils/helpers';
import checkPermisson from 'utils/helpers/checkPermission';
//import ModalChangePassword from 'components/MyAccount/ModalChangePassword';
const ModalChangePassword = dynamic(import('components/MyAccount/ModalChangePassword'));
//------------interface--------------
interface HeaderProps {
  onShowSidebar: () => void;
  onMiniSidebar: () => void;
  handleShowSidebar?: () => void;
  props?: any;
}

interface profileUser {
  accountId: BigInt;
  username: string;
  fullname: string;
  phone: string;
  gender: string;
  birthday: Date;
  email: string;
  isActive: Boolean;
  lastedLoginAt: Date;
  lastedLogoutAt: Date;
  avatar: string;
}

export interface scopeUserProps {
  scope: string[];
  link: string;
  refcode: string;
}

const Header: React.FC<HeaderProps> = ({ props, onShowSidebar, onMiniSidebar, handleShowSidebar }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('common');
  const [delay, setDelay] = useState(30000); // time gọi lại getTotalPendingMerchant
  const lang = localStorage.getItem('NEXT_LOCALE');
  const headerRef = useRef<any>();
  const profileAuth = useSelector<any, profileUser>(
    (state) => state.authReducers?.accountInfo.profile
  );
  const totalPendingMerchant = useSelector<any, any>(
    (state) => state?.merchantRD?.totalPendingMerchant
  );
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const checkPermissionPendingList = checkPermisson(accountInfo?.scope, ['bo.pending.list']);
  const [copied, setCopied] = useState<boolean>(true);

  const handleLogout = () => {
    localStorage.clear();
    setCookie('accessToken', '', -1);
    setCookie('previoussUrl', '', -1);
    router.push('/login');
  };

  const handleCustomMenu = () => {
    router.push('/menu');
  };

  const handleDetail = () => {
    router.push('/thong-tin-tai-khoan');
  };

  const handleChangeLanguage = (lang: string) => {
    // const lang1 = localStorage.getItem("NEXT_LOCALE");
    i18n.changeLanguage(lang || 'vi');
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', lang);
    }
  };

  useEffect(() => {
    const sidebar = document.querySelector('ul.nav-link-top');
    const lang: string = localStorage.getItem('NEXT_LOCALE') || 'vi';
    handleChangeLanguage(lang);
    if (!sidebar) {
      return;
    }

    const items = sidebar.getElementsByTagName('a');
    for (let i = 0; i < items.length; ++i) {
      if (items[i].pathname !== '/' && router.pathname.includes(items[i].pathname)) {
        items[i].classList.add('active');
        return;
      } else if (router.pathname === '/') {
        items[0].classList.add('active');
        return;
      }
    }
  }, []);

  // const handleGetPendingMerchantTotal = () => {
  //   const payload = {
  //     filter: {
  //       state: 'PENDING',
  //     },
  //   };

  //   dispatch(getTotalPendingMerchant(payload));
  // };

  // -------------------------- GET TOTAL PENDING MERCHANT EVERY 30s ---------------------

  // useEffect(() => {
  //   if (!localStorage.getItem('totalPendingCount')) {
  //     localStorage.setItem('totalPendingCount', '30');
  //     checkPermissionPendingList && handleGetPendingMerchantTotal();
  //   }

  //   if (localStorage.getItem('totalPendingCount') === '0') {
  //     checkPermissionPendingList && handleGetPendingMerchantTotal();
  //   }
  // }, []);

  // useInterval(() => {
  //   if (localStorage.getItem('totalPendingCount')) {
  //     let totalPendingCount = Number(localStorage.getItem('totalPendingCount'));
  //     if (totalPendingCount > 0) {
  //       totalPendingCount = totalPendingCount - 1;
  //       localStorage.setItem('totalPendingCount', String(totalPendingCount))
  //     }
  //     if (totalPendingCount === 0) {
  //       checkPermissionPendingList && handleGetPendingMerchantTotal();
  //       localStorage.setItem('totalPendingCount', '30')
  //     }
  //   }
  // }, 1000);

  // ---------------------------------------------------------------------------------------

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <>
      <header className='header-top'>
        <nav className='navbar navbar-light'>
          <div className='navbar-left'>
            <div
              onClick={() => {
                handleShowSidebar && handleShowSidebar();
                onShowSidebar();
              }}
              ref={headerRef}
              className='menu-mini'
            >
              <img src='/assets/img/header/menu.png' style={{ width: '20px', height: '20px' }} />
            </div>
            {/* <Link href='/'> */}
            {
              <div className='navbar-img'>
                <img src='/assets/img/settingProfiles/logo-payME.png' />
              </div>
            }
            {/* </Link> */}

            <div className='info-merchant'>
              <div className='name-merchant'>{profileAuth?.fullname}</div>
              <div className='id-merchant'></div>
            </div>
          </div>

          <div className='navbar-right'>
            <ul className='navbar-right__menu'>
              <li className='nav-link'>
                <ul className='nav-link-top'>
                  {/* {checkPermission(accountInfo?.data?.scope, 'dashboard') && (
                  <li>
                    <Link href='/'>
                      <a>{t('Dashboard')}</a>
                    </Link>
                  </li>
                )} */}
                  {/* <li>
                  <Link href='/account/profiles'>
                    <a>{t('Account')}</a>
                  </Link>
                </li>
                {checkPermission(accountInfo?.data?.scope, 'balance') && (
                  <li>
                    <Link href='/balances'>
                      <a>{t('Balances')}</a>
                    </Link>
                  </li>
                )} */}
                </ul>
              </li>
              <li className='nav-flag-author'>
                {/* <Dropdown className='select-lang'>
                  <Dropdown.Toggle id='dropdown-menu-align-end'>
                    <img src={t('flag')} alt='' />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleChangeLanguage('vi')}>
                      <img src='/assets/img/flag.png' alt='' /> Tiếng việt
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => handleChangeLanguage('en')}>
                      <img src='/assets/img/eng.png' alt='' /> English
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}

                {checkPermissionPendingList && (
                  <Dropdown className='notification'>
                    <Dropdown.Toggle id='dropdown-menu-align-end'>
                      <i className='fas fa-solid fa-bell'></i>
                      {/* <div className={`badge ${totalPendingMerchant ? 'show' : ''}`}>
                        {totalPendingMerchant > 99 ? '99+' : totalPendingMerchant}
                      </div> */}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className='pending-list'
                        onClick={() => router.push('/cong-thanh-toan/danh-sach-cho-duyet')}>
                        <i className='fas fa-list-ol'></i>
                        {t('Danh sách chờ duyệt')}
                        {/* {
                          totalPendingMerchant > 0 &&
                            totalPendingMerchant <= 99 ? (
                            <div className='pending-list__badge'>{totalPendingMerchant}</div>
                          ) : totalPendingMerchant > 99 ? (
                            <div className='pending-list__badge'>99+</div>
                          ) : (
                            <></>
                          )} */}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                <Dropdown className='author-avatar'>
                  <Dropdown.Toggle id='dropdown-menu-align-end'>
                    <i className='fas fa-user-circle'></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {/* {checkPermission(accountInfo?.data?.scope, ['mc.wallet.getInformation', 'mc.wallet.history', 'mc.deposit.getDepositInfo', 'mc.withdraw.create']) && (
                    <Link href='/balances' passHref>
                      <Dropdown.Item className='cls-wap-650'>
                        <i className='fas fa-dollar-sign'></i>
                        {t('Balances')}
                      </Dropdown.Item>
                    </Link>
                  )} */}
                    {/* <Link href='/account/profiles' passHref>
                    <Dropdown.Item>
                      <i className='fas fa-user'></i> {t('Account Info')}
                    </Dropdown.Item>
                  </Link> */}

                    <Dropdown.Item onClick={handleDetail}>
                      <i className='fas fa-id-card'></i> {t('Thông tin tài khoản')}
                    </Dropdown.Item>
                    {accountInfo?.refcode ? (
                      <Dropdown.Item>
                        <div
                          data-tip
                          data-for={`div-link-ma-gioi-thieu`}
                          className='d-flex align-items-center'>
                          <CopyToClipboard
                            onCopy={() => {
                              setCopied(true);
                              swal.fire({
                                toast: true,
                                showConfirmButton: false,
                                icon: 'success',
                                timer: 1200,
                                title: t('Copied'),
                                position: 'top-end',
                              });
                            }}
                            text={`${process.env.NEXT_PUBLIC_API_URL_IDMC}/signup/${accountInfo?.refcode}`}>
                            <div className='d-flex'>
                              <i className='fa fa-link'></i>
                              <p
                                className='m-0'
                                style={{
                                  fontSize: '15px',
                                  fontWeight: '600',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: '150px',
                                }}>
                                {`${process.env.NEXT_PUBLIC_API_URL_IDMC}/signup/${accountInfo?.refcode}`}
                              </p>
                              <div className='refcode-icon-coppy '></div>
                            </div>
                          </CopyToClipboard>
                          <ReactTooltip place='bottom' effect='solid' id={`div-link-ma-gioi-thieu`}>
                            {t('Link mã giới thiệu')}
                          </ReactTooltip>
                        </div>
                      </Dropdown.Item>
                    ) : (
                      <div></div>
                    )}
                    <Dropdown.Item onClick={() => dispatch(showModalChangePassword())}>
                      <i className='fas fa-key'></i> {t('Change password')}
                    </Dropdown.Item>
                    {/* <Dropdown.Item onClick={handleDetail}>
                      <i className='fas fa-sign-out-alt'></i> {t('Thông tin tài khoản')}
                    </Dropdown.Item> */}
                    {/* <Dropdown.Item onClick={handleCustomMenu}>
                      <i className='fas fa-bars'></i>
                      {t('Custom dashboard')}
                    </Dropdown.Item> */}
                    <Dropdown.Item onClick={handleLogout}>
                      <i className='fas fa-sign-out-alt'></i> {t('Sign Out')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </nav>
        <ModalChangePassword />
      </header>
      <ModalChangePassword />
    </>
  );
};

export default Header;
