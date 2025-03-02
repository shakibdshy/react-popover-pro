'use client';

/**
 * @module usePopoverPosition
 * @description Custom hook for calculating the optimal position of a popover relative to its trigger.
 * 
 * This hook handles complex positioning logic including:
 * - Calculating positions for all placement options (top, bottom, left, right with alignment variants)
 * - Automatic flipping of placement when there's insufficient space
 * - Ensuring the popover stays within viewport boundaries
 * - Supporting both DOM elements and virtual elements as triggers
 * - Accounting for scroll position for accurate absolute positioning
 */

import { RefObject, useCallback, useRef } from 'react';
import { Position, PopoverPlacement, VirtualElement } from './popover-types';

/**
 * Type representing either a React ref to a DOM element or a virtual element.
 */
type ElementRef = RefObject<HTMLDivElement | null> | { current: VirtualElement };

/**
 * Gets the opposite placement for a given placement.
 * Used for flipping the popover when there's insufficient space in the preferred direction.
 * 
 * @param {PopoverPlacement} placement - The original placement
 * @returns {PopoverPlacement} The opposite placement
 */
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

/**
 * Custom hook that calculates the position of a popover relative to its trigger element.
 * 
 * @param {ElementRef} triggerRef - Reference to the trigger element (DOM or virtual)
 * @param {RefObject<HTMLDivElement | null>} contentRef - Reference to the popover content element
 * @param {PopoverPlacement} placement - Preferred placement of the popover
 * @param {number} [offset=12] - Distance in pixels between the trigger and popover
 * @returns {Function} Function that calculates and returns the current optimal position
 */
export const usePopoverPosition = (
  triggerRef: ElementRef,
  contentRef: RefObject<HTMLDivElement | null>,
  placement: PopoverPlacement,
  offset: number = 12
) => {
  // Store the last calculated position to avoid unnecessary re-renders
  const lastPosition = useRef<Position>({ x: 0, y: 0 });
  // Track whether the initial position has been calculated
  const initialPositionCalculated = useRef<boolean>(false);

  /**
   * Calculates the optimal position for the popover based on current conditions.
   * 
   * @returns {Position} The calculated position with x and y coordinates
   */
  const calculatePosition = useCallback((): Position => {
    // If trigger element doesn't exist, return the last known position
    if (!triggerRef.current) {
      return lastPosition.current;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    
    if (!contentRef.current) {
      const defaultX = triggerRect.left + window.scrollX;
      const defaultY = triggerRect.bottom + window.scrollY + offset;
      
      lastPosition.current = { x: defaultX, y: defaultY };
      return lastPosition.current;
    }

    // Get content dimensions and viewport size
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get scroll offsets for absolute positioning
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const arrowOffset = 6;
    const totalOffset = offset + arrowOffset;

    let x = 0;
    let y = 0;
    let actualPlacement = placement;

    // Check if we need to flip the placement due to insufficient space
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    // Flip placement if there's not enough space in the preferred direction
    // but enough space in the opposite direction
    if (placement.startsWith('bottom') && spaceBelow < contentRect.height + totalOffset) {
      if (spaceAbove > contentRect.height + totalOffset) {
        actualPlacement = getOppositePosition(placement);
      }
    } else if (placement.startsWith('top') && spaceAbove < contentRect.height + totalOffset) {
      if (spaceBelow > contentRect.height + totalOffset) {
        actualPlacement = getOppositePosition(placement);
      }
    } else if (placement.startsWith('left') && spaceLeft < contentRect.width + totalOffset) {
      if (spaceRight > contentRect.width + totalOffset) {
        actualPlacement = getOppositePosition(placement);
      }
    } else if (placement.startsWith('right') && spaceRight < contentRect.width + totalOffset) {
      if (spaceLeft > contentRect.width + totalOffset) {
        actualPlacement = getOppositePosition(placement);
      }
    }

    // Calculate base positions for each placement (top/bottom/left/right)
    // Adding scroll offsets for absolute positioning
    switch (actualPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        y = triggerRect.top + scrollY - contentRect.height - totalOffset;
        break;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        y = triggerRect.bottom + scrollY + totalOffset;
        break;
      case 'left':
      case 'left-start':
      case 'left-end':
        x = triggerRect.left + scrollX - contentRect.width - totalOffset;
        break;
      case 'right':
      case 'right-start':
      case 'right-end':
        x = triggerRect.right + scrollX + totalOffset;
        break;
    }

    // Apply horizontal or vertical alignment based on placement
    // (center, start, end) - adding scroll offsets for absolute positioning
    switch (actualPlacement) {
      case 'top':
      case 'bottom':
        // Center align horizontally
        x = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'top-start':
      case 'bottom-start':
        // Align to left edge
        x = triggerRect.left + scrollX;
        break;
      case 'top-end':
      case 'bottom-end':
        // Align to right edge
        x = triggerRect.right + scrollX - contentRect.width;
        break;
      case 'left':
      case 'right':
        // Center align vertically
        y = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2;
        break;
      case 'left-start':
      case 'right-start':
        // Align to top edge
        y = triggerRect.top + scrollY;
        break;
      case 'left-end':
      case 'right-end':
        // Align to bottom edge
        y = triggerRect.bottom + scrollY - contentRect.height;
        break;
    }

    // Ensure popover stays within viewport boundaries
    // Add padding of 10px from viewport edges
    x = Math.max(scrollX + 10, Math.min(x, scrollX + viewportWidth - contentRect.width - 10));
    y = Math.max(scrollY + 10, Math.min(y, scrollY + viewportHeight - contentRect.height - 10));

    const newPosition = { x, y };
    initialPositionCalculated.current = true;

    // Only update if position has changed significantly (by more than 1px)
    // This prevents unnecessary re-renders
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