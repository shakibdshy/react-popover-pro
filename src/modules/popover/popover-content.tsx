"use client";

/**
 * @module PopoverContent
 * @description A flexible and customizable popover content component that handles positioning, animations, 
 * focus management, and accessibility concerns.
 * 
 * The PopoverContent component is responsible for rendering the actual content of a popover. It:
 * - Handles positioning relative to its trigger element
 * - Supports various animation effects (fade, scale, etc.)
 * - Manages focus trapping and return focus behavior
 * - Implements proper accessibility attributes
 * - Supports arrow indicators with automatic positioning
 * - Updates position on resize, scroll, and content changes
 * - Can be rendered in a portal or inline
 * 
 * This component must be used within a Popover component as it relies on context from the parent.
 */

import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { PopoverContentProps, PopoverPlacement } from "./popover-types";
import { usePopoverContext } from "./popover-context";
import { useFocusManagement } from "./use-focus-management";
import { useAnimation } from "./use-animation";
import { useArrowPosition } from "./use-arrow-position";
import "./popover.css";

/**
 * PopoverContent component renders the content part of a popover with positioning and animation.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be displayed in the popover
 * @param {string} [props.className=""] - Additional CSS class names
 * @param {boolean} [props.asChild=false] - Whether to merge props onto the child element
 * @param {boolean} [props.animate] - Override the animation setting from context
 * @param {number} [props.animationDuration] - Override the animation duration from context
 * @param {string} [props.animationTiming] - Override the animation timing function from context
 * @param {string} [props.animationEffect] - Override the animation effect from context
 * @param {string} [props.role] - ARIA role attribute override
 * @param {string} [props.aria-label] - ARIA label attribute override
 * @param {boolean} [props.arrow=false] - Whether to show an arrow pointer
 * @param {string} [props.variant] - Visual variant of the popover
 * @returns {React.ReactElement|null} The rendered popover content or null if not visible
 * @throws {Error} Throws an error if used outside of a Popover component
 */
