import React from 'react';

interface LoadingInlineProp {
  loading?: boolean | undefined | any;
}

function LoadingInline({ loading = false }: LoadingInlineProp) {
  return loading ? (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 12,
      }}>
      <div className='atbd-spin-dots spin-lg'>
        <span className='spin-dot badge-dot dot-primary'></span>
        <span className='spin-dot badge-dot dot-primary'></span>
        <span className='spin-dot badge-dot dot-primary'></span>
        <span className='spin-dot badge-dot dot-primary'></span>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoadingInline;
