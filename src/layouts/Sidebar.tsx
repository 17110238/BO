import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import listMenuSidebar from "../constants/ListMenuSidebar.js";
// import sidebarMenuList from '../constants/SidebarMenuList';
import ListWalletSidebar from '../constants/sidebarWalletList';
import ListCsToolSidebar from '../constants/sidebarCsToolList';
import listMenuSidebar from '../constants/SidebarMenuList';
import ListBankSidebar from 'constants/sidebarBankList';
import { useSelector } from 'react-redux';
import checkPermisson from 'utils/helpers/checkPermission';
import ReactSelect, { SingleValue } from 'react-select';
import customStyles from 'utils/helpers/customStylesForReactSelect';
import dynamic from 'next/dynamic';
import ToggleIcon from './ToggleIcon';
import checkPermission from 'utils/helpers/checkPermission';
import permissionRoleWallet from 'constants/permissionWallet';
import permissionRoleCstool from 'constants/permissonCsTool';
import permissionRoleCttl from 'constants/permissionCtt';
import { boolean } from 'yup';
import FileSaver from 'file-saver';
//------------interface--------------
const accountBankUsername = 'nhnngiamsat';
interface MenuSidebarProps {
  classMobile: string | null;
  onShowSidebar: () => void;
  onMiniSidebar: () => void;
}
function checkPermissionPath() {
  let scope: any = [];
  for (let index in permissionRoleWallet.ScopePath) {
    scope.push({ index, path: permissionRoleWallet.ScopePath[index] });
  }
  return scope;
}
function checkPermissionPathCtt() {
  let scope: any = [];
  for (let index in permissionRoleCttl.ScopePath) {
    scope.push({ index, path: permissionRoleCttl.ScopePath[index] });
  }
  return scope;
}
function checkPermissionPathCstoll() {
  let scope: any = [];
  for (let index in permissionRoleCstool.ScopePath) {
    scope.push({ index, path: permissionRoleCstool.ScopePath[index] });
  }
  return scope;
}
interface scopeUserProps {
  scope: string[];
  profile: any;
}

const parseMenu = {
  'cong-thanh-toan': 'ctt',
  'vi-dien-tu': 'wallet',
  'cham-soc-khach-hang': 'cstool',
  'ngan-hang-nha-nuoc': 'bank',
};

