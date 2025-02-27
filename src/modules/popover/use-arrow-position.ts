'use client';

import { RefObject, useCallback } from 'react';
import { PopoverPlacement } from './popover-types';

/**
 * Hook to calculate the optimal arrow position based on the trigger and content elements
 */
export const useArrowPosition = () => {
  /**
   * Calculate the optimal arrow position to align with the trigger button
   */
  const calculateArrowPosition = useCallback(
    (
      triggerRef: RefObject<HTMLElement | null>,
      contentRef: RefObject<HTMLElement | null>,
      placement: PopoverPlacement,
      arrowRef: RefObject<HTMLElement | null>
    ): { left?: string; right?: string; top?: string; bottom?: string } => {
      if (!triggerRef.current || !contentRef.current || !arrowRef.current) {
        return {};
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const arrowRect = arrowRef.current.getBoundingClientRect();

      // Default styles
      const styles: { left?: string; right?: string; top?: string; bottom?: string } = {};

      // Calculate the center of the trigger relative to the content
      const triggerCenter = {
        x: triggerRect.left + triggerRect.width / 2,
        y: triggerRect.top + triggerRect.height / 2,
      };

      // Calculate the content boundaries
      const contentLeft = contentRect.left;
      const contentTop = contentRect.top;
      
      // Calculate the safe area for the arrow (accounting for arrow size and padding)
      const arrowSize = arrowRect.width;
      const arrowPadding = 12; // Minimum distance from the edge
      
      // For horizontal placements (top, bottom)
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        // Calculate the horizontal position
        let horizontalPosition = triggerCenter.x - contentLeft - arrowSize / 2;
        
        // Ensure the arrow doesn't go outside the content boundaries
        const minPosition = arrowPadding;
        const maxPosition = contentRect.width - arrowSize - arrowPadding;
        
        horizontalPosition = Math.max(minPosition, Math.min(horizontalPosition, maxPosition));
        
        // Set the left position
        styles.left = `${horizontalPosition}px`;
      }
      
      // For vertical placements (left, right)
      if (placement.startsWith('left') || placement.startsWith('right')) {
        // Calculate the vertical position
        let verticalPosition = triggerCenter.y - contentTop - arrowSize / 2;
        
        // Ensure the arrow doesn't go outside the content boundaries
        const minPosition = arrowPadding;
        const maxPosition = contentRect.height - arrowSize - arrowPadding;
        
        verticalPosition = Math.max(minPosition, Math.min(verticalPosition, maxPosition));
        
        // Set the top position
        styles.top = `${verticalPosition}px`;
      }

      return styles;
    },
    []
  );

  return { calculateArrowPosition };
}; 