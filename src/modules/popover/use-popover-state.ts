"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useHover } from "./use-hover";
import { useAutoPlacement } from "./use-auto-placement";
import { usePopoverContext } from "./popover-context";
import { PopoverContextValue, Position, PopoverPlacement, TriggerMode, VirtualElement, AnimationEffect } from "./popover-types";
import { usePopoverPosition } from "./use-popover-position";
import { applyMiddleware, Middleware } from "./middleware";

interface UsePopoverStateProps {
  placement: PopoverPlacement;
  offset: number;
  defaultOpen: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  id: string;
  role: string;
  ariaLabel?: string;
  animate: boolean;
  animationDuration: number;
  animationTiming: string;
  animationEffect?: AnimationEffect;
  onOpen?: () => void;
  onClose?: () => void;
  onPositionChange?: (position: Position) => void;
  virtualRef?: VirtualElement;
  middleware: Middleware[];
  autoFocus: boolean;
  returnFocus: boolean;
  triggerMode: TriggerMode;
  openDelay: number;
  closeDelay: number;
  autoPlacement: boolean;
  boundaryElement: HTMLElement | null;
  usePortal: boolean;
  arrow?: boolean;
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

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
  usePortal,
  arrow,
  variant,
}: UsePopoverStateProps): PopoverContextValue => {
  const parentContext = usePopoverContext(false);
  const nested = !!parentContext;

  // Get the chain of parent IDs for proper nesting
  const parentChain = useMemo(() => {
    const chain: string[] = [];
    let currentContext: PopoverContextValue | null = parentContext;
    while (currentContext) {
      chain.push(currentContext.id);
      currentContext = currentContext.parentContext || null;
    }
    return chain;
  }, [parentContext]);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const triggerElement = useMemo(
    () => (virtualRef ? { current: virtualRef } : triggerRef),
    [virtualRef]
  );

  const calculatePosition = usePopoverPosition(
    triggerElement,
    contentRef,
    placement,
    offset
  );

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
  
  // Enhanced position calculation that accounts for arrow positioning
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

  const rafId = useRef(0);
  const lastUpdate = useRef(0);
  const THROTTLE_MS = 16; // Approximately 60fps
  const updateInProgress = useRef(false);

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

  // Initial position and dependency changes
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

  // Scroll and resize handlers
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

  // Keyboard handling
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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Click outside handling
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

  // Close this popover when any parent in the chain closes
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
  
  // Set the portal target only on the client side
  useEffect(() => {
    if (isClient) {
      portalTargetRef.current = document.body;
    }
  }, [isClient]);

  // Add a separate effect for auto-placement that responds to scroll events
  useEffect(() => {
    if (!isOpen || !autoPlacementEnabled) return;
    
    // Force a re-render when the placement changes
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
    
    // Check if trigger is still visible in the viewport
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
    portalTarget: typeof window !== 'undefined' ? document.body : undefined,
    onKeyDown: handleKeyDown,
    triggerMode,
    usePortal,
    arrow,
    variant,
  };
}; 