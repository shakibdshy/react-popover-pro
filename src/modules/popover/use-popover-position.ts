'use client';

import { RefObject, useCallback, useRef } from 'react';
import { Position, PopoverPlacement, VirtualElement } from './popover-types';

type ElementRef = RefObject<HTMLDivElement | null> | { current: VirtualElement };

const getOppositePosition = (placement: PopoverPlacement): PopoverPlacement => {
  switch (placement) {
    case 'top': return 'bottom';
    case 'top-start': return 'bottom-start';
    case 'top-end': return 'bottom-end';
    case 'bottom': return 'top';
    case 'bottom-start': return 'top-start';
    case 'bottom-end': return 'top-end';
    case 'left': return 'right';
    case 'left-start': return 'right-start';
    case 'left-end': return 'right-end';
    case 'right': return 'left';
    case 'right-start': return 'left-start';
    case 'right-end': return 'left-end';
  }
};

export const usePopoverPosition = (
  triggerRef: ElementRef,
  contentRef: RefObject<HTMLDivElement | null>,
  placement: PopoverPlacement,
  offset: number = 8
) => {
  const lastPosition = useRef<Position>({ x: 0, y: 0 });

  const calculatePosition = useCallback((): Position => {
    if (!triggerRef.current || !contentRef.current) {
      return lastPosition.current;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get scroll offsets for absolute positioning
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let x = 0;
    let y = 0;
    let actualPlacement = placement;

    // Check if we need to flip the placement
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    if (placement.startsWith('bottom') && spaceBelow < contentRect.height + offset) {
      if (spaceAbove > contentRect.height + offset) {
        actualPlacement = getOppositePosition(placement);
      }
    } else if (placement.startsWith('top') && spaceAbove < contentRect.height + offset) {
      if (spaceBelow > contentRect.height + offset) {
        actualPlacement = getOppositePosition(placement);
      }
    } else if (placement.startsWith('left') && spaceLeft < contentRect.width + offset) {
      if (spaceRight > contentRect.width + offset) {
        actualPlacement = getOppositePosition(placement);
      }
    } else if (placement.startsWith('right') && spaceRight < contentRect.width + offset) {
      if (spaceLeft > contentRect.width + offset) {
        actualPlacement = getOppositePosition(placement);
      }
    }

    // Base positions for each placement - adding scroll offsets for absolute positioning
    switch (actualPlacement) {
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

    // Horizontal alignment - adding scroll offsets for absolute positioning
    switch (actualPlacement) {
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

    // Ensure popover stays within viewport - using scroll offsets for absolute positioning
    x = Math.max(scrollX + 10, Math.min(x, scrollX + viewportWidth - contentRect.width - 10));
    y = Math.max(scrollY + 10, Math.min(y, scrollY + viewportHeight - contentRect.height - 10));

    const newPosition = { x, y };

    // Only update if position actually changed
    if (
      Math.abs(newPosition.x - lastPosition.current.x) > 1 ||
      Math.abs(newPosition.y - lastPosition.current.y) > 1
    ) {
      lastPosition.current = newPosition;
      return newPosition;
    }

    return lastPosition.current;
  }, [triggerRef, contentRef, placement, offset]);

  return calculatePosition;
}; 