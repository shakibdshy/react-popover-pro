"use client";

/**
 * @module usePopoverState
 * @description Custom hook for managing the complete state of a popover component.
 * 
 * This hook serves as the central state management system for popovers, handling:
 * - Open/close state (controlled or uncontrolled)
 * - Positioning and placement
 * - Animation effects
 * - Keyboard interactions and accessibility
 * - Click outside detection
 * - Nested popovers
 * - Various trigger modes (click, hover, context menu)
 * - Portal rendering
 * - Auto-placement with boundary detection
 */

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useHover } from "./use-hover";
import { useAutoPlacement } from "./use-auto-placement";
import { usePopoverContext } from "./popover-context";
import { PopoverContextValue, Position, PopoverPlacement, TriggerMode, VirtualElement, AnimationEffect } from "./popover-types";
import { usePopoverPosition } from "./use-popover-position";
import { applyMiddleware, Middleware } from "./middleware";

/**
 * Props for the usePopoverState hook.
 */
interface UsePopoverStateProps {
  /** Preferred placement of the popover relative to the trigger */
  placement: PopoverPlacement;
  /** Distance in pixels between the trigger and popover */
  offset: number;
  /** Whether the popover should be open by default (uncontrolled mode) */
  defaultOpen: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Unique ID for the popover */
  id: string;
  /** ARIA role for accessibility */
  role: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether to animate the popover */
  animate: boolean;
  /** Duration of the animation in milliseconds */
  animationDuration: number;
  /** CSS timing function for the animation */
  animationTiming: string;
  /** Animation effect to use */
  animationEffect?: AnimationEffect;
  /** Callback when popover opens */
  onOpen?: () => void;
  /** Callback when popover closes */
  onClose?: () => void;
  /** Callback when position changes */
  onPositionChange?: (position: Position) => void;
  /** Optional virtual element to use as trigger instead of a DOM element */
  virtualRef?: VirtualElement;
  /** Array of middleware functions to modify positioning */
  middleware: Middleware[];
  /** Whether to auto-focus the first focusable element in the popover */
  autoFocus: boolean;
  /** Whether to return focus to the trigger when the popover closes */
  returnFocus: boolean;
  /** How the popover is triggered (click, hover, context-menu) */
  triggerMode: TriggerMode;
  /** Delay in milliseconds before opening on hover */
  openDelay: number;
  /** Delay in milliseconds before closing on hover out */
  closeDelay: number;
  /** Whether to automatically adjust placement based on available space */
  autoPlacement: boolean;
  /** Element to use as a boundary for the popover */
  boundaryElement: HTMLElement | null;
  /** Element to render the portal into */
  portalTarget?: HTMLElement;
  /** Whether to render the popover in a portal */
  portal: boolean;
  /** Whether to show an arrow pointing to the trigger */
  arrow?: boolean;
  /** Visual variant of the popover */
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

/**
 * Custom hook that manages the complete state of a popover component.
 * 
 * @param {UsePopoverStateProps} props - Configuration options for the popover
 * @returns {PopoverContextValue} Complete popover state and methods
 */
export const usePopoverState = ({
  placement,
  offset,
  defaultOpen,
  open,
  onOpenChange,
  id,
  role,
  ariaLabel,
  animate,
  animationDuration,
  animationTiming,
  animationEffect = 'fade' as AnimationEffect,
  onOpen,
  onClose,
  onPositionChange,
  virtualRef,
  middleware,
  autoFocus,
  returnFocus,
  triggerMode,
  openDelay,
  closeDelay,
  autoPlacement,
  boundaryElement,
  portalTarget,
  portal,
  arrow,
  variant,
}: UsePopoverStateProps): PopoverContextValue => {
  // Check if this popover is nested inside another popover
  const parentContext = usePopoverContext(false);
  const nested = !!parentContext;

  /**
   * Get the chain of parent IDs for proper nesting.
   * This helps manage the hierarchy of nested popovers.
   */
  const parentChain = useMemo(() => {
    const chain: string[] = [];
    let currentContext: PopoverContextValue | null = parentContext;
    while (currentContext) {
      chain.push(currentContext.id);
      currentContext = currentContext.parentContext || null;
    }
    return chain;
  }, [parentContext]);

  // State management for open/close
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  // State and refs for positioning
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Use either the provided virtual element or the trigger ref.
   * This allows positioning relative to virtual elements (like cursor position).
   */
  const triggerElement = useMemo(
    () => (virtualRef ? { current: virtualRef } : triggerRef),
    [virtualRef]
  );

  /**
   * Get the position calculation function from usePopoverPosition.
   */
  const calculatePosition = usePopoverPosition(
    triggerElement,
    contentRef,
    placement,
    offset
  );

  /**
   * Use auto-placement to adjust the placement based on available space.
   * Only enabled for non-nested popovers to prevent conflicts.
   */
  const autoPlacementEnabled = autoPlacement && !nested;
  const resolvedPlacement = useAutoPlacement(
    triggerRef as React.RefObject<HTMLElement>,
    contentRef as React.RefObject<HTMLElement>,
    placement,
    boundaryElement,
    autoPlacementEnabled
  );

  // Use the resolved placement from auto-placement
  const actualPlacement = resolvedPlacement;
  
  /**
   * Enhanced position calculation that applies middleware and handles updates.
   * This function is responsible for the final positioning of the popover.
   */
  const enhancedUpdatePosition = useCallback(() => {
    // Skip position updates if we're not open
    if (!isOpen) return;
    
    // First calculate the basic position
    const newPosition = calculatePosition();
    
    // Apply middleware
    const finalPosition = applyMiddleware(newPosition, middleware);
    
    // Only update if position actually changed significantly
    if (
      !position || 
      Math.abs(finalPosition.x - position.x) > 1 || 
      Math.abs(finalPosition.y - position.y) > 1
    ) {
      // Set the position
      setPosition(finalPosition);
      
      // Notify about position change
      onPositionChange?.(finalPosition);
    }
  }, [calculatePosition, middleware, onPositionChange, position, isOpen]);

  // Refs for throttling position updates
  const rafId = useRef(0);
  const lastUpdate = useRef(0);
  const THROTTLE_MS = 16; // Approximately 60fps
  const updateInProgress = useRef(false);

  /**
   * Throttled position update handler.
   * Ensures position updates don't happen too frequently.
   */
  const handlePositionUpdate = useCallback(() => {
    // Skip if not open
    if (!isOpen) return;
    
    // Throttle updates
    const now = Date.now();
    if (now - lastUpdate.current >= THROTTLE_MS && !updateInProgress.current) {
      updateInProgress.current = true;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        enhancedUpdatePosition();
        lastUpdate.current = now;
        updateInProgress.current = false;
      });
    }
  }, [enhancedUpdatePosition, isOpen]);

  /**
   * Handles opening and closing the popover.
   * Ensures position is calculated before showing the popover.
   * 
   * @param {boolean} open - Whether to open or close the popover
   */
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      // When opening, update position first
      enhancedUpdatePosition();
      
      // Use requestAnimationFrame to ensure position is calculated before showing
      requestAnimationFrame(() => {
        // Set open state
        setUncontrolledOpen(true);
        onOpen?.();
        onOpenChange?.(true);
        
        // Schedule a single additional position update
        requestAnimationFrame(() => {
          enhancedUpdatePosition();
        });
      });
    } else {
      setUncontrolledOpen(false);
      onClose?.();
      onOpenChange?.(false);
    }
  }, [enhancedUpdatePosition, onOpen, onClose, onOpenChange]);

  /**
   * Effect to handle initial position calculation and updates when dependencies change.
   */
  useEffect(() => {
    if (isOpen) {
      // Calculate position immediately when popover opens
      enhancedUpdatePosition();
      
      // Schedule a single update to ensure correct positioning
      const immediateUpdate = requestAnimationFrame(enhancedUpdatePosition);
      
      return () => {
        cancelAnimationFrame(immediateUpdate);
      };
    }
  }, [isOpen, placement, offset, enhancedUpdatePosition]);

  /**
   * Effect to handle scroll and resize events.
   * Updates position when the window is resized or scrolled.
   */
  useEffect(() => {
    if (!isOpen) return;

    // Initial position update
    handlePositionUpdate();

    // Listen for both resize and scroll events since we're using absolute positioning
    window.addEventListener("resize", handlePositionUpdate, { passive: true });
    window.addEventListener("scroll", handlePositionUpdate, { passive: true, capture: true });

    return () => {
      window.removeEventListener("resize", handlePositionUpdate);
      window.removeEventListener("scroll", handlePositionUpdate);
      cancelAnimationFrame(rafId.current);
    };
  }, [isOpen, handlePositionUpdate]);

  /**
   * Keyboard event handler for accessibility.
   * Handles Escape key to close and arrow keys for nested popovers.
   * 
   * @param {KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      handleOpenChange(false);
    } else if (nested) {
      if (e.key === "ArrowRight") {
        const nextPopover = contentRef.current?.querySelector(
          "[data-popover-trigger]"
        ) as HTMLElement;
        nextPopover?.focus();
      } else if (e.key === "ArrowLeft") {
        handleOpenChange(false);
        triggerRef.current?.focus();
      }
    }
  }, [isOpen, nested, handleOpenChange]);

  /**
   * Effect to set up keyboard event listeners.
   */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /**
   * Effect to handle clicks outside the popover.
   * Closes the popover when clicking outside both the trigger and content.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !triggerRef.current?.contains(event.target as Node) &&
        !contentRef.current?.contains(event.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleOpenChange]);

  /**
   * Effect to close this popover when any parent in the chain closes.
   * Ensures proper cleanup of nested popovers.
   */
  useEffect(() => {
    if (!nested || !isOpen) return;

    const shouldClose = parentChain.some((parentId) => {
      const parent = document.getElementById(parentId);
      return !parent || getComputedStyle(parent).display === "none";
    });

    if (shouldClose) {
      handleOpenChange(false);
    }
  }, [nested, isOpen, parentChain, handleOpenChange]);

  /**
   * Get hover state from useHover hook for hover trigger mode.
   */
  const isHovering = useHover(
    triggerRef as React.RefObject<HTMLElement>,
    openDelay,
    closeDelay
  );
  const shouldOpen = triggerMode === "hover" ? isHovering : isOpen;

  // Add a check for client-side rendering
  const isClient = typeof window !== 'undefined';
  
  // Use a ref to store the portal target to avoid re-renders
  const portalTargetRef = useRef<HTMLElement | undefined>(undefined);
  
  /**
   * Effect to set the portal target only on the client side.
   */
  useEffect(() => {
    if (isClient) {
      portalTargetRef.current = document.body;
    }
  }, [isClient]);

  /**
   * Effect for auto-placement that responds to scroll events.
   * Handles smooth transitions when placement changes.
   */
  useEffect(() => {
    if (!isOpen || !autoPlacementEnabled) return;
    
    /**
     * Handles smooth transitions when placement changes.
     */
    const handlePlacementChange = () => {
      if (resolvedPlacement !== actualPlacement) {
        // Add a class to enable smooth transitions
        if (contentRef.current) {
          contentRef.current.classList.add('position-transitioning');
        }
        
        // Reset position to force recalculation with the new placement
        setPosition({ x: 0, y: 0 });
        
        // Schedule an immediate position update
        requestAnimationFrame(() => {
          enhancedUpdatePosition();
          
          // Remove the transition class after the transition completes
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
          }, 300); // Match the transition duration in CSS
        });
      }
    };
    
    /**
     * Checks if the trigger is still visible in the viewport.
     * Closes the popover if the trigger is no longer visible.
     */
    const checkTriggerVisibility = () => {
      if (!triggerRef.current) return;
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // If trigger is completely outside viewport, close the popover
      const isTriggerVisible = !(
        triggerRect.bottom < 0 ||
        triggerRect.top > viewportHeight ||
        triggerRect.right < 0 ||
        triggerRect.left > viewportWidth
      );
      
      if (!isTriggerVisible && isOpen) {
        // Close the popover if the trigger is no longer visible
        handleOpenChange(false);
      }
    };
    
    // Initial check
    handlePlacementChange();
    
    // Set up interval to check trigger visibility during scrolling
    const visibilityInterval = setInterval(checkTriggerVisibility, 100);
    
    return () => {
      // Cleanup
      clearInterval(visibilityInterval);
    };
  }, [isOpen, autoPlacementEnabled, resolvedPlacement, actualPlacement, enhancedUpdatePosition, contentRef, triggerRef, handleOpenChange]);

  return {
    isOpen: shouldOpen,
    triggerRef,
    contentRef,
    position,
    placement: actualPlacement,
    setIsOpen: handleOpenChange,
    setPosition,
    updatePosition: handlePositionUpdate,
    animate,
    animationDuration,
    animationTiming,
    animationEffect,
    id,
    role,
    'aria-label': ariaLabel,
    autoFocus,
    returnFocus,
    virtualRef,
    parentId: undefined,
    parentContext: null,
    parentChain: [],
    nested: false,
    portalTarget: portalTarget || (typeof window !== 'undefined' ? document.body : undefined),
    onKeyDown: handleKeyDown,
    triggerMode,
    portal,
    arrow,
    variant,
  };
}; 