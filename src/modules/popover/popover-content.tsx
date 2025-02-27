"use client";

import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { PopoverContentProps, PopoverPlacement } from "./popover-types";
import { usePopoverContext } from "./popover-context";
import { useFocusManagement } from "./use-focus-management";
import { useAnimation } from "./use-animation";
import "./popover.css";

export const PopoverContent = React.memo<PopoverContentProps>(
  ({
    children,
    className = "",
    asChild = false,
    // Animation overrides
    animate: animateOverride,
    animationDuration: durationOverride,
    animationTiming: timingOverride,
    animationEffect: effectOverride,
    // Accessibility
    role: roleOverride,
    "aria-label": ariaLabelOverride,
    // Arrow
    arrow = false,
    // Variant
    variant,
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
      animationEffect,
      autoFocus,
      returnFocus,
      parentChain,
      usePortal,
      position,
      triggerRef,
      updatePosition,
      placement,
      arrow: contextArrow,
      variant: contextVariant,
    } = context;

    // Track if position has been calculated
    const [positionCalculated, setPositionCalculated] = useState(false);
    const initialPositionRef = useRef(false);
    const [actualPlacement, setActualPlacement] = useState(placement);
    const positionUpdateRef = useRef(false);
    const positionUpdateCountRef = useRef(0);
    
    // Determine if we're using a scale animation
    const currentEffect = effectOverride || animationEffect || "fade";
    const isScaleAnimation = currentEffect.startsWith("scale");
    
    // Create a custom ref that will update position when the element is mounted
    const setContentRef = useCallback((node: HTMLDivElement | null) => {
      // Set the ref
      contentRef.current = node;
      
      // If node exists and popover is open, update position
      if (node && isOpen && !positionUpdateRef.current) {
        positionUpdateRef.current = true;
        
        // For scale animations, we need more position updates to ensure correct positioning
        if (isScaleAnimation) {
          // Update position immediately
          updatePosition();
          positionUpdateCountRef.current = 1;
          
          // Update again in the next frame
          requestAnimationFrame(() => {
            updatePosition();
            positionUpdateCountRef.current = 2;
            
            // And again after a small delay to ensure correct positioning
            setTimeout(() => {
              updatePosition();
              positionUpdateCountRef.current = 3;
              
              // One more update for good measure with scale animations
              setTimeout(() => {
                updatePosition();
                positionUpdateCountRef.current = 4;
                setPositionCalculated(true);
                positionUpdateRef.current = false;
              }, 20);
            }, 20);
          });
        } else {
          // For non-scale animations, the standard approach works fine
          updatePosition();
          
          // And again after a small delay
          setTimeout(() => {
            updatePosition();
            setPositionCalculated(true);
            positionUpdateRef.current = false;
          }, 10);
        }
      }
    }, [contentRef, isOpen, updatePosition, isScaleAnimation]);

    // Use arrow from props or context
    const showArrow = arrow || contextArrow;

    useFocusManagement(isOpen, contentRef, autoFocus, returnFocus);

    const { shouldRender, styles: animationStyles, transformOrigin } = useAnimation(
      isOpen,
      durationOverride || animationDuration,
      timingOverride || animationTiming,
      currentEffect,
      actualPlacement
    );

    // Calculate position immediately when component mounts or isOpen changes
    useLayoutEffect(() => {
      if (!isOpen || !triggerRef.current) {
        initialPositionRef.current = false;
        return;
      }
      
      if (!initialPositionRef.current) {
        // Calculate position immediately
        updatePosition();
        
        // Mark that we've done the initial position calculation
        initialPositionRef.current = true;
        
        // For scale animations, we need more position updates
        const delay = isScaleAnimation ? 30 : 20;
        
        // Set a small timeout to ensure position calculation completes
        const timer = setTimeout(() => {
          updatePosition(); // Calculate position one more time
          
          // For scale animations, do more updates
          if (isScaleAnimation) {
            setTimeout(() => {
              updatePosition();
              
              // One more update for scale animations
              setTimeout(() => {
                updatePosition();
                setPositionCalculated(true);
              }, 20);
            }, 20);
          } else {
            setPositionCalculated(true);
          }
        }, delay);
        
        return () => {
          clearTimeout(timer);
        };
      }
    }, [isOpen, triggerRef, updatePosition, isScaleAnimation]);
    
    // Add a resize observer to update position when content size changes
    useEffect(() => {
      if (!isOpen || !contentRef.current) return;
      
      const resizeObserver = new ResizeObserver(() => {
        if (!positionUpdateRef.current) {
          positionUpdateRef.current = true;
          updatePosition();
          setTimeout(() => {
            positionUpdateRef.current = false;
          }, 50);
        }
      });
      
      resizeObserver.observe(contentRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }, [isOpen, contentRef, updatePosition]);

    // Reset position calculated state when popover closes
    useEffect(() => {
      if (!isOpen) {
        setPositionCalculated(false);
        initialPositionRef.current = false;
        positionUpdateRef.current = false;
        positionUpdateCountRef.current = 0;
      }
    }, [isOpen]);

    // Update position on resize and scroll
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;

      const handleResize = () => {
        if (!positionUpdateRef.current) {
          positionUpdateRef.current = true;
          updatePosition();
          setTimeout(() => {
            positionUpdateRef.current = false;
          }, 50);
        }
      };

      const handleScroll = () => {
        if (!positionUpdateRef.current) {
          positionUpdateRef.current = true;
          updatePosition();
          setTimeout(() => {
            positionUpdateRef.current = false;
          }, 50);
        }
      };

      window.addEventListener("resize", handleResize, { passive: true });
      window.addEventListener("scroll", handleScroll, {
        passive: true,
        capture: true,
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [isOpen, triggerRef, updatePosition]);

    // Detect actual placement based on position
    useEffect(() => {
      if (!isOpen || !triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      // Determine actual placement based on the position relative to the trigger
      let detectedPlacement = placement;

      // Check if the content is above or below the trigger
      if (contentRect.bottom < triggerRect.top) {
        if (detectedPlacement.startsWith("bottom")) {
          detectedPlacement = detectedPlacement.replace(
            "bottom",
            "top"
          ) as PopoverPlacement;
        }
      } else if (contentRect.top > triggerRect.bottom) {
        if (detectedPlacement.startsWith("top")) {
          detectedPlacement = detectedPlacement.replace(
            "top",
            "bottom"
          ) as PopoverPlacement;
        }
      }

      // Check if the content is to the left or right of the trigger
      if (contentRect.right < triggerRect.left) {
        if (detectedPlacement.startsWith("right")) {
          detectedPlacement = detectedPlacement.replace(
            "right",
            "left"
          ) as PopoverPlacement;
        }
      } else if (contentRect.left > triggerRect.right) {
        if (detectedPlacement.startsWith("left")) {
          detectedPlacement = detectedPlacement.replace(
            "left",
            "right"
          ) as PopoverPlacement;
        }
      }

      if (detectedPlacement !== actualPlacement) {
        setActualPlacement(detectedPlacement);
      }
    }, [isOpen, position, placement, triggerRef, contentRef, actualPlacement]);

    // Don't render until animation says we should and position is calculated
    // But if we've already done the initial position calculation, we can render
    if (
      !shouldRender ||
      (isOpen && !positionCalculated && !initialPositionRef.current)
    ) {
      // If animation is disabled but we're open, force a position update
      if (!(animateOverride ?? animate) && isOpen && !positionUpdateRef.current) {
        positionUpdateRef.current = true;
        updatePosition();
        setTimeout(() => {
          positionUpdateRef.current = false;
        }, 50);
      }
      return null;
    }

    // Apply a small correction to fix the slight positioning offset
    const positionCorrection = {
      x: position.x,
      y: position.y,
    };

    // Apply minor position corrections based on placement to ensure perfect alignment
    if (
      actualPlacement.startsWith("top") ||
      actualPlacement.startsWith("bottom")
    ) {
      // Center horizontally more precisely
      if (
        !actualPlacement.includes("-start") &&
        !actualPlacement.includes("-end")
      ) {
        positionCorrection.x = Math.round(position.x);
      }
    } else if (
      actualPlacement.startsWith("left") ||
      actualPlacement.startsWith("right")
    ) {
      // Center vertically more precisely
      if (
        !actualPlacement.includes("-start") &&
        !actualPlacement.includes("-end")
      ) {
        positionCorrection.y = Math.round(position.y);
      }
    }

    // For scale animations, we need to ensure the transform origin is set correctly
    const defaultStyles = {
      position: "absolute" as const,
      top: positionCorrection.y,
      left: positionCorrection.x,
      margin: 0,
      zIndex: 1050 + parentChain.length,
      ...(animateOverride ?? animate ? animationStyles : {}),
      // Set transform origin as a CSS variable for scale animations
      ['--transform-origin' as string]: transformOrigin,
    };

    const handleContentClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Determine variant class
    const variantClass = variant || contextVariant ? `popover-${variant || contextVariant}` : "";

    const contentProps = {
      ref: setContentRef,
      style: defaultStyles,
      className: `popover-content ${className} ${variantClass}`,
      id,
      role: roleOverride || role,
      "aria-label": ariaLabelOverride || ariaLabel,
      tabIndex: -1,
      onClick: handleContentClick,
      onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
      onMouseUp: (e: React.MouseEvent) => e.stopPropagation(),
      "data-popover-content": "true",
      "data-animation": currentEffect,
      "data-state": isOpen ? "open" : "closed",
      "data-placement": actualPlacement,
    };

    // Create the popover content with optional arrow
    const popoverContent = (
      <>
        {children}
        {showArrow && (
          <div className="popover-arrow" data-placement={actualPlacement} />
        )}
      </>
    );

    const content =
      asChild && React.isValidElement(children) ? (
        React.cloneElement(
          children as React.ReactElement<{ style?: React.CSSProperties }>,
          {
            ...contentProps,
            style: {
              ...defaultStyles,
              ...(
                children as React.ReactElement<{ style?: React.CSSProperties }>
              ).props.style,
            },
          }
        )
      ) : (
        <div {...contentProps}>{popoverContent}</div>
      );

    // Only use portal on client-side
    if (usePortal && typeof window !== 'undefined') {
      return createPortal(content, document.body);
    }
    
    return content;
  }
);

PopoverContent.displayName = "PopoverContent";
