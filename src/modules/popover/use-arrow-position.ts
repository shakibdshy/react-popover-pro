'use client';

/**
 * @module useArrowPosition
 * @description Custom hook for calculating the optimal position of the popover arrow.
 * 
 * This hook provides functionality to position the arrow element of a popover
 * so that it points accurately to the trigger element, taking into account:
 * - The placement of the popover (top, bottom, left, right)
 * - The dimensions and positions of both trigger and content elements
 * - Safe boundaries to prevent the arrow from being positioned too close to edges
 */

import { RefObject, useCallback } from 'react';
import { PopoverPlacement } from './popover-types';

/**
 * Custom hook that calculates the optimal arrow position for popovers.
 * 
 * @returns {Object} Object containing the calculateArrowPosition function
 * @returns {Function} .calculateArrowPosition - Function to calculate arrow position
 */
export const useArrowPosition = () => {
  /**
   * Calculates the optimal arrow position to align with the trigger button.
   * 
   * @param {RefObject<HTMLElement | null>} triggerRef - Reference to the trigger element
   * @param {RefObject<HTMLElement | null>} contentRef - Reference to the content element
   * @param {PopoverPlacement} placement - Placement of the popover relative to the trigger
   * @param {RefObject<HTMLElement | null>} arrowRef - Reference to the arrow element
   * @returns {Object} CSS position properties for the arrow
   * @returns {string} [.left] - Left position in pixels
   * @returns {string} [.right] - Right position in pixels
   * @returns {string} [.top] - Top position in pixels
   * @returns {string} [.bottom] - Bottom position in pixels
   */
  const calculateArrowPosition = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      contentRef: RefObject<HTMLElement | null>,
      placement: PopoverPlacement,
      arrowRef: RefObject<HTMLElement | null>
    ): { left?: string; right?: string; top?: string; bottom?: string } => {
      // Return empty object if any of the required elements are not available
      if (!triggerRef.current || !contentRef.current || !arrowRef.current) {
        return {};
      }

      // Get the bounding rectangles for all elements
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const arrowRect = arrowRef.current.getBoundingClientRect();

      // Default styles object to hold position values
      const styles: { left?: string; right?: string; top?: string; bottom?: string } = {};

      // Calculate the center point of the trigger element
      const triggerCenter = {
        x: triggerRect.left + triggerRect.width / 2,
        y: triggerRect.top + triggerRect.height / 2,
      };

      // Get the content element's position
      const contentLeft = contentRect.left;
      const contentTop = contentRect.top;
      
      // Define arrow dimensions and minimum padding from edges
      const arrowSize = arrowRect.width;
      const arrowPadding = 12; // Minimum distance from the edge in pixels
      
      // Handle horizontal placements (top, bottom)
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        // Calculate the ideal horizontal position aligned with trigger center
        let horizontalPosition = triggerCenter.x - contentLeft - arrowSize / 2;
        
        // Constrain the position within safe boundaries
        const minPosition = arrowPadding;
        const maxPosition = contentRect.width - arrowSize - arrowPadding;
        
        // Clamp the position between min and max values
        horizontalPosition = Math.max(minPosition, Math.min(horizontalPosition, maxPosition));
        
        // Set the left position in pixels
        styles.left = `${horizontalPosition}px`;
      }
      
      // Handle vertical placements (left, right)
      if (placement.startsWith('left') || placement.startsWith('right')) {
        // Calculate the ideal vertical position aligned with trigger center
        let verticalPosition = triggerCenter.y - contentTop - arrowSize / 2;
        
        // Constrain the position within safe boundaries
        const minPosition = arrowPadding;
        const maxPosition = contentRect.height - arrowSize - arrowPadding;
        
        // Clamp the position between min and max values
        verticalPosition = Math.max(minPosition, Math.min(verticalPosition, maxPosition));
        
        // Set the top position in pixels
        styles.top = `${verticalPosition}px`;
      }

      return styles;
    },
    []
  );

  return { calculateArrowPosition };
}; 