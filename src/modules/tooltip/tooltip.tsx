"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { TooltipProps } from "./tooltip-types";

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  offset = 8,
  defaultOpen = false,
  open,
  onOpenChange,
  role = "tooltip",
  "aria-label": ariaLabel,
  animate = true,
  animationDuration = 200,
  animationTiming = "ease",
  animationEffect = "fade",
  onOpen,
  onClose,
  virtualRef,
  autoFocus = false,
  returnFocus = true,
  openDelay = 200,
  closeDelay = 150,
  portalTarget,
  portal = true,
  arrow = true,
  variant = "primary",
  autoPlacement = true,
  flip = false,
  maxWidth = 250,
  className,
}) => {
  return (
    <Popover
      placement={placement}
      offset={offset}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      virtualRef={virtualRef}
      role={role}
      aria-label={ariaLabel}
      animate={animate}
      animationDuration={animationDuration}
      animationTiming={animationTiming}
      animationEffect={animationEffect}
      onOpen={onOpen}
      onClose={onClose}
      autoFocus={autoFocus}
      returnFocus={returnFocus}
      triggerMode="hover"
      openDelay={openDelay}
      closeDelay={closeDelay}
      portalTarget={portalTarget}
      portal={portal}
      arrow={arrow}
      variant={variant}
      autoPlacement={autoPlacement}
      flip={flip}
    >
      <PopoverTrigger asChild>
        {React.isValidElement(children) ? children : <span>{children}</span>}
      </PopoverTrigger>
      <PopoverContent 
        className={`tooltip-content ${className || ''}`}
        maxWidth={maxWidth}
        aria-label={ariaLabel}
        role={role}
        arrow={arrow}
        variant={variant}
      >
        {typeof content === 'string' ? <div>{content}</div> : content}
      </PopoverContent>
    </Popover>
  );
}; 