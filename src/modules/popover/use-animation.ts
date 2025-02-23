'use client';

import { useEffect, useState } from 'react';

export const useAnimation = (
  isOpen: boolean,
  duration: number = 200,
  timing: string = 'ease'
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  const styles = {
    opacity: isAnimating ? 1 : 0,
    transform: `scale(${isAnimating ? 1 : 0.95})`,
    transition: `opacity ${duration}ms ${timing}, transform ${duration}ms ${timing}`,
  };

  return { shouldRender, styles };
}; 