export const PopoverContent = React.memo<PopoverContentProps>(
  ({
    children,
    className = "",
    asChild = false,
    animate: animateOverride,
    animationDuration: durationOverride,
    animationTiming: timingOverride,
    animationEffect: effectOverride,
    role: roleOverride,
    "aria-label": ariaLabelOverride,
    arrow = false,
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
      portal,
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
    
    const { calculateArrowPosition } = useArrowPosition();
    
    const currentEffect = effectOverride || animationEffect || "fade";
    const isScaleAnimation = currentEffect.startsWith("scale");

    /**
     * Updates the arrow position based on the current placement and positions of
     * trigger and content elements.
     */
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
      
      lastArrowStylesRef.current = newArrowStyles;
      setArrowStyles(newArrowStyles);
    }, [calculateArrowPosition, triggerRef, contentRef, actualPlacement]);
    
    /**
     * Custom ref callback that updates the content position when the element is mounted.
     * Handles different position update strategies based on animation type.
     * 
     * @param {HTMLDivElement|null} node - The DOM node being referenced
     */
    const setContentRef = useCallback((node: HTMLDivElement | null) => {
      contentRef.current = node;
      
      if (node && isOpen && !positionUpdateRef.current) {
        positionUpdateRef.current = true;
        isClosingRef.current = false;
        
        if (isScaleAnimation) {
          updatePosition();
          positionUpdateCountRef.current = 1;
          
          requestAnimationFrame(() => {
            updatePosition();
            positionUpdateCountRef.current = 2;
            
            setTimeout(() => {
              updatePosition();
              positionUpdateCountRef.current = 3;
              
              setTimeout(() => {
                updatePosition();
                positionUpdateCountRef.current = 4;
                setPositionCalculated(true);
                positionUpdateRef.current = false;
                
                updateArrowPosition();
              }, 20);
            }, 20);
          });
        } else {
          updatePosition();
          
          setTimeout(() => {
            updatePosition();
            setPositionCalculated(true);
            positionUpdateRef.current = false;
            
            updateArrowPosition();
          }, 10);
        }
      }
    }, [contentRef, isOpen, updatePosition, isScaleAnimation, updateArrowPosition]);

    const showArrow = arrow || contextArrow;

    // Hook to manage focus trapping and return focus behavior
    useFocusManagement(isOpen, contentRef, autoFocus, returnFocus);

    /**
     * Get animation styles and render state based on current animation settings
     */
    const { shouldRender, styles: animationStyles, transformOrigin } = useAnimation(
      isOpen,
      durationOverride || animationDuration,
      timingOverride || animationTiming,
      currentEffect,
      actualPlacement
    );

    /**
     * Calculate position immediately when component mounts or isOpen changes.
     * Uses useLayoutEffect to calculate positions before browser painting.
     */
    useLayoutEffect(() => {
      if (!isOpen) {
        isClosingRef.current = true;
        return;
      }
      
      if (!triggerRef.current) {
        initialPositionRef.current = false;
        return;
      }
      
      isClosingRef.current = false;
      
      if (!initialPositionRef.current) {
        updatePosition();
        
        initialPositionRef.current = true;
        
        const delay = isScaleAnimation ? 30 : 20;
        
        const timer = setTimeout(() => {
          updatePosition(); 
          
          if (isScaleAnimation) {
            setTimeout(() => {
              updatePosition();
              
              setTimeout(() => {
                updatePosition();
                setPositionCalculated(true);
                
                updateArrowPosition();
              }, 20);
            }, 20);
          } else {
            setPositionCalculated(true);
            
            updateArrowPosition();
          }
        }, delay);
        
        return () => {
          clearTimeout(timer);
        };
      }
    }, [isOpen, triggerRef, updatePosition, isScaleAnimation, updateArrowPosition]);
    
    /**
     * Uses ResizeObserver to detect and respond to content size changes.
     * Updates popover position and arrow when content dimensions change.
     */
    useEffect(() => {
      if (!isOpen || !contentRef.current) return;
      
      const resizeObserver = new ResizeObserver(() => {
        if (!positionUpdateRef.current && !isClosingRef.current) {
          positionUpdateRef.current = true;
          updatePosition();
          
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

    /**
     * Resets position calculation state when popover closes to prepare for next open.
     */
    useEffect(() => {
      if (!isOpen) {
        isClosingRef.current = true;
        setPositionCalculated(false);
        initialPositionRef.current = false;
        positionUpdateRef.current = false;
        positionUpdateCountRef.current = 0;
      } else {
        isClosingRef.current = false;
      }
    }, [isOpen]);

    /**
     * Handles repositioning on window resize and scroll events.
     * Adds smooth transitions during repositioning.
     */
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;

      const handleResize = () => {
        if (!positionUpdateRef.current && !isClosingRef.current) {
          positionUpdateRef.current = true;
          
          if (contentRef.current) {
            contentRef.current.classList.add('position-transitioning');
          }
          
          updatePosition();
          
          updateArrowPosition();
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
            positionUpdateRef.current = false;
          }, 300); 
        }
      };

      const handleScroll = () => {
        if (!positionUpdateRef.current && !isClosingRef.current) {
          positionUpdateRef.current = true;
          
          if (contentRef.current) {
            contentRef.current.classList.add('position-transitioning');
          }
          
          updatePosition();
          
          updateArrowPosition();
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
            positionUpdateRef.current = false;
          }, 300); 
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
    }, [isOpen, triggerRef, updatePosition, updateArrowPosition, contentRef]);

    /**
     * Detects and updates the actual placement of the popover based on its
     * position relative to the trigger element. This ensures the arrow and animations
     * correctly reflect the actual placement when autoPlacement adjusts positioning.
     */
    useEffect(() => {
      if (!isOpen || !triggerRef.current || !contentRef.current || isClosingRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let detectedPlacement = placement;

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
        
        updateArrowPosition();
        
        if (contentRef.current) {
          contentRef.current.classList.add('position-transitioning');
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.classList.remove('position-transitioning');
            }
          }, 300); 
        }
      }
    }, [isOpen, position, placement, triggerRef, contentRef, actualPlacement, updateArrowPosition]);

    // Don't render until animation says we should and position is calculated
    // But if we've already done the initial position calculation, we can render
    if (
      !shouldRender ||
      (isOpen && !positionCalculated && !initialPositionRef.current)
    ) {
      if (!(animateOverride ?? animate) && isOpen && !positionUpdateRef.current) {
        positionUpdateRef.current = true;
        updatePosition();
        setTimeout(() => {
          positionUpdateRef.current = false;
        }, 50);
      }
      return null;
    }

    /**
     * Apply position corrections and transform origin for proper placement and animations.
     */
    const positionCorrection = {
      x: position.x,
      y: position.y,
    };

    if (
      actualPlacement.startsWith("top") ||
      actualPlacement.startsWith("bottom")
    ) {
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

    const defaultStyles = {
      position: "absolute" as const,
      top: positionCorrection.y,
      left: positionCorrection.x,
      margin: 0,
      zIndex: 1050 + parentChain.length,
      ...(animateOverride ?? animate ? animationStyles : {}),
      ['--transform-origin' as string]: transformOrigin,
    };

    /**
     * Stops click events from propagating through the popover content.
     * Prevents the popover from closing when clicking inside it.
     * 
     * @param {React.MouseEvent} e - The click event
     */
    const handleContentClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const variantClass = variant || contextVariant ? `popover-${variant || contextVariant}` : "";

    /**
     * Common props applied to the popover content element
     */
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

    /**
     * Renders either a clone of the child element with merged props or a new div with the content.
     * If asChild is true and children is a valid element, props are merged onto the child.
     * Otherwise, a new div wrapper is created with the content.
     */
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

    /**
     * Uses React createPortal to render the content in a portal if specified.
     * This allows the popover to escape any overflow:hidden or z-index stacking contexts.
     */
    // Only use portal on client-side
    if (portal && typeof window !== 'undefined') {
      // Use portalTarget from context or fall back to document.body
      const target = context.portalTarget || document.body;
      return createPortal(content, target);
    }
    
    return content;
  }
);

PopoverContent.displayName = "PopoverContent";
