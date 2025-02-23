'use client';

import { RefObject, useEffect, useRef } from 'react';

export const useFocusManagement = (
  isOpen: boolean,
  contentRef: RefObject<HTMLDivElement | null>,
  autoFocus: boolean = false,
  returnFocus: boolean = false
) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      if (autoFocus && contentRef.current) {
        const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length) {
          focusableElements[0].focus();
        } else {
          contentRef.current.focus();
        }
      }
    } else if (returnFocus && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen, contentRef, autoFocus, returnFocus]);

  const handleFocusTrap = (e: KeyboardEvent) => {
    if (!isOpen || !contentRef.current) return;

    const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen, contentRef.current]);

  return { previousActiveElement };
}; 