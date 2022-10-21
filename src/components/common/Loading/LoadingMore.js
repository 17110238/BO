import React from 'react';

function LoadingMore({ width }) {
  return <img style={{ width: width || '5%' }} src='/loading-more.svg' alt='' />;
}

export default LoadingMore;
