import i18next from 'i18next';
import React, { ReactNode, useEffect, useLayoutEffect, useState, useRef } from 'react';
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
  isFixedDatatable?: boolean;
}

const MainLayout = ({
  children,
  isClassName,
  isFixedDatatable = false,
  ...props
}: MainLayoutProps) => {
  const [width, height] = useWindowSize();
  const [isDevice, setDevice] = useState(true);
  const [isMiniSidebar, setIsMiniSidebar] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isShowSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    if (width <= 1024) {
      setIsMiniSidebar(isHover || (!isHover && width <= 1024));
    }
  }, []);

  useEffect(() => {
    const widthWindow = window.innerWidth;
    if (widthWindow < 1024) {
      setDevice(false);
    }
  }, []);

  const handleShowSidebar = () => {
    setShowSidebar(() => !isShowSidebar);
  }

  const onShowSidebar = () => {
    if (width <= 1200) {
      setIsHover(!isShowSidebar);
      setIsMiniSidebar(isShowSidebar);
    }
  };
  const onMiniSidebar = () => {
    if (width <= 1200) {
      setIsHover(false);
      setIsMiniSidebar(true);
    }
  };

  return (
    <div className='layout-light side-menu overlayScroll tools-container'>
      <Header 
        handleShowSidebar={handleShowSidebar} 
        onShowSidebar={onShowSidebar}
        onMiniSidebar={onMiniSidebar} 
      />
      <div className='main-content'>
        <Sidebar
          classMobile={`${width <= 1200 && isMiniSidebar && 'mini'}`}
          onShowSidebar={onShowSidebar}
          onMiniSidebar={onMiniSidebar}
        />
        <div className={`contents ${width <= 1200 && 'mini'}`}>
          <div
            className={`container-fluid`}
            style={isFixedDatatable && isDevice ? { height: '100%' } : {}}>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
