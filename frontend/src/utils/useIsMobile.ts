import { useState, useEffect } from 'react';
import { breakpoints } from '@sk-web-gui/react';

export const useIsMobile = () => {
  const largeDeviceMax = parseInt(breakpoints['large-device'].max.replace('px', ''));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= largeDeviceMax);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [largeDeviceMax]);

  return isMobile;
};
