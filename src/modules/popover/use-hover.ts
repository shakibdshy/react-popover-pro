'use client';

/**
 * @module useHover
 * @description Custom hook for managing hover interactions with popovers.
 * 
 * This hook provides sophisticated hover detection functionality including:
 * - Configurable open and close delays to prevent accidental triggers
 * - Intelligent tracking of hover state across both trigger and content elements
 * - Handling of mouse movement between trigger and content without closing
 * - Cleanup of event listeners and timeouts to prevent memory leaks
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that manages hover state for popover interactions.
 * 
 * @param {React.RefObject<HTMLElement>} triggerRef - Reference to the trigger element
 * @param {number} [openDelay=0] - Delay in milliseconds before opening the popover on hover
 * @param {number} [closeDelay=0] - Delay in milliseconds before closing the popover when hover ends
 * @returns {boolean} Current hover state (true if hovering, false otherwise)
 */
export const useHover = (
  triggerRef: React.RefObject<HTMLElement>,
  openDelay: number = 0,
  closeDelay: number = 0
) => {
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const contentHoverRef = useRef(false); 
  const positionCalculatedRef = useRef(false); 

  /**
   * Handles mouse enter events on the trigger element.
   * Starts the open delay timer or immediately shows the popover.
   */
  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    
    // Clear any existing timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset position calculated flag when entering
    positionCalculatedRef.current = false;
    
    if (!isHovering) {
      if (openDelay > 0) {
        // Set a timeout to open the popover after the delay
        timeoutRef.current = window.setTimeout(() => {
          setIsHovering(true);
        }, openDelay);
      } else {
        setIsHovering(true);
      }
    }
  }, [isHovering, openDelay]);

  /**
   * Handles mouse leave events on the trigger element.
   * Starts the close delay timer or immediately hides the popover.
   */
  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    
    // Clear any existing timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Use a delay to check if we've moved to the content
    if (closeDelay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        // Only close if we're not hovering over trigger or content
        if (!isHoveringRef.current && !contentHoverRef.current) {
          setIsHovering(false);
          positionCalculatedRef.current = false;
        }
      }, closeDelay);
    } else {
      // If no delay, check immediately
      if (!contentHoverRef.current) {
        setIsHovering(false);
        positionCalculatedRef.current = false;
      }
    }
  }, [closeDelay]);

  /**
   * Handles hover state changes for the popover content.
   * 
   * @param {boolean} isHovering - Whether the content is being hovered
   */
  const handleContentHover = useCallback((isHovering: boolean) => {
    contentHoverRef.current = isHovering;
    
    // If no longer hovering over content and not hovering over trigger
    if (!isHovering && !isHoveringRef.current) {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      
      if (closeDelay > 0) {
        // Set a timeout to close the popover after the delay
        timeoutRef.current = window.setTimeout(() => {
          setIsHovering(false);
          positionCalculatedRef.current = false;
        }, closeDelay);
      } else {
        // If no delay, close immediately
        setIsHovering(false);
        positionCalculatedRef.current = false;
      }
    }
  }, [closeDelay]);

  /**
   * Sets up event listeners for hover detection and handles cleanup.
   * Manages listeners for both the trigger element and popover content.
   */
  useEffect(() => {
    const triggerElement = triggerRef.current;
    
    if (triggerElement) {
      triggerElement.addEventListener('mouseenter', handleMouseEnter);
      triggerElement.addEventListener('mouseleave', handleMouseLeave);
    }

    /**
     * Handles global mouse movement to detect hovering over popover content.
     * This is necessary to maintain hover state when moving between trigger and content.
     * 
     * @param {MouseEvent} e - The mouse move event
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoveringRef.current && isHovering) {
        // If we're not hovering over the trigger but the state is hovering,
        // check if we're hovering over the popover content
        const popoverContent = document.querySelector('[data-popover-content="true"]');
        if (popoverContent && popoverContent.contains(e.target as Node)) {
          contentHoverRef.current = true;
          if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        } else {
          contentHoverRef.current = false;
        }
      }
    };

    /**
     * Handles mouse enter events on the popover content.
     */
    const handleContentMouseEnter = () => {
      handleContentHover(true);
    };

    /**
     * Handles mouse leave events on the popover content.
     */
    const handleContentMouseLeave = () => {
      handleContentHover(false);
    };

    /**
     * Finds the popover content element and adds event listeners to it.
     * Uses a small delay to ensure the content is in the DOM.
     */
    const addContentListeners = () => {
      if (isHovering) {
        setTimeout(() => {
          const popoverContent = document.querySelector('[data-popover-content="true"]');
          if (popoverContent) {
            popoverContent.addEventListener('mouseenter', handleContentMouseEnter);
            popoverContent.addEventListener('mouseleave', handleContentMouseLeave);
          }
        }, 50); 
      }
    };

    // Set up all event listeners
    addContentListeners();
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove all event listeners and clear timeouts
    return () => {
      if (triggerElement) {
        triggerElement.removeEventListener('mouseenter', handleMouseEnter);
        triggerElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Remove content listeners
      const popoverContent = document.querySelector('[data-popover-content="true"]');
      if (popoverContent) {
        popoverContent.removeEventListener('mouseenter', handleContentMouseEnter);
        popoverContent.removeEventListener('mouseleave', handleContentMouseLeave);
      }

      // Clear any remaining timeout
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerRef, handleMouseEnter, handleMouseLeave, isHovering, handleContentHover]);

  return isHovering;
}; 