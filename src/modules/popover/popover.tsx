"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  Position,
} from "./popover-types";
import { PopoverProvider, usePopoverContext } from "./popover-context";
import { usePopoverPosition } from "./use-popover-position";
import { useFocusManagement } from "./use-focus-management";
import { useAnimation } from "./use-animation";
import { applyMiddleware } from "./middleware";

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = "bottom",
  offset = 8,
  defaultOpen = false,
  open,
  onOpenChange,
  // Accessibility
  id,
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
}) => {
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

    let rafId: number;
    let lastUpdate = 0;
    const THROTTLE_MS = 16; // Approximately 60fps

    const handlePositionUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_MS) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updatePosition();
          lastUpdate = now;
        });
      }
    };

    // Initial position update
    handlePositionUpdate();

    window.addEventListener("scroll", handlePositionUpdate, { passive: true });
    window.addEventListener("resize", handlePositionUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", handlePositionUpdate);
      window.removeEventListener("resize", handlePositionUpdate);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, updatePosition]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

  const contextValue = useMemo(
    () => ({
      isOpen,
      triggerRef,
      contentRef,
      position,
      placement,
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
    }),
    [
      isOpen,
      position,
      placement,
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
    ]
  );

  return <PopoverProvider value={contextValue}>{children}</PopoverProvider>;
};

export const PopoverTrigger = React.memo<PopoverTriggerProps>(
  ({ children, asChild = false, disabled = false }) => {
    const { triggerRef, setIsOpen, isOpen } = usePopoverContext();

    const handleClick = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
    };

    if (asChild && React.isValidElement(children)) {
      const childProps = {
        ref: triggerRef,
        onClick: handleClick,
        "aria-expanded": isOpen,
        "aria-haspopup": true,
        disabled,
      };
      return React.cloneElement(children, childProps);
    }

    return (
      <div
        ref={triggerRef}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-haspopup={true}
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
    } = usePopoverContext();

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
      zIndex: 1000,
      ...(animateOverride ?? animate ? animationStyles : {}),
    };

    if (asChild && React.isValidElement(children)) {
      const childProps = {
        ref: contentRef,
        style: {
          ...defaultStyles,
          ...children.props.style,
        },
        id,
        role: roleOverride || role,
        "aria-label": ariaLabelOverride || ariaLabel,
        tabIndex: -1,
      };
      return createPortal(
        React.cloneElement(children, childProps),
        document.body
      );
    }

    return createPortal(
      <div
        ref={contentRef}
        style={defaultStyles}
        className={className}
        id={id}
        role={roleOverride || role}
        aria-label={ariaLabelOverride || ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>,
      document.body
    );
  }
);

PopoverContent.displayName = "PopoverContent";
