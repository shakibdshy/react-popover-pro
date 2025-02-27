"use client";

import React from "react";
import { PopoverProps } from "./popover-types";
import { PopoverProvider } from "./popover-context";
import { PopoverErrorBoundary } from "./popover-error-boundary";
import { usePopoverState } from "./use-popover-state";

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = "bottom",
  offset = 16,
  defaultOpen = false,
  open,
  onOpenChange,
  id = `popover-${Math.random().toString(36).substring(2, 11)}`,
  role = "dialog",
  "aria-label": ariaLabel,
  animate = true,
  animationDuration = 200,
  animationTiming = "ease",
  animationEffect = "fade",
  onOpen,
  onClose,
  onPositionChange,
  virtualRef,
  middleware = [],
  autoFocus = true,
  returnFocus = true,
  triggerMode = "click",
  openDelay = 0,
  closeDelay = 0,
  autoPlacement = true,
  boundaryElement = null,
  portal = true,
  arrow = false,
  variant,
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
    animationEffect,
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
    portal,
    arrow,
    variant,
  });

  return (
    <PopoverErrorBoundary>
      <PopoverProvider value={popoverState}>{children}</PopoverProvider>
    </PopoverErrorBoundary>
  );
};

export * from "./popover-trigger";
export * from "./popover-content";
