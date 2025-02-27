"use client";

import React, { useCallback, useRef } from "react";
import { PopoverTriggerProps } from "./popover-types";
import { usePopoverContext } from "./popover-context";

export const PopoverTrigger = React.memo<PopoverTriggerProps>(
  ({ children, asChild = false, disabled = false }) => {
    const context = usePopoverContext();
    if (!context) {
      throw new Error("PopoverTrigger must be used within a Popover");
    }

    const positionUpdateRef = useRef(false);

    const handleClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "click") {
        if (!context.isOpen) {
          // First calculate position before opening
          context.updatePosition();
          
          // If animation is disabled, we need to ensure position is calculated before showing
          if (!context.animate) {
            // Set open state
            context.setIsOpen(true);
            
            // Schedule a single position update to ensure correct positioning
            if (!positionUpdateRef.current) {
              positionUpdateRef.current = true;
              requestAnimationFrame(() => {
                context.updatePosition();
                positionUpdateRef.current = false;
              });
            }
          } else {
            // With animation, use requestAnimationFrame to ensure position is calculated before showing
            requestAnimationFrame(() => {
              // Set open state
              context.setIsOpen(true);
              
              // Schedule a single position update to ensure correct positioning
              if (!positionUpdateRef.current) {
                positionUpdateRef.current = true;
                requestAnimationFrame(() => {
                  context.updatePosition();
                  positionUpdateRef.current = false;
                });
              }
            });
          }
        } else {
          // Closing the popover - just set state
          context.setIsOpen(false);
        }
      }
    }, [context, disabled]);

    const handleMouseEnter = useCallback(() => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.updatePosition();
        context.setIsOpen(true);
      }
    }, [context, disabled]);

    const handleMouseLeave = useCallback(() => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.setIsOpen(false);
      }
    }, [context, disabled]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "context-menu") {
        context.updatePosition();
        context.setIsOpen(!context.isOpen);
      }
    }, [context, disabled]);

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