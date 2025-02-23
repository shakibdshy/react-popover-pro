"use client";

import React from "react";
import { PopoverProps } from "./popover-types";
import { PopoverProvider } from "./popover-context";
import { PopoverErrorBoundary } from "./popover-error-boundary";
import { usePopoverState } from "./use-popover-state";

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = "bottom",
  offset = 8,
  defaultOpen = false,
  open,
  onOpenChange,
  // Accessibility
  id = `popover-${Math.random().toString(36).substr(2, 9)}`,
  role = "dialog",
  "aria-label": ariaLabel,
  // Animation
  animate = true,
  animationDuration = 200,
  animationTiming = "ease",
  // Events
  onOpen,
  onClose,
  onPositionChange,
  // Advanced features
  virtualRef,
  middleware = [],
  // Focus management
  autoFocus = true,
  returnFocus = true,
  // New features
  triggerMode = "click",
  openDelay = 0,
  closeDelay = 0,
  // Auto placement
  autoPlacement = false,
  boundaryElement = null,
  // Portal
  usePortal = true,
}) => {
  const popoverState = usePopoverState({
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
  });

  return (
    <PopoverErrorBoundary>
      <PopoverProvider value={popoverState}>{children}</PopoverProvider>
    </PopoverErrorBoundary>
  );
};

export * from "./popover-trigger";
export * from "./popover-content";