function Menu({ classMobile = null, onShowSidebar, onMiniSidebar }: MenuSidebarProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  let xDown: any = null;
  let yDown: any = null;
  const accountInfo = useSelector<any, scopeUserProps>((state) => state?.authReducers?.accountInfo);
  const checkPermissionBankAccount = accountInfo.profile.username === accountBankUsername;

  const handleListSidebar = (path: any) => {
    if (path && checkPermissionBankAccount) {
      return 'ngan-hang-nha-nuoc';
    } else if (path && !checkPermissionBankAccount) {
      return path;
    }
  };

  const [sidebarId, setSidebarId] = useState<string>(
    parseMenu[handleListSidebar(router.pathname.split('/')[1]) as keyof {}]
  );

  const [collapseMenu, setCollapseMenu] = useState<boolean>(false);

  function checkOption(data: any, checkPermissionPath: any) {
    let listRoleDashboard = checkPermissionPath();
    const listScope = data || [];
    return listRoleDashboard.find((item: any) => {
      if (checkPermission(listScope, [item.index])) {
        return item;
      }
    });
  }

  let checkCtt = checkOption(accountInfo?.scope, checkPermissionPathCtt);
  let checkWallet = checkOption(accountInfo?.scope, checkPermissionPath);
  let checkCstoll = checkOption(accountInfo?.scope, checkPermissionPathCstoll);

  const isActivePath = (subNav: any) => {
    const currentPath = window.location.pathname;
    return (
      subNav.path === currentPath ||
      subNav.urlActive?.find((path: string) => {
        if (path.includes('[')) {
          const checkedIndex = path.indexOf('[');
          const checkedPath = path.slice(0, checkedIndex - 1);
          return currentPath.includes(checkedPath);
        }

        return path === currentPath;
      })
    );
  };

  const convertMenuList = (menuList: any[]) => {
    return menuList.map((item: any) => {
      if (item.title) {
        let show = false;
        for (let i = 0; i < item?.children?.length; i++) {
          if (isActivePath(item.children[i])) {
            show = true;
            break;
          }
        }
        return {
          ...item,
          showChildren: show,
        };
      } else {
        return {
          ...item,
          showChildren: true,
        };
      }
    });
  };

  const [sidebarMenuList, setSidebarMenuList] = useState<any[]>(convertMenuList(listMenuSidebar));
  const [sidebarWalletList, setSidebarWalletList] = useState<any[]>(
    convertMenuList(ListWalletSidebar)
  );
  const [sidebarCsToolList, setSidebarCsToolList] = useState<any[]>(
    convertMenuList(ListCsToolSidebar)
  );
  const [sidebarBankList, setSidebarBankList] = useState<any[]>(convertMenuList(ListBankSidebar));

  const collapse = (subNav: any) => {
    subNav.style.display = 'block';
  };

  const collapseScroll = (subNav: any) => {
    subNav.style.display = 'block';
    subNav.style.height = 0 + 'px';
  };

  const expand = (subNav: any) => {
    const subNavHeight = subNav.scrollHeight;
    subNav.style.height = subNavHeight + 'px';
    subNav.style.display = 'table';
  };

  const expandScroll = (subNav: any) => {
    const subNavHeight = subNav.scrollHeight;
    subNav.style.height = subNavHeight + 'px';
    subNav.style.display = 'block';
  };

  const toggle = () => {
    const subNavList = document.querySelectorAll('.sidebar .title-sidebar-setting + ul');
    subNavList.forEach((subNav) => {
      const isExpanded = subNav.classList.contains('show');
      if (isExpanded && subNav.clientHeight === 0) {
        expand(subNav);
      } else if (!isExpanded && subNav.clientHeight !== 0) {
        collapse(subNav);
      }
    });
  };

  const toggleScroll = () => {
    const subNavList = document.querySelectorAll('.sidebar .title-sidebar-setting + ul');
    subNavList.forEach((subNav) => {
      const isExpanded = subNav.classList.contains('show');
      if (isExpanded && subNav.clientHeight === 0) {
        expandScroll(subNav);
      } else if (!isExpanded && subNav.clientHeight !== 0) {
        collapseScroll(subNav);
      }
    });
  };

  useEffect(() => {
    const basePath = router.pathname.split('/')[1];
    if (basePath === 'cong-thanh-toan') {
      setSidebarId('ctt');
    }
    if (basePath === 'vi-dien-tu') {
      setSidebarId('wallet');
    }

    if (basePath === 'cham-soc-khach-hang') {
      setSidebarId('cstool');
    }
  }, []);

  useEffect(() => {
    toggle();
  }, [router.pathname]);

  useEffect(() => {
    toggleScroll();
  }, [collapseMenu]);

  const handleToggleMenu = (title: string) => {
    setCollapseMenu(!collapseMenu);
    const menuList = getCurrentSidebarList();
    const index = menuList.findIndex((item: any) => item.title === title);
    const updatedMenuList = [...menuList];
    if (index >= 0) updatedMenuList[index].showChildren = !updatedMenuList[index].showChildren;
    updatedMenuList.forEach((item: any, i: number) => {
      if (i !== index && item.title) {
        item.showChildren = false;
      }
    });
    updateSidebarList(updatedMenuList);
  };

  const getCurrentSidebarList = () => {
    switch (sidebarId) {
      case 'ctt':
        return sidebarMenuList;

      case 'wallet':
        return sidebarWalletList;

      case 'cstool':
        return sidebarCsToolList;

      case 'bank':
        return sidebarBankList;

      default:
        return sidebarMenuList;
    }
  };

  const updateSidebarList = (menuList: any) => {
    switch (sidebarId) {
      case 'ctt':
        setSidebarMenuList(menuList);
        break;

      case 'wallet':
        setSidebarWalletList(menuList);
        break;

      case 'cstool':
        setSidebarCsToolList(menuList);
        break;

      case 'bank':
        setSidebarBankList(menuList);
        break;

      default:
        break;
    }
  };

  let optionSidebar: any = [];
  if (checkCtt) {
    optionSidebar = [{ value: 'ctt', label: 'CỔNG THANH TOÁN' }];
  }
  if (checkWallet) {
    optionSidebar = [{ value: 'wallet', label: 'VÍ ĐIỆN TỬ' }];
  }
  if (checkCstoll) {
    optionSidebar = [{ value: 'cstool', label: 'CS TOOL' }];
  }
  if (checkWallet && checkCtt) {
    optionSidebar = [
      { value: 'ctt', label: 'CỔNG THANH TOÁN' },
      { value: 'wallet', label: 'VÍ ĐIỆN TỬ' },
    ];
  }
  if (checkCstoll && checkCtt) {
    optionSidebar = [
      { value: 'ctt', label: 'CỔNG THANH TOÁN' },
      { value: 'cstool', label: 'CS TOOL' },
    ];
  }
  if (checkCstoll && checkWallet) {
    optionSidebar = [
      { value: 'wallet', label: 'VÍ ĐIỆN TỬ' },
      { value: 'cstool', label: 'CS TOOL' },
    ];
  }
  if (checkCtt && checkWallet && checkCstoll) {
    optionSidebar = [
      { value: 'ctt', label: 'CỔNG THANH TOÁN' },
      { value: 'wallet', label: 'VÍ ĐIỆN TỬ' },
      { value: 'cstool', label: 'CS TOOL' },
    ];
  }

  const [isSidebar, setSidebar] = useState<any>('ctt');
  const sidebarRef = useRef<any>();
  const urlString = JSON.stringify(router.pathname);
  useEffect(() => {
    let urlPath = router.pathname.substring(1).split('/')[0];

    switch (urlPath) {
      case 'cong-thanh-toan':
        if (!checkPermissionBankAccount) {
          // localStorage.setItem('SIDEBAR', 'ctt');
          setSidebarId('ctt');
        } else {
          // localStorage.setItem('SIDEBAR', 'bank');
          setSidebarId('bank');
        }
        break;
      case 'vi-dien-tu':
        if (!checkPermissionBankAccount) {
          // localStorage.setItem('SIDEBAR', 'wallet');
          setSidebarId('wallet');
        } else {
          // localStorage.setItem('SIDEBAR', 'bank');
          setSidebarId('bank');
        }
        break;
      case 'cham-soc-khach-hang':
        // localStorage.setItem('SIDEBAR', 'cstool');
        setSidebarId('cstool');
        break;
      default:
        break;
    }
  }, [urlString]);

  useEffect(() => {
    const sidebar = document.getElementById('sidebar-nav');
    setTimeout(() => {
      let items = sidebar?.getElementsByTagName('a');
      // let items = document.querySelectorAll('#sidebar-nav a');
      if (!items) {
        return;
      }
      let url = null;
      // switch (localStorage?.getItem('SIDEBAR')) {
      switch (sidebarId) {
        case 'ctt':
          sidebarMenuList.map((item) => {
            item.children.map((iChildren: any) => {
              if (
                iChildren?.path === router.pathname ||
                iChildren?.urlActive?.find((i: string) => i === router.pathname)
              ) {
                url = iChildren?.path;
              }
            });
          });
          break;
        case 'wallet':
          ListWalletSidebar.map((item) => {
            item?.children?.map((iChildren) => {
              if (
                iChildren?.path === router.pathname ||
                iChildren?.urlActive?.find((i) => i === router.pathname)
              ) {
                url = iChildren?.path;
              }
            });
          });
        case 'cstool':
          ListCsToolSidebar.map((item) => {
            item.children.map((iChildren) => {
              if (
                iChildren?.path === router.pathname ||
                iChildren?.urlActive?.find((i) => i === router.pathname)
              ) {
                url = iChildren?.path;
              }
            });
          });
        case 'bank':
          ListBankSidebar.map((item) => {
            item.children.map((iChildren) => {
              if (
                iChildren?.path === router.pathname ||
                iChildren?.urlActive?.find((i) => i === router.pathname)
              ) {
                url = iChildren?.path;
              }
            });
          });
        default:
          sidebarMenuList.map((item) => {
            item.children.map((iChildren: any) => {
              if (
                iChildren?.path === router.pathname ||
                iChildren?.urlActive.find((i: string) => i === router.pathname)
              ) {
                url = iChildren?.path;
              }
            });
          });
          break;
      }

      if (url === null) {
        return;
      }

      for (let i = 0; i < items.length; ++i) {
        if (url === items[i].pathname) {
          items[i].classList.add('active');
          return;
        }
      }
    }, 100);
  }, [router.pathname]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, false);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);
    };
  });

  useEffect(() => {
    document.addEventListener('touchmove', handleTouchMove, false);
    return () => {
      document.removeEventListener('touchmove', handleTouchMove, false);
    };
  });
  const getTouches = (evt: any) => {
    return evt.touches || evt.originalEvent.touches;
  };

  const handleTouchStart = (e: any) => {
    const firstTouch = getTouches(e)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  const handleTouchMove = (e: any) => {
    if (!xDown || !yDown) {
      return;
    }
    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        onMiniSidebar();
      } else {
        if (xDown <= 50) {
          onShowSidebar();
        }
      }
    }
    xDown = null;
    yDown = null;
  };
  
  // render list role
  const renderMenuSidebar = (options: any) => {
    return options.map((item: any, index: any) => {
      return (
        <div key={index}>
          <div className='title-sidebar-setting'>
            {item.title && checkPermisson(accountInfo?.scope, item.scope) && (
              <div
                className='parent-label-menu'
                onClick={(e) => {
                  handleToggleMenu(item.title);
                }}>
                <span className='label-menu-group'>{t(item.title)}</span>
                <ToggleIcon show={item.showChildren} />
              </div>
            )}
          </div>
          <ul className={item.showChildren ? 'show' : ''}>
            {item?.children?.map((child: any, key: any) => {
              if (checkPermisson(accountInfo.scope, child?.scope)) {
                return (
                  <li key={key} data-title={child?.title} className={child?.className}>
                    <Link href={child!.path} data-layout='light'>
                      <a>
                        <i className={child?.icon}></i>
                        <span>{t(child!.title)}</span>
                      </a>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    });
  };

  const renderBankMenuSidebar = (options: any) => {
    return options.map((item: any, index: any) => {
      return (
        <div key={index}>
          <h5 className={item?.header ? 'header-sidebar-setting' : ''}>{item?.header}</h5>
          <div className='title-sidebar-setting'>
            {item.title && checkPermisson(accountInfo?.scope, item.scope) && (
              <div
                className='parent-label-menu'
                onClick={(e) => {
                  handleToggleMenu(item.title);
                }}>
                <span className='label-menu-group'>{t(item.title)}</span>
                <ToggleIcon show={item.showChildren} />
              </div>
            )}
          </div>
          <ul className={item.showChildren ? 'show' : ''}>
            {item?.children?.map((child: any, key: any) => {
              if (checkPermisson(accountInfo.scope, child?.scope)) {
                return (
                  <li key={key} data-title={child?.title} className={child?.className}>
                    <Link href={child!.path} data-layout='light'>
                      {!child?.isDownload ? (
                        <a>
                          <i className={child?.icon}></i>
                          <span>{t(child!.title)}</span>
                        </a>
                      ) : (
                        <a
                          onClick={() =>
                            FileSaver.saveAs(
                              '/assets/bankReportForm/Q12022_BaoCao_PayME.pdf',
                              'Q12022_BaoCao_PayME'
                            )
                          }>
                          <i className={child?.icon}></i>
                          <span>{t(child!.title)}</span>
                        </a>
                      )}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    });
  };

  const handleSwitchSidebar: (idSidebar: any) => ReactNode = (idSidebar) => {
    switch (idSidebar) {
      case 'wallet':
        return renderMenuSidebar(sidebarWalletList);
      case 'ctt':
        return renderMenuSidebar(sidebarMenuList);
      case 'cstool':
        return renderMenuSidebar(sidebarCsToolList);
      case 'bank':
        return renderBankMenuSidebar(sidebarBankList);
      default:
        break;
    }
  };

  useEffect(() => {
    // if (localStorage.getItem('SIDEBAR') != 'ctt') {
    //   setSidebar(localStorage.getItem('SIDEBAR'));
    // } else {
    //   localStorage.setItem('SIDEBAR', isSidebar);
    // }
    if (sidebarId != 'ctt') {
      setSidebarId(sidebarId);
    } else {
      setSidebarId(isSidebar);
    }
  }, [isSidebar]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onMiniSidebar();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <div className={`sidebar ${classMobile}`} id='sidebar' ref={sidebarRef} onClick={onShowSidebar}>
      <div className='sidebar__menu-feature'>
        {classMobile === 'mini' ? (
          <div className='sidebar__menu-feature-mini'>
            <i className='fa fa-list'></i>
          </div>
        ) : (
          !(!checkCtt && checkWallet && !checkCstoll) &&
          accountInfo.profile.username !== accountBankUsername && (
            <ReactSelect
              // isDisabled
              isSearchable={false}
              className='sidebar__menu-feature-select'
              theme={(theme: any) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#EFF2F7',
                  primary: '#00be00',
                },
              })}
              styles={{
                ...customStyles,
                menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
                menu: (provided) => ({ ...provided, zIndex: 2 }),
              }}
              options={optionSidebar}
              value={
                // optionSidebar.find((c: any) => c.value === localStorage.getItem('SIDEBAR')) || optionSidebar[0]
                optionSidebar.find((c: any) => c.value === sidebarId) || optionSidebar[0]
              }
              onChange={(e: SingleValue<any>) => {
                setSidebar(e.value);
                // localStorage.setItem('SIDEBAR', e.value);
                switch (e.value) {
                  case 'wallet':
                    router.push(checkWallet.path[0]);
                    break;
                  case 'ctt':
                    router.push(checkCtt.path[0]);
                    break;
                  case 'cstool':
                    router.push(checkCstoll.path[0]);
                }
              }}
            />
          )
        )}
      </div>
      <div className='sidebar__menu-group'>
        <ul className='sidebar_nav' id='sidebar-nav' ref={sidebarRef}>
          {
            // (localStorage?.getItem('SIDEBAR') && accountInfo.profile.username !== accountBankUsername)
            //   ? handleSwitchSidebar(localStorage.getItem('SIDEBAR'))
            sidebarId && accountInfo.profile.username !== accountBankUsername
              ? handleSwitchSidebar(sidebarId)
              : accountInfo.profile.username === accountBankUsername
                ? handleSwitchSidebar('bank')
                : handleSwitchSidebar('ctt')
          }
        </ul>
      </div>
    </div>
  );
}

export default Menu;
