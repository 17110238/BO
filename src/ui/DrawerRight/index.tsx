import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from 'components/common/Loading/LoadingFullScreen';

interface DrawerRightProps {
  overlay?: boolean,
  isShow: boolean,
  width?: number | string,
  className?: string,
  isBelowHeader?: Boolean,
  styleContainer?: any,
  closeDrawer?: () => void,
  children?: any,
  isSecondDrawer?: boolean
}

function DrawerRight({
  isShow,
  width = 500,
  className,
  isBelowHeader,
  styleContainer,
  closeDrawer,
  children,
  isSecondDrawer = false,
}: DrawerRightProps) {
  const isLoading = useSelector<any>((state) => state?.transactions?.loadingDrawer);
  const defaultWidth = 500;

  return (
    <div className={`drawer-basic-wrap basic ${isShow ? 'show' : ''}`}>
      <div
        className={`${className} atbd-drawer drawer-basic d-none ${isBelowHeader ? 'below-header' : ''
          }`}
        style={
          {
            width: '100%',
            maxWidth: `${+width!}px`,
            transform:  `${isSecondDrawer ? `translateX(-${+isSecondDrawer * (+width!)}px)` : ''}`,
            ...styleContainer,
          }
        }>
        {isLoading && <Loading />}
        {children}
      </div>
      {
        !isSecondDrawer &&
        <div
          className={`overlay-dark ${isShow ? 'show' : ''}`}
          onClick={() => closeDrawer && closeDrawer()}
        >
        </div>
      }
    </div>
  );
}

export default DrawerRight;
