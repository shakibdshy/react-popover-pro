'use client';

/**
 * @module useFocusManagement
 * @description Custom hook for managing focus within popovers.
 * 
 * This hook handles accessibility-focused features including:
 * - Auto-focusing the first focusable element when a popover opens
 * - Returning focus to the trigger element when a popover closes
 * - Creating a focus trap to keep keyboard navigation within the popover
 * - Managing keyboard interactions for improved accessibility
 */

import { RefObject, useEffect, useRef } from 'react';

/**
 * Custom hook that manages focus behavior for popovers.
 * 
 * @param {boolean} isOpen - Whether the popover is currently open
 * @param {RefObject<HTMLDivElement | null>} contentRef - Reference to the popover content element
 * @param {boolean} [autoFocus=false] - Whether to automatically focus the first focusable element when opened
 * @param {boolean} [returnFocus=false] - Whether to return focus to the previously focused element when closed
 * @returns {Object} Focus management utilities
 * @returns {RefObject<HTMLElement | null>} .previousActiveElement - Reference to the element that had focus before the popover opened
 */
export const useFocusManagement = (
  isOpen: boolean,
  contentRef: RefObject<HTMLDivElement | null>,
  autoFocus: boolean = false,
  returnFocus: boolean = false
) => {
  // Keep track of the element that had focus before the popover opened
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Manages focus when the popover opens or closes.
   * When opening: Stores the currently focused element and optionally focuses the first focusable element in the popover.
   * When closing: Optionally returns focus to the previously focused element.
   */
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      if (autoFocus && contentRef.current) {
        // Find all focusable elements within the popover
        const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Focus the first focusable element, or the popover itself if none exist
        if (focusableElements.length) {
          focusableElements[0].focus();
        } else {
          contentRef.current.focus();
        }
      }
    } else if (returnFocus && previousActiveElement.current) {
      // Return focus to the previously focused element when closing
      previousActiveElement.current.focus();
    }
  }, [isOpen, contentRef, autoFocus, returnFocus]);

  /**
   * Handles keyboard events to create a focus trap within the popover.
   * Prevents focus from leaving the popover when using Tab navigation.
   * 
   * @param {KeyboardEvent} e - The keyboard event
   */
  const handleFocusTrap = (e: KeyboardEvent) => {
    if (!isOpen || !contentRef.current) return;

    // Find all focusable elements within the popover
    const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Handle Tab key navigation to create a focus trap
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // If Shift+Tab is pressed and focus is on the first element,
        // move focus to the last element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // If Tab is pressed and focus is on the last element,
        // move focus back to the first element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  /**
   * Sets up and cleans up the keyboard event listener for the focus trap.
   */
  useEffect(() => {
    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen, contentRef.current]);

  return { previousActiveElement };
}; 