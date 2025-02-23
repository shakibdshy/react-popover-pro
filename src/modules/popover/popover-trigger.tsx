"use client";

import React from "react";
import { PopoverTriggerProps } from "./popover-types";
import { usePopoverContext } from "./popover-context";

export const PopoverTrigger = React.memo<PopoverTriggerProps>(
  ({ children, asChild = false, disabled = false }) => {
    const context = usePopoverContext();
    if (!context) {
      throw new Error("PopoverTrigger must be used within a Popover");
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