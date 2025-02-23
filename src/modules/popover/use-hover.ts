'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export const useHover = (
  triggerRef: React.RefObject<HTMLElement>,
  openDelay: number = 0,
  closeDelay: number = 0
) => {
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setIsHovering(true), openDelay);
  }, [openDelay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setIsHovering(false), closeDelay);
  }, [closeDelay]);

  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (triggerElement) {
      triggerElement.addEventListener('mouseenter', handleMouseEnter);
      triggerElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (triggerElement) {
        triggerElement.removeEventListener('mouseenter', handleMouseEnter);
        triggerElement.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerRef, handleMouseEnter, handleMouseLeave]);

  return isHovering;
}; 