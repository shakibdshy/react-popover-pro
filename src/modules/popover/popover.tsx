"use client";

/**
 * @module Popover
 * @description Main popover component that serves as the container for the popover system.
 * 
 * The Popover component is the main container that:
 * - Manages the state of the popover (open/closed)
 * - Provides context to child components
 * - Handles positioning, animations, and accessibility
 * - Coordinates between trigger and content components
 * 
 * It uses the compound component pattern, requiring PopoverTrigger and PopoverContent
 * as children to function properly.
 */

import React from "react";
import { PopoverProps } from "./popover-types";
import { PopoverProvider } from "./popover-context";
import { PopoverErrorBoundary } from "./popover-error-boundary";
import { usePopoverState } from "./use-popover-state";

/**
 * Main Popover component that serves as the container for the popover system.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (should include PopoverTrigger and PopoverContent)
 * @param {PopoverPlacement} [props.placement='bottom'] - Preferred placement of the popover
 * @param {number} [props.offset=8] - Distance between the popover and its trigger in pixels
 * @param {boolean} [props.defaultOpen=false] - Whether the popover is open by default (uncontrolled)
 * @param {boolean} [props.open] - Controlled open state
 * @param {Function} [props.onOpenChange] - Callback when open state changes
 * @param {string} [props.id] - Custom ID for the popover
 * @param {string} [props.role='dialog'] - ARIA role attribute
 * @param {string} [props.aria-label] - ARIA label attribute
 * @param {boolean} [props.animate=true] - Whether animations are enabled
 * @param {number} [props.animationDuration=200] - Duration of animations in milliseconds
 * @param {string} [props.animationTiming='ease'] - Timing function for animations
 * @param {AnimationEffect} [props.animationEffect='fade'] - Animation effect to use
 * @param {Function} [props.onOpen] - Callback when popover opens
 * @param {Function} [props.onClose] - Callback when popover closes
 * @param {Function} [props.onPositionChange] - Callback when position changes
 * @param {VirtualElement} [props.virtualRef] - Optional virtual element reference
 * @param {Middleware[]} [props.middleware=[]] - Middleware functions for position adjustment
 * @param {boolean} [props.autoFocus=true] - Whether to auto-focus the popover when opened
 * @param {boolean} [props.returnFocus=true] - Whether to return focus to the trigger when closed
 * @param {TriggerMode} [props.triggerMode='click'] - How the popover is triggered
 * @param {number} [props.openDelay=0] - Delay before opening in milliseconds (for hover mode)
 * @param {number} [props.closeDelay=0] - Delay before closing in milliseconds (for hover mode)
 * @param {boolean} [props.autoPlacement=true] - Whether to automatically adjust placement to fit viewport
 * @param {HTMLElement} [props.boundaryElement=null] - Element to use as boundary for positioning
 * @param {HTMLElement} [props.portalTarget] - Target element for portal rendering
 * @param {boolean} [props.portal=true] - Whether to render in a portal
 * @param {boolean} [props.arrow=false] - Whether to show an arrow
 * @param {string} [props.variant] - Visual variant/style of the popover
 * @returns {React.ReactElement} The rendered popover component
 */
export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = "bottom",
  offset = 8,
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
  portalTarget,
  portal = true,
  arrow = false,
  variant,
}) => {
  /**
   * Initialize popover state using the custom hook
   */
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
    portalTarget,
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
