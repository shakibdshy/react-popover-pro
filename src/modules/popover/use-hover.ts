'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export const useHover = (
  triggerRef: React.RefObject<HTMLElement>,
  openDelay: number = 0,
  closeDelay: number = 0
) => {
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false); // Track hover state in a ref for event handlers
  const contentHoverRef = useRef(false); // Track if hovering over content
  const positionCalculatedRef = useRef(false); // Track if position has been calculated

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset position calculated flag when entering
    positionCalculatedRef.current = false;
    
    if (!isHovering) {
      if (openDelay > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setIsHovering(true);
        }, openDelay);
      } else {
        // If no delay, set immediately
        setIsHovering(true);
      }
    }
  }, [isHovering, openDelay]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Use a small delay to check if we've moved to the content
    if (closeDelay > 0) {
      timeoutRef.current = window.setTimeout(() => {
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

  // Handle content hover
  const handleContentHover = useCallback((isHovering: boolean) => {
    contentHoverRef.current = isHovering;
    
    if (!isHovering && !isHoveringRef.current) {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      
      if (closeDelay > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setIsHovering(false);
          positionCalculatedRef.current = false;
        }, closeDelay);
      } else {
        setIsHovering(false);
        positionCalculatedRef.current = false;
      }
    }
  }, [closeDelay]);

  useEffect(() => {
    const triggerElement = triggerRef.current;
    
    // Add event listeners to the trigger element
    if (triggerElement) {
      triggerElement.addEventListener('mouseenter', handleMouseEnter);
      triggerElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // Add global mousemove handler to detect hovering over content
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

    // Add event listeners for content hover
    const handleContentMouseEnter = () => {
      handleContentHover(true);
    };

    const handleContentMouseLeave = () => {
      handleContentHover(false);
    };

    // Find and add listeners to popover content
    const addContentListeners = () => {
      if (isHovering) {
        setTimeout(() => {
          const popoverContent = document.querySelector('[data-popover-content="true"]');
          if (popoverContent) {
            popoverContent.addEventListener('mouseenter', handleContentMouseEnter);
            popoverContent.addEventListener('mouseleave', handleContentMouseLeave);
          }
        }, 50); // Small delay to ensure content is in the DOM
      }
    };

    addContentListeners();
    document.addEventListener('mousemove', handleMouseMove);

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

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerRef, handleMouseEnter, handleMouseLeave, isHovering, handleContentHover]);

  return isHovering;
}; 