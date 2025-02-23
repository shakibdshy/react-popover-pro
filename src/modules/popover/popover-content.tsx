"use client";

import React from "react";
import { createPortal } from "react-dom";
import { PopoverContentProps } from "./popover-types";
import { usePopoverContext } from "./popover-context";
import { useFocusManagement } from "./use-focus-management";
import { useAnimation } from "./use-animation";

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
      throw new Error("PopoverContent must be used within a Popover");
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
      usePortal,
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

    const content = asChild && React.isValidElement(children) ? (
      React.cloneElement(children, {
        ...contentProps,
        style: {
          ...defaultStyles,
          ...children.props.style,
        },
      })
    ) : (
      <div {...contentProps}>{children}</div>
    );

    return usePortal ? createPortal(content, document.body) : content;
  }
);

PopoverContent.displayName = "PopoverContent"; 