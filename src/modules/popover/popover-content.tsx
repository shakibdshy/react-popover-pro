"use client";

import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { PopoverContentProps, PopoverPlacement } from "./popover-types";
import { usePopoverContext } from "./popover-context";
import { useFocusManagement } from "./use-focus-management";
import { useAnimation } from "./use-animation";
import { useArrowPosition } from "./use-arrow-position";
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
    const arrowRef = useRef<HTMLDivElement>(null);
    const [arrowStyles, setArrowStyles] = useState<React.CSSProperties>({});
    const lastArrowStylesRef = useRef<React.CSSProperties>({});
    const isClosingRef = useRef(false);
    
    // Get the arrow position calculation function
    const { calculateArrowPosition } = useArrowPosition();
    
    // Determine if we're using a scale animation
    const currentEffect = effectOverride || animationEffect || "fade";
    const isScaleAnimation = currentEffect.startsWith("scale");

    // Update arrow position helper function
    const updateArrowPosition = useCallback(() => {
      if (!arrowRef.current || !triggerRef.current || !contentRef.current || isClosingRef.current) {
        return;
      }
      
      const newArrowStyles = calculateArrowPosition(
        triggerRef,
        contentRef,
        actualPlacement,
        arrowRef
      );
      
      // Store the last valid arrow styles
      lastArrowStylesRef.current = newArrowStyles;
      setArrowStyles(newArrowStyles);
    }, [calculateArrowPosition, triggerRef, contentRef, actualPlacement]);
    
    // Create a custom ref that will update position when the element is mounted
    const setContentRef = useCallback((node: HTMLDivElement | null) => {
      // Set the ref
      contentRef.current = node;
      
      // If node exists and popover is open, update position
      if (node && isOpen && !positionUpdateRef.current) {
        positionUpdateRef.current = true;
        isClosingRef.current = false;
        
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
                
                // Update arrow position after content position is stable
                updateArrowPosition();
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
            
            // Update arrow position after content position is stable
            updateArrowPosition();
          }, 10);
        }
      }
    }, [contentRef, isOpen, updatePosition, isScaleAnimation, updateArrowPosition]);

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
      if (!isOpen) {
        // Mark as closing to prevent arrow position updates during close animation
        isClosingRef.current = true;
        return;
      }
      
      if (!triggerRef.current) {
        initialPositionRef.current = false;
        return;
      }
      
      // Reset closing state when opening
      isClosingRef.current = false;
      
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
                
                // Update arrow position after content position is stable
                updateArrowPosition();
              }, 20);
            }, 20);
          } else {
            setPositionCalculated(true);
            
            // Update arrow position after content position is stable
            updateArrowPosition();
          }
        }, delay);
        
        return () => {
          clearTimeout(timer);
        };
      }
    }, [isOpen, triggerRef, updatePosition, isScaleAnimation, updateArrowPosition]);
    
    // Add a resize observer to update position when content size changes
    useEffect(() => {
      if (!isOpen || !contentRef.current) return;
      
      const resizeObserver = new ResizeObserver(() => {
        if (!positionUpdateRef.current && !isClosingRef.current) {
          positionUpdateRef.current = true;
          updatePosition();
          
          // Update arrow position after content position is updated
          updateArrowPosition();
          
          setTimeout(() => {
            positionUpdateRef.current = false;
          }, 50);
        }
      });
      
      resizeObserver.observe(contentRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }, [isOpen, contentRef, updatePosition, updateArrowPosition]);

    // Reset position calculated state when popover closes
    useEffect(() => {
      if (!isOpen) {
        // Mark as closing to prevent arrow position updates during close animation
        isClosingRef.current = true;
        setPositionCalculated(false);
        initialPositionRef.current = false;
        positionUpdateRef.current = false;
        positionUpdateCountRef.current = 0;
        // Don't reset arrow styles here to prevent the arrow from moving during close animation
      } else {
        // Reset closing state when opening
        isClosingRef.current = false;
      }
    }, [isOpen]);

    // Update position on resize and scroll
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;

      const handleResize = () => {
        if (!positionUpdateRef.current && !isClosingRef.current) {
          positionUpdateRef.current = true;
          
          // Add transition class before updating position
          if (contentRef.current) {
            contentRef.current.classList.add('position-transitioning');
          }
          
          // Update position
          updatePosition();
          
          // Update arrow position after content position is updated
          updateArrowPosition();
          
          // Remove transition class after the transition completes
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
            positionUpdateRef.current = false;
          }, 300); // Match the transition duration in CSS
        }
      };

      const handleScroll = () => {
        if (!positionUpdateRef.current && !isClosingRef.current) {
          positionUpdateRef.current = true;
          
          // Add transition class before updating position
          if (contentRef.current) {
            contentRef.current.classList.add('position-transitioning');
          }
          
          // Update position
          updatePosition();
          
          // Update arrow position after content position is updated
          updateArrowPosition();
          
          // Remove transition class after the transition completes
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
            positionUpdateRef.current = false;
          }, 300); // Match the transition duration in CSS
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
    }, [isOpen, triggerRef, updatePosition, updateArrowPosition]);

    // Detect actual placement based on position
    useEffect(() => {
      if (!isOpen || !triggerRef.current || !contentRef.current || isClosingRef.current) return;

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
        
        // Update arrow position when placement changes
        updateArrowPosition();
        
        // Add transition class when placement changes
        if (contentRef.current) {
          contentRef.current.classList.add('position-transitioning');
          
          // Remove the class after the transition completes
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
          }, 300); // Match the transition duration in CSS
        }
      }
    }, [isOpen, position, placement, triggerRef, contentRef, actualPlacement, updateArrowPosition]);

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
          <div 
            ref={arrowRef}
            className="popover-arrow" 
            data-placement={actualPlacement} 
            style={isClosingRef.current ? lastArrowStylesRef.current : arrowStyles}
          />
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
