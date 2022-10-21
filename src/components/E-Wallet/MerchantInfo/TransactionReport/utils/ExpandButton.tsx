import React, { useState } from 'react';

interface Props {
  onClick: () => void
}

function ExpandButton({ onClick }: Props) {
  const [icon, setIcon] = useState<string>('plus');

  const handleChangeIcon = () => {
    if (icon === 'minus') {
      setIcon('plus');
    } else {
      setIcon('minus');
    }
  };

  const handleButtonClick = () => {
    handleChangeIcon();
    onClick();
  }

  return (
    <i className={`fas fa-${icon} expand-icon`} onClick={handleButtonClick}></i>
  );
}

export default ExpandButton;