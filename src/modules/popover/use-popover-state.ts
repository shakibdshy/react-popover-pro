"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useHover } from "./use-hover";
import { useAutoPlacement } from "./use-auto-placement";
import { usePopoverContext } from "./popover-context";
import { PopoverContextValue, Position, PopoverPlacement, TriggerMode, VirtualElement } from "./popover-types";
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

  const updatePosition = useCallback(() => {
    const newPosition = calculatePosition();
    const finalPosition = applyMiddleware(newPosition, middleware);
    setPosition(finalPosition);
    onPositionChange?.(finalPosition);
  }, [calculatePosition, middleware, onPositionChange]);

  const rafId = useRef(0);
  const lastUpdate = useRef(0);
  const THROTTLE_MS = 16; // Approximately 60fps

  const handlePositionUpdate = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdate.current >= THROTTLE_MS) {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updatePosition();
        lastUpdate.current = now;
      });
    }
  }, [updatePosition]);

  const handleOpenChange = useCallback(
    (newIsOpen: boolean) => {
      if (!isControlled) {
        if (newIsOpen) {
          // When opening, first calculate position, then set open state
          updatePosition();
          // Use requestAnimationFrame to ensure position is calculated before becoming visible
          requestAnimationFrame(() => {
            setUncontrolledOpen(true);
          });
        } else {
          setUncontrolledOpen(false);
        }
      }
      onOpenChange?.(newIsOpen);
      if (newIsOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [isControlled, onOpenChange, onOpen, onClose, updatePosition]
  );

  // Initial position and dependency changes
  useEffect(() => {
    if (isOpen) {
      // Calculate position immediately when popover opens
      updatePosition();
      // Also schedule another update on next frame to ensure correct positioning
      requestAnimationFrame(updatePosition);
    }
  }, [isOpen, placement, offset, updatePosition]);

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nested, handleOpenChange]);

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

  const autoPlacementEnabled = autoPlacement && !nested;
  const resolvedPlacement = useAutoPlacement(
    triggerRef as React.RefObject<HTMLElement>,
    contentRef as React.RefObject<HTMLElement>,
    placement,
    boundaryElement,
    autoPlacementEnabled
  );

  return useMemo(
    () => ({
      isOpen: shouldOpen,
      triggerRef,
      contentRef,
      position,
      placement: resolvedPlacement,
      setIsOpen: handleOpenChange,
      setPosition,
      updatePosition,
      // Animation
      animate,
      animationDuration,
      animationTiming,
      // Accessibility
      id,
      role,
      "aria-label": ariaLabel,
      // Focus management
      autoFocus,
      returnFocus,
      // Virtual element
      virtualRef,
      // Nesting support
      parentId: nested ? parentContext.id : undefined,
      parentContext: parentContext,
      parentChain,
      nested,
      // Trigger mode
      triggerMode,
      // Portal
      usePortal,
    }),
    [
      shouldOpen,
      position,
      resolvedPlacement,
      handleOpenChange,
      updatePosition,
      animate,
      animationDuration,
      animationTiming,
      id,
      role,
      ariaLabel,
      autoFocus,
      returnFocus,
      virtualRef,
      nested,
      parentContext,
      parentChain,
      triggerMode,
      usePortal,
    ]
  );
}; 