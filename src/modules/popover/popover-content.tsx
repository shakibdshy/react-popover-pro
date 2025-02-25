"use client";

import React, { useEffect } from "react";
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
      setPosition,
      triggerRef
    } = context;
    
    useFocusManagement(isOpen, contentRef, autoFocus, returnFocus);

    const { shouldRender, styles: animationStyles } = useAnimation(
      isOpen,
      durationOverride || animationDuration,
      timingOverride || animationTiming
    );

    // Update position when scrolling or resizing
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;
      
      // Store initial position relative to document
      const initialPosition = { ...position };
      const initialScroll = { x: window.scrollX, y: window.scrollY };
      
      const updatePosition = () => {
        if (!triggerRef.current) return;
        
        // Calculate scroll delta
        const scrollDeltaX = window.scrollX - initialScroll.x;
        const scrollDeltaY = window.scrollY - initialScroll.y;
        
        // Update position to keep it relative to the initial position
        setPosition({
          x: initialPosition.x + scrollDeltaX,
          y: initialPosition.y + scrollDeltaY
        });
      };
      
      // Set up event listeners for scroll and resize
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }, [isOpen, triggerRef, position, setPosition]);

    // Don't render until animation says we should
    if (!shouldRender) return null;

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