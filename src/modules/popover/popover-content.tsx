"use client";

import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
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
      position,
      triggerRef,
      updatePosition
    } = context;
    
    // Track if position has been calculated
    const [positionCalculated, setPositionCalculated] = useState(false);
    const initialPositionRef = useRef(false);
    
    useFocusManagement(isOpen, contentRef, autoFocus, returnFocus);

    const { shouldRender, styles: animationStyles } = useAnimation(
      isOpen,
      durationOverride || animationDuration,
      timingOverride || animationTiming
    );

    // Calculate position immediately when component mounts or isOpen changes
    useLayoutEffect(() => {
      if (!isOpen || !triggerRef.current) {
        initialPositionRef.current = false;
        return;
      }
      
      // Calculate position immediately
      updatePosition();
      
      // Mark that we've done the initial position calculation
      initialPositionRef.current = true;
      
      // Set a small timeout to ensure position calculation completes
      const timer = setTimeout(() => {
        setPositionCalculated(true);
      }, 10);
      
      return () => clearTimeout(timer);
    }, [isOpen, triggerRef, updatePosition]);

    // Reset position calculated state when popover closes
    useEffect(() => {
      if (!isOpen) {
        setPositionCalculated(false);
        initialPositionRef.current = false;
      }
    }, [isOpen]);

    // Update position on resize and scroll
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;
      
      const handleResize = () => {
        updatePosition();
      };
      
      const handleScroll = () => {
        updatePosition();
      };
      
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }, [isOpen, triggerRef, updatePosition]);

    // Don't render until animation says we should and position is calculated
    // But if we've already done the initial position calculation, we can render
    if (!shouldRender || (isOpen && !positionCalculated && !initialPositionRef.current)) return null;

    const defaultStyles = {
      position: "absolute" as const,
      top: position.y,
      left: position.x,
      margin: 0,
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
      "data-popover-content": "true",
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