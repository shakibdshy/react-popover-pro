"use client";

import React from 'react';
import { Popover } from './popover';
import { PopoverContent } from './popover-content';
import { PopoverTrigger } from './popover-trigger';
import { PopoverPlacement } from './popover-types';
import './tooltip.css';

export interface TooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  /**
   * The placement of the tooltip
   * @default 'top'
   */
  placement?: PopoverPlacement;
  /**
   * The delay before showing the tooltip (in ms)
   * @default 0
   */
  openDelay?: number;
  /**
   * The delay before hiding the tooltip (in ms)
   * @default 0
   */
  closeDelay?: number;
  /**
   * The offset from the trigger element (in px)
   * @default 8
   */
  offset?: number;
  /**
   * Whether to show an arrow pointing to the trigger
   * @default true
   */
  arrow?: boolean;
  /**
   * The maximum width of the tooltip
   * @default 'none'
   */
  maxWidth?: string | number;
  /**
   * Additional class name for the tooltip
   */
  className?: string;
  /**
   * Whether to use the child as the trigger
   * @default false
   */
  asChild?: boolean;
  /**
   * Custom background color for the tooltip
   */
  backgroundColor?: string;
  /**
   * Color variant of the tooltip
   * @default undefined
   */
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  openDelay = 0,
  closeDelay = 0,
  offset = 8,
  arrow = true,
  maxWidth = 'none',
  className = '',
  asChild = false,
  backgroundColor,
  variant,
}) => {
  // Determine the variant class
  const variantClass = variant ? `tooltip-${variant}` : '';
  
  // Create the tooltip content
  const tooltipContent = (
    <div 
      className={`tooltip-content ${className} ${variantClass}`}
      style={{
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        ...(backgroundColor ? { backgroundColor, borderColor: backgroundColor } : {}),
      }}
      data-popover-content="true"
    >
      {content}
      {arrow && (
        <div 
          className="tooltip-arrow" 
          style={backgroundColor ? {
            background: backgroundColor,
          } : {}}
          data-placement={placement}
        />
      )}
    </div>
  );

  return (
    <Popover
      placement={placement}
      offset={offset}
      triggerMode="hover"
      openDelay={openDelay}
      closeDelay={closeDelay}
      animate={true}
      animationDuration={150}
      animationTiming="ease"
      arrow={arrow}
      variant={variant}
    >
      <PopoverTrigger asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={`tooltip ${variantClass}`}
        asChild={true}
        arrow={arrow}
        variant={variant}
      >
        {tooltipContent}
      </PopoverContent>
    </Popover>
  );
}; 