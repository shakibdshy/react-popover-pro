'use client';

import { RefObject, useCallback } from 'react';
import { Position, PopoverPlacement } from './popover-types';

export const usePopoverPosition = (
  triggerRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  placement: PopoverPlacement,
  offset: number = 8
) => {
  const calculatePosition = useCallback((): Position => {
    if (!triggerRef.current || !contentRef.current) {
      return { x: 0, y: 0 };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let x = 0;
    let y = 0;

    // Base positions for each placement
    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        y = triggerRect.top + scrollY - contentRect.height - offset;
        break;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        y = triggerRect.bottom + scrollY + offset;
        break;
      case 'left':
      case 'left-start':
      case 'left-end':
        x = triggerRect.left + scrollX - contentRect.width - offset;
        break;
      case 'right':
      case 'right-start':
      case 'right-end':
        x = triggerRect.right + scrollX + offset;
        break;
    }

    // Horizontal alignment
    switch (placement) {
      case 'top':
      case 'bottom':
        x = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'top-start':
      case 'bottom-start':
        x = triggerRect.left + scrollX;
        break;
      case 'top-end':
      case 'bottom-end':
        x = triggerRect.right + scrollX - contentRect.width;
        break;
      case 'left':
      case 'right':
        y = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2;
        break;
      case 'left-start':
      case 'right-start':
        y = triggerRect.top + scrollY;
        break;
      case 'left-end':
      case 'right-end':
        y = triggerRect.bottom + scrollY - contentRect.height;
        break;
    }

    // Ensure popover stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    x = Math.max(scrollX + 10, Math.min(x, scrollX + viewportWidth - contentRect.width - 10));
    y = Math.max(scrollY + 10, Math.min(y, scrollY + viewportHeight - contentRect.height - 10));

    return { x, y };
  }, [triggerRef, contentRef, placement, offset]);

  return calculatePosition;
}; 