import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  isShowSearch: boolean;
  onToggleShowSearch?: () => void;
}

const ToggleSearchButton: React.FC<Props> = ({ isShowSearch, onToggleShowSearch }) => {
  const { t } = useTranslation('common');
  return (
    <button
      className={`filter-btn btn ${isShowSearch ? 'btn-active' : ''}`}
      onClick={onToggleShowSearch}>
      <svg
        width='14'
        height='12'
        xmlns='http://www.w3.org/2000/svg'
        style={{ transition: 'all 0.3s' }}>
        <path
          d='M6.99.005c1.977 0 3.954.001 5.93-.001.409 0 .73.151.938.507.237.405.177.817-.179 1.231-1.49 1.737-2.982 3.475-4.48 5.205a.762.762 0 0 0-.206.558c.014.614-.003 1.229.01 1.843.006.288-.094.49-.339.65-.93.61-1.854 1.23-2.779 1.85-.19.127-.381.215-.61.096-.237-.125-.279-.336-.278-.58.004-1.28-.004-2.56.005-3.841a.816.816 0 0 0-.212-.587C3.305 5.222 1.833 3.496.348 1.78.034 1.417-.114 1.037.103.583.318.13.706-.002 1.183 0 3.12.008 5.054.003 6.99.003v.002z'
          fill={isShowSearch ? '#00BE00' : '#647081'}
          fillRule='evenodd'></path>
      </svg>
      {t(['Filter', 'Hide filter'][+(isShowSearch || 0)])}
    </button>
  );
};

export default ToggleSearchButton;
