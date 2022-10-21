import React, { useEffect, useState } from 'react';

interface Props {
  show: boolean;
}

function ToggleIcon({ show }: Props) {
  const [icon, setIcon] = useState<string>('plus');

  useEffect(() => {
    if (show) {
      setIcon('minus');
    } else {
      setIcon('plus');
    }
  }, [show]);

  return (
    <div className="toggle-button">
      <i className={`fas fa-${icon} toggle-icon`} />
    </div>
  );
}

export default ToggleIcon;