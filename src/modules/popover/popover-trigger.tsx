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
    const isScaleAnimation = (context.animationEffect || "fade").startsWith("scale");

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
                
                // For scale animations, do one more update
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
            // With animation, use requestAnimationFrame to ensure position is calculated before showing
            requestAnimationFrame(() => {
              // Set open state
              context.setIsOpen(true);
              
              // Schedule position updates to ensure correct positioning
              if (!positionUpdateRef.current) {
                positionUpdateRef.current = true;
                
                // For scale animations, we need more position updates
                if (isScaleAnimation) {
                  // First update
                  requestAnimationFrame(() => {
                    context.updatePosition();
                    
                    // Second update after a small delay
                    setTimeout(() => {
                      context.updatePosition();
                      
                      // Third update for good measure
                      setTimeout(() => {
                        context.updatePosition();
                        positionUpdateRef.current = false;
                      }, 20);
                    }, 20);
                  });
                } else {
                  // For non-scale animations, a single update is sufficient
                  requestAnimationFrame(() => {
                    context.updatePosition();
                    positionUpdateRef.current = false;
                  });
                }
              }
            });
          }
        } else {
          // Closing the popover - just set state
          context.setIsOpen(false);
        }
      }
    }, [context, disabled, isScaleAnimation]);

    const handleMouseEnter = useCallback(() => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        // Calculate position before opening
        context.updatePosition();
        
        // Set open state
        context.setIsOpen(true);
        
        // For scale animations, schedule additional position updates
        if (isScaleAnimation && !positionUpdateRef.current) {
          positionUpdateRef.current = true;
          
          // Schedule multiple position updates for scale animations
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

    const handleMouseLeave = useCallback(() => {
      if (disabled) return;
      if (context.triggerMode === "hover") {
        context.setIsOpen(false);
        positionUpdateRef.current = false;
      }
    }, [context, disabled]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (context.triggerMode === "context-menu") {
        // Calculate position before opening
        context.updatePosition();
        
        if (!context.isOpen) {
          // Set open state
          context.setIsOpen(true);
          
          // For scale animations, schedule additional position updates
          if (isScaleAnimation && !positionUpdateRef.current) {
            positionUpdateRef.current = true;
            
            // Schedule multiple position updates for scale animations
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