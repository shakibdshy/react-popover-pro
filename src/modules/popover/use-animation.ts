'use client';

import { useEffect, useState } from 'react';
import { AnimationEffect, PopoverPlacement } from './popover-types';

export const useAnimation = (
  isOpen: boolean,
  duration: number = 200,
  timing: string = 'ease',
  effect: AnimationEffect = 'fade',
  placement: PopoverPlacement = 'bottom'
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      
      if (duration > 0) {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      } else {
        setIsAnimating(true);
      }
    } else {
      if (duration > 0) {
        setIsAnimating(false);
        
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, duration);
        return () => clearTimeout(timer);
      } else {
        setIsAnimating(false);
        setShouldRender(false);
      }
    }
  }, [isOpen, duration]);

  // Get transform origin based on placement
  const getTransformOrigin = () => {
    switch (placement) {
      case 'top':
        return 'bottom center';
      case 'top-start':
        return 'bottom left';
      case 'top-end':
        return 'bottom right';
      case 'bottom':
        return 'top center';
      case 'bottom-start':
        return 'top left';
      case 'bottom-end':
        return 'top right';
      case 'left':
        return 'right center';
      case 'left-start':
        return 'right top';
      case 'left-end':
        return 'right bottom';
      case 'right':
        return 'left center';
      case 'right-start':
        return 'left top';
      case 'right-end':
        return 'left bottom';
      default:
        return 'center';
    }
  };

  // Get transform values based on animation effect and placement
  const getTransformValues = () => {
    // Direction based on placement
    const isVertical = placement.startsWith('top') || placement.startsWith('bottom');
    const isStart = placement.startsWith('top') || placement.startsWith('left');
    
    // Distance for shift effects
    const distance = 10;
    const direction = isStart ? -1 : 1;
    const axis = isVertical ? 'Y' : 'X';
    
    switch (effect) {
      case 'scale':
        return {
          start: 'scale(0.95)',
          end: 'scale(1)',
        };
      case 'shift-away':
        return {
          start: `translate${axis}(0)`,
          end: `translate${axis}(${direction * distance}px)`,
        };
      case 'shift-toward':
        return {
          start: `translate${axis}(${-direction * distance}px)`,
          end: 'translate(0)',
        };
      case 'perspective':
        return {
          start: `perspective(1000px) rotate${isVertical ? 'X' : 'Y'}(${direction * 10}deg)`,
          end: 'perspective(1000px) rotate(0)',
        };
      case 'fade':
      default:
        return {
          start: 'translate(0)',
          end: 'translate(0)',
        };
    }
  };

  const transformOrigin = getTransformOrigin();
  const transformValues = getTransformValues();

  const styles = duration > 0 ? {
    opacity: isAnimating ? 1 : 0,
    transform: isAnimating ? transformValues.end : transformValues.start,
    transformOrigin,
    transition: `opacity ${duration}ms ${timing}, transform ${duration}ms ${timing}`,
  } : {
    opacity: 1,
    transform: 'scale(1)',
  };

  return { shouldRender, styles };
}; 