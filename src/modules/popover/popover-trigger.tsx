"use client";

/**
 * @module PopoverTrigger
 * @description A component that serves as the trigger element for a popover.
 * 
 * The PopoverTrigger component is responsible for:
 * - Handling user interactions (click, hover, context menu) to show/hide the popover
 * - Managing position calculations before showing the popover
 * - Providing proper accessibility attributes
 * - Supporting different trigger modes (click, hover, context-menu)
 * - Handling disabled state
 * 
 * This component must be used within a Popover component as it relies on context from the parent.
 */

import React, { useCallback, useRef } from "react";
import { PopoverTriggerProps } from "./popover-types";
import { usePopoverContext } from "./popover-context";

/**
 * PopoverTrigger component that controls the display of a popover based on user interactions.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The trigger element content
 * @param {boolean} [props.asChild=false] - Whether to merge props onto the child element
 * @param {boolean} [props.disabled=false] - Whether the trigger is disabled
 * @returns {React.ReactElement} The rendered trigger element
 * @throws {Error} Throws an error if used outside of a Popover component
 */
export const PopoverTrigger = React.memo<PopoverTriggerProps>(
  ({ children, asChild = false, disabled = false }) => {
    const context = usePopoverContext();
    if (!context) {
      throw new Error("PopoverTrigger must be used within a Popover");
    }

    const positionUpdateRef = useRef(false);
    const isScaleAnimation = (context.animationEffect || "fade").startsWith("scale");

    /**
     * Handles click events on the trigger element.
     * For click trigger mode, toggles the popover open/closed state.
     * 
     * When opening:
     * 1. Calculates position before opening
     * 2. Sets open state
     * 3. Schedules position updates based on animation settings
     * 4. For scale animations, performs multiple position updates to ensure correct positioning
     * 
     * @param {React.MouseEvent} e - The click event
     */
    const handleClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "click") {
        if (!context.isOpen) {
          context.updatePosition();
          
          if (!context.animate) {
            context.setIsOpen(true);
            
            if (!positionUpdateRef.current) {
              positionUpdateRef.current = true;
              requestAnimationFrame(() => {
                context.updatePosition();
                
                if (isScaleAnimation) {
                  setTimeout(() => {
                    context.updatePosition();
                    positionUpdateRef.current = false;
                  }, 20);
                } else {
                  positionUpdateRef.current = false;
                }
              });
            }
          } else {
            requestAnimationFrame(() => {
              context.setIsOpen(true);
              
              if (!positionUpdateRef.current) {
                positionUpdateRef.current = true;
                
                if (isScaleAnimation) {
                  requestAnimationFrame(() => {
                    context.updatePosition();
                    
                    setTimeout(() => {
                      context.updatePosition();
                      
                      setTimeout(() => {
                        context.updatePosition();
                        positionUpdateRef.current = false;
                      }, 20);
                    }, 20);
                  });
                } else {
                  requestAnimationFrame(() => {
                    context.updatePosition();
                    positionUpdateRef.current = false;
                  });
                }
              }
            });
          }
        } else {
          context.setIsOpen(false);
        }
      }
    }, [context, disabled, isScaleAnimation]);

    /**
     * Handles mouse enter events on the trigger element.
     * For hover trigger mode, opens the popover.
     * 
     * Process:
     * 1. Calculates position before opening
     * 2. Sets open state
     * 3. For scale animations, schedules multiple position updates to ensure correct positioning
     */
    const handleMouseEnter = useCallback(() => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.updatePosition();
        
        context.setIsOpen(true);
        
        if (isScaleAnimation && !positionUpdateRef.current) {
          positionUpdateRef.current = true;
          
          requestAnimationFrame(() => {
            context.updatePosition();
            
            setTimeout(() => {
              context.updatePosition();
              
              setTimeout(() => {
                context.updatePosition();
                positionUpdateRef.current = false;
              }, 20);
            }, 20);
          });
        }
      }
    }, [context, disabled, isScaleAnimation]);

    /**
     * Handles mouse leave events on the trigger element.
     * For hover trigger mode, closes the popover and resets position update tracking.
     */
    const handleMouseLeave = useCallback(() => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.setIsOpen(false);
        positionUpdateRef.current = false;
      }
    }, [context, disabled]);

    /**
     * Handles context menu events on the trigger element.
     * For context-menu trigger mode, toggles the popover open/closed state.
     * 
     * When opening:
     * 1. Calculates position before opening
     * 2. Sets open state
     * 3. For scale animations, schedules multiple position updates to ensure correct positioning
     * 
     * @param {React.MouseEvent} e - The context menu event
     */
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "context-menu") {
        context.updatePosition();
        
        if (!context.isOpen) {
          context.setIsOpen(true);
          
          if (isScaleAnimation && !positionUpdateRef.current) {
            positionUpdateRef.current = true;
            
            requestAnimationFrame(() => {
              context.updatePosition();
              
              setTimeout(() => {
                context.updatePosition();
                
                setTimeout(() => {
                  context.updatePosition();
                  positionUpdateRef.current = false;
                }, 20);
              }, 20);
            });
          }
        } else {
          context.setIsOpen(false);
        }
      }
    }, [context, disabled, isScaleAnimation]);

    /**
     * If asChild is true and children is a valid element, merge props onto the child.
     * Otherwise, wrap children in a div with the necessary props.
     */
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