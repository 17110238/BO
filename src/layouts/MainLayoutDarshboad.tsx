import i18next from 'i18next';
import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

function useWindowSize() {
  const [size, setSize] = useState<number[]>([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

interface MainLayoutProps {
  isClassName?: boolean;
  children?: ReactNode;
  props?: ReactNode;
}

const MainLayoutDarshboad = ({ children, isClassName, ...props }: MainLayoutProps) => {
  const [width, height] = useWindowSize();
  const [isMiniSidebar, setIsMiniSidebar] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {
    if (width <= 1024) {
      setIsMiniSidebar(isHover || (!isHover && width <= 1024));
    }
  }, []);

  const onShowSidebar = () => {
    if (width <= 1024) {
      setIsHover(true);
      setIsMiniSidebar(false);
    }
  };
  const onMiniSidebar = () => {
    if (width <= 1024) {
      setIsHover(false);
      setIsMiniSidebar(true);
    }
  };

  return (
    <div className='layout-light side-menu overlayScroll tools-container'>
      <Header onShowSidebar={onShowSidebar} onMiniSidebar={onMiniSidebar} />
      <div className='main-content'>
        <Sidebar
          classMobile={`${width <= 1024 && isMiniSidebar && 'mini'}`}
          onShowSidebar={onShowSidebar}
          onMiniSidebar={onMiniSidebar}
        />
        <div className={`contents ${width <= 1024 && 'mini'}`}>
          <div className={`container-fluid ${isClassName ? 'transaction-wrapper' : ''}`}>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayoutDarshboad;
