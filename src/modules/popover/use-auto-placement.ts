'use client';

/**
 * @module useAutoPlacement
 * @description Custom hook for automatically determining the optimal placement of a popover.
 * 
 * This hook dynamically calculates the best position for a popover based on:
 * - Available space in the viewport or boundary element
 * - Preferred placement specified by the developer
 * - Visibility of both trigger and content elements
 * - Real-time updates as the window resizes or scrolls
 */

import { RefObject, useCallback, useEffect, useState, useRef } from 'react';
import { PopoverPlacement } from './popover-types';

/**
 * Interface representing a rectangle with position and dimensions.
 * Used for calculations related to element positioning.
 */
interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Gets the current viewport rectangle.
 * 
 * @returns {Rect} Rectangle representing the viewport dimensions and position
 */
const getViewportRect = (): Rect => {
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  
  return {
    top: scrollY,
    left: scrollX,
    right: scrollX + window.innerWidth,
    bottom: scrollY + window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Gets the bounding rectangle for an element, constrained by an optional boundary element.
 * 
 * @param {HTMLElement | null} element - The element to get the bounding rectangle for
 * @param {HTMLElement | null} boundary - Optional boundary element to constrain the rectangle
 * @returns {Rect} The bounding rectangle, constrained by the boundary if provided
 */
const getBoundingRect = (element: HTMLElement | null, boundary: HTMLElement | null): Rect => {
  if (!element) return getViewportRect();
  
  const rect = element.getBoundingClientRect();
  const boundaryRect = boundary?.getBoundingClientRect() || getViewportRect();
  
  // Get current scroll position
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  
  // Convert client coordinates to absolute coordinates
  const absoluteRect = {
    top: rect.top + scrollY,
    left: rect.left + scrollX,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY,
    width: rect.width,
    height: rect.height,
  };
  
  // Convert boundary client coordinates to absolute coordinates if it's not the viewport
  const absoluteBoundaryRect = boundary ? {
    top: boundaryRect.top + scrollY,
    left: boundaryRect.left + scrollX,
    right: boundaryRect.right + scrollX,
    bottom: boundaryRect.bottom + scrollY,
    width: boundaryRect.width,
    height: boundaryRect.height,
  } : boundaryRect;
  
  return {
    top: Math.max(absoluteRect.top, absoluteBoundaryRect.top),
    left: Math.max(absoluteRect.left, absoluteBoundaryRect.left),
    right: Math.min(absoluteRect.right, absoluteBoundaryRect.right),
    bottom: Math.min(absoluteRect.bottom, absoluteBoundaryRect.bottom),
    width: rect.width,
    height: rect.height,
  };
};

/**
 * Calculates the available space for each possible placement.
 * 
 * @param {Rect} triggerRect - Rectangle of the trigger element
 * @param {Rect} contentRect - Rectangle of the content element
 * @param {Rect} boundaryRect - Rectangle of the boundary element or viewport
 * @returns {Record<PopoverPlacement, number>} Available space for each placement option
 */
const getAvailableSpace = (
  triggerRect: Rect,
  contentRect: Rect,
  boundaryRect: Rect
): Record<PopoverPlacement, number> => {
  // Calculate available space in each direction
  return {
    'top': triggerRect.top - boundaryRect.top,
    'top-start': triggerRect.top - boundaryRect.top,
    'top-end': triggerRect.top - boundaryRect.top,
    'bottom': boundaryRect.bottom - triggerRect.bottom,
    'bottom-start': boundaryRect.bottom - triggerRect.bottom,
    'bottom-end': boundaryRect.bottom - triggerRect.bottom,
    'left': triggerRect.left - boundaryRect.left,
    'left-start': triggerRect.left - boundaryRect.left,
    'left-end': triggerRect.left - boundaryRect.left,
    'right': boundaryRect.right - triggerRect.right,
    'right-start': boundaryRect.right - triggerRect.right,
    'right-end': boundaryRect.right - triggerRect.right,
  };
};

/**
 * Extracts the base axis from a placement value.
 * 
 * @param {PopoverPlacement} placement - The placement to extract the base axis from
 * @returns {'top' | 'bottom' | 'left' | 'right'} The base axis
 */
const getBaseAxis = (placement: PopoverPlacement): 'top' | 'bottom' | 'left' | 'right' => {
  return placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
};

/**
 * Determines the optimal placement based on available space and preferred placement.
 * 
 * @param {PopoverPlacement} preferredPlacement - The preferred placement
 * @param {Rect} triggerRect - Rectangle of the trigger element
 * @param {Rect} contentRect - Rectangle of the content element
 * @param {Rect} boundaryRect - Rectangle of the boundary element or viewport
 * @returns {PopoverPlacement} The optimal placement
 */
const getOptimalPlacement = (
  preferredPlacement: PopoverPlacement,
  triggerRect: Rect,
  contentRect: Rect,
  boundaryRect: Rect
): PopoverPlacement => {
  const availableSpace = getAvailableSpace(triggerRect, contentRect, boundaryRect);
  const requiredSpace = {
    top: contentRect.height,
    bottom: contentRect.height,
    left: contentRect.width,
    right: contentRect.width,
  };

  // Check if preferred placement has enough space
  const baseAxis = getBaseAxis(preferredPlacement);
  if (availableSpace[preferredPlacement] >= requiredSpace[baseAxis]) {
    return preferredPlacement;
  }

  // If preferred placement doesn't have enough space, try the opposite placement
  const oppositeMap: Record<string, PopoverPlacement> = {
    'top': 'bottom',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    'bottom': 'top',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    'left': 'right',
    'left-start': 'right-start',
    'left-end': 'right-end',
    'right': 'left',
    'right-start': 'left-start',
    'right-end': 'left-end',
  };

  const oppositePlacement = oppositeMap[preferredPlacement];
  const oppositeBaseAxis = getBaseAxis(oppositePlacement);
  
  // If opposite placement has enough space, use it
  if (availableSpace[oppositePlacement] >= requiredSpace[oppositeBaseAxis]) {
    return oppositePlacement;
  }

  // If neither preferred nor opposite has enough space, find the placement with maximum available space
  const placements = Object.entries(availableSpace) as [PopoverPlacement, number][];
  const sortedPlacements = placements.sort((a, b) => b[1] - a[1]);
  
  // Return the placement with the most available space
  return sortedPlacements[0][0];
};

/**
 * Custom hook that automatically determines the optimal placement for a popover.
 * 
 * @param {RefObject<HTMLElement>} triggerRef - Reference to the trigger element
 * @param {RefObject<HTMLElement>} contentRef - Reference to the content element
 * @param {PopoverPlacement} preferredPlacement - The preferred placement
 * @param {HTMLElement | null} [boundaryElement=null] - Optional element to use as a boundary
 * @param {boolean} [enabled=true] - Whether auto-placement is enabled
 * @returns {PopoverPlacement} The calculated optimal placement
 */
export const useAutoPlacement = (
  triggerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  preferredPlacement: PopoverPlacement,
  boundaryElement: HTMLElement | null = null,
  enabled: boolean = true
) => {
  const [placement, setPlacement] = useState<PopoverPlacement>(preferredPlacement);
  const lastUpdateTime = useRef(0);
  const THROTTLE_MS = 16; // Approximately 60fps

  /**
   * Updates the placement based on current element positions and available space.
   * This function is throttled to prevent excessive calculations.
   */
  const updatePlacement = useCallback(() => {
    if (!enabled || !triggerRef.current) return;

    // Throttle updates
    const now = Date.now();
    if (now - lastUpdateTime.current < THROTTLE_MS) {
      return;
    }
    lastUpdateTime.current = now;

    // If content isn't rendered yet, use preferred placement
    if (!contentRef.current) {
      if (placement !== preferredPlacement) {
        setPlacement(preferredPlacement);
      }
      return;
    }

    // Check if trigger is still visible in the viewport
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // If trigger is completely outside viewport, don't update placement
    const isTriggerVisible = !(
      triggerRect.bottom < 0 ||
      triggerRect.top > viewportHeight ||
      triggerRect.right < 0 ||
      triggerRect.left > viewportWidth
    );
    
    if (!isTriggerVisible) {
      // If trigger is not visible, we should still calculate placement
      // but we'll prioritize keeping the content visible
      const contentRect = contentRef.current.getBoundingClientRect();
      const boundaryRect = getBoundingRect(boundaryElement, null);
      
      // Get all possible placements
      const allPlacements: PopoverPlacement[] = [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end'
      ];
      
      // Find the placement that keeps the content most visible
      let bestPlacement = preferredPlacement;
      let maxVisibleArea = 0;
      
      for (const p of allPlacements) {
        // Calculate how much of the content would be visible with this placement
        const visibleArea = calculateVisibleArea(p, triggerRect, contentRect, boundaryRect);
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          bestPlacement = p;
        }
      }
      
      if (bestPlacement !== placement) {
        setPlacement(bestPlacement);
      }
      return;
    }

    const triggerBoundingRect = getBoundingRect(triggerRef.current, boundaryElement);
    const contentBoundingRect = getBoundingRect(contentRef.current, boundaryElement);
    const boundaryBoundingRect = getBoundingRect(boundaryElement, null);

    const optimalPlacement = getOptimalPlacement(
      preferredPlacement,
      triggerBoundingRect,
      contentBoundingRect,
      boundaryBoundingRect
    );

    if (optimalPlacement !== placement) {
      setPlacement(optimalPlacement);
    }
  }, [enabled, triggerRef, contentRef, preferredPlacement, boundaryElement, placement]);

  /**
   * Calculates how much of the content would be visible with a given placement.
   * 
   * @param {PopoverPlacement} placement - The placement to calculate visibility for
   * @param {DOMRect} triggerRect - Rectangle of the trigger element
   * @param {DOMRect} contentRect - Rectangle of the content element
   * @param {Rect} boundaryRect - Rectangle of the boundary element or viewport
   * @returns {number} The visible area in square pixels
   */
  const calculateVisibleArea = (
    placement: PopoverPlacement,
    triggerRect: DOMRect,
    contentRect: DOMRect,
    boundaryRect: Rect
  ): number => {
    // Use boundary rect if available
    const effectiveBoundaryTop = boundaryRect.top;
    const effectiveBoundaryLeft = boundaryRect.left;
    const effectiveBoundaryRight = boundaryRect.right;
    const effectiveBoundaryBottom = boundaryRect.bottom;
    
    // Estimate content position based on placement
    let contentTop = 0;
    let contentLeft = 0;
    
    switch (placement.split('-')[0]) {
      case 'top':
        contentTop = triggerRect.top - contentRect.height;
        contentLeft = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'bottom':
        contentTop = triggerRect.bottom;
        contentLeft = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'left':
        contentTop = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        contentLeft = triggerRect.left - contentRect.width;
        break;
      case 'right':
        contentTop = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        contentLeft = triggerRect.right;
        break;
    }
    
    // Adjust for alignment modifiers
    if (placement.includes('-start')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        contentLeft = triggerRect.left;
      } else {
        contentTop = triggerRect.top;
      }
    } else if (placement.includes('-end')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        contentLeft = triggerRect.right - contentRect.width;
      } else {
        contentTop = triggerRect.bottom - contentRect.height;
      }
    }
    
    // Calculate visible area
    const contentRight = contentLeft + contentRect.width;
    const contentBottom = contentTop + contentRect.height;
    
    // Use boundary rect for visibility calculation
    const visibleLeft = Math.max(effectiveBoundaryLeft, contentLeft);
    const visibleTop = Math.max(effectiveBoundaryTop, contentTop);
    const visibleRight = Math.min(effectiveBoundaryRight, contentRight);
    const visibleBottom = Math.min(effectiveBoundaryBottom, contentBottom);
    
    const visibleWidth = Math.max(0, visibleRight - visibleLeft);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
    return visibleWidth * visibleHeight;
  };

  // Update placement when dependencies change
  useEffect(() => {
    updatePlacement();
  }, [preferredPlacement, updatePlacement]);

  /**
   * Sets up observers to detect changes that might affect placement.
   * This includes:
   * - ResizeObserver for element size changes
   * - Scroll and resize event listeners
   * - MutationObserver for DOM changes
   */
  useEffect(() => {
    if (!enabled) return;

    // Initial update
    updatePlacement();

    // Set up observers
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updatePlacement);
    });
    
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    if (boundaryElement) resizeObserver.observe(boundaryElement);

    // Handle scroll events with capture to catch all scrolling
    const handleScroll = () => {
      requestAnimationFrame(updatePlacement);
    };

    // Use passive and capture to ensure we catch all events
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Add a MutationObserver to detect DOM changes that might affect positioning
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updatePlacement);
    });
    
    if (document.body) {
      mutationObserver.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [boundaryElement, contentRef, enabled, triggerRef, updatePlacement]);

  return placement;
}; 