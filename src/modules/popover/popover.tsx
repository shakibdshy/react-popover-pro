"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback, RefObject } from "react";
import { createPortal } from "react-dom";
import {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  Position,
  PopoverContextValue,
} from "./popover-types";
import { PopoverProvider, usePopoverContext } from "./popover-context";
import { usePopoverPosition } from "./use-popover-position";
import { useFocusManagement } from "./use-focus-management";
import { useAnimation } from "./use-animation";
import { applyMiddleware } from "./middleware";
import { useHover } from "./use-hover";
import { useAutoPlacement } from "./use-auto-placement";

class PopoverErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Popover error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the popover.</div>;
    }

    return this.props.children;
  }
}

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
}) => {
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

  const handleOpenChange = useCallback((newIsOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newIsOpen);
    }
    onOpenChange?.(newIsOpen);
    if (newIsOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isControlled, onOpenChange, onOpen, onClose]);

  // Initial position and dependency changes
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(updatePosition);
    }
  }, [isOpen, placement, offset, updatePosition]);

  // Scroll and resize handlers
  useEffect(() => {
    if (!isOpen) return;

    // Initial position update
    handlePositionUpdate();

    window.addEventListener("scroll", handlePositionUpdate, { passive: true });
    window.addEventListener("resize", handlePositionUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", handlePositionUpdate);
      window.removeEventListener("resize", handlePositionUpdate);
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
          const nextPopover = contentRef.current?.querySelector('[data-popover-trigger]') as HTMLElement;
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
      return !parent || getComputedStyle(parent).display === 'none';
    });

    if (shouldClose) {
      handleOpenChange(false);
    }
  }, [nested, isOpen, parentChain, handleOpenChange]);

  const isHovering = useHover(triggerRef as RefObject<HTMLElement>, openDelay, closeDelay);
  const shouldOpen = triggerMode === "hover" ? isHovering : isOpen;

  const autoPlacementEnabled = autoPlacement && !nested;
  const resolvedPlacement = useAutoPlacement(
    triggerRef as RefObject<HTMLElement>,
    contentRef as RefObject<HTMLElement>,
    placement,
    boundaryElement,
    autoPlacementEnabled
  );

  const contextValue = useMemo(
    () => ({
      isOpen: shouldOpen,
      triggerRef,
      contentRef,
      position,
      placement: resolvedPlacement,
      setIsOpen: handleOpenChange,
      setPosition,
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
    }),
    [
      shouldOpen,
      position,
      resolvedPlacement,
      handleOpenChange,
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
    ]
  );

  return (
    <PopoverErrorBoundary>
      <PopoverProvider value={contextValue}>{children}</PopoverProvider>
    </PopoverErrorBoundary>
  );
};

export const PopoverTrigger = React.memo<PopoverTriggerProps>(
  ({ children, asChild = false, disabled = false }) => {
    const context = usePopoverContext();
    if (!context) {
      throw new Error('PopoverTrigger must be used within a Popover');
    }

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "click") {
        context.setIsOpen(!context.isOpen);
      }
    };

    const handleMouseEnter = () => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.setIsOpen(true);
      }
    };

    const handleMouseLeave = () => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.setIsOpen(false);
      }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "context-menu") {
        context.setIsOpen(!context.isOpen);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const childProps = {
        ref: context.triggerRef,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onContextMenu: handleContextMenu,
        "aria-expanded": context.isOpen,
        "aria-haspopup": true,
        "data-popover-trigger": true,
        disabled,
      };
      return React.cloneElement(children, childProps);
    }

    return (
      <div
        ref={context.triggerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        aria-expanded={context.isOpen}
        aria-haspopup={true}
        data-popover-trigger={true}
      >
        {children}
      </div>
    );
  }
);

PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.memo<PopoverContentProps>(
  ({
    children,
    className = "",
    asChild = false,
    // Animation overrides
    animate: animateOverride,
    animationDuration: durationOverride,
    animationTiming: timingOverride,
    // Accessibility
    role: roleOverride,
    "aria-label": ariaLabelOverride,
  }) => {
    const context = usePopoverContext();
    if (!context) {
      throw new Error('PopoverContent must be used within a Popover');
    }

    const {
      isOpen,
      contentRef,
      position,
      id,
      role,
      "aria-label": ariaLabel,
      animate,
      animationDuration,
      animationTiming,
      autoFocus,
      returnFocus,
      parentChain,
    } = context;

    useFocusManagement(isOpen, contentRef, autoFocus, returnFocus);

    const { shouldRender, styles: animationStyles } = useAnimation(
      isOpen,
      durationOverride || animationDuration,
      timingOverride || animationTiming
    );

    if (!shouldRender) return null;

    const defaultStyles = {
      position: "fixed" as const,
      top: position.y,
      left: position.x,
      margin: 0,
      transform: "none",
      zIndex: 1000 + parentChain.length,
      ...(animateOverride ?? animate ? animationStyles : {}),
    };

    const handleContentClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const contentProps = {
      ref: contentRef,
      style: defaultStyles,
      className,
      id,
      role: roleOverride || role,
      "aria-label": ariaLabelOverride || ariaLabel,
      tabIndex: -1,
      onClick: handleContentClick,
      onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
      onMouseUp: (e: React.MouseEvent) => e.stopPropagation(),
    };

    if (asChild && React.isValidElement(children)) {
      return createPortal(
        React.cloneElement(children, {
          ...contentProps,
          style: {
            ...defaultStyles,
            ...children.props.style,
          },
        }),
        document.body
      );
    }

    return createPortal(
      <div {...contentProps}>{children}</div>,
      document.body
    );
  }
);

PopoverContent.displayName = "PopoverContent";
