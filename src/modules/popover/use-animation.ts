'use client';

import { useEffect, useState, CSSProperties } from 'react';
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
  const isScaleAnimation = effect.startsWith('scale');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      
      // Use requestAnimationFrame to ensure the element is rendered before animating
      if (duration > 0) {
        // For scale animations, we need a bit more time to ensure correct positioning
        if (isScaleAnimation) {
          // Delay animation start slightly to ensure position is calculated
          setTimeout(() => {
            requestAnimationFrame(() => {
              setIsAnimating(true);
            });
          }, 10);
        } else {
          requestAnimationFrame(() => {
            setIsAnimating(true);
          });
        }
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
  }, [isOpen, duration, isScaleAnimation]);

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
    
    // Distance for shift effects - varies based on intensity
    const getDistance = (intensity: 'subtle' | 'normal' | 'extreme') => {
      switch (intensity) {
        case 'subtle': return 5;
        case 'normal': return 10;
        case 'extreme': return 20;
      }
    };

    // Scale factor - varies based on intensity
    const getScaleFactor = (intensity: 'subtle' | 'normal' | 'extreme') => {
      switch (intensity) {
        case 'subtle': return 0.85;
        case 'normal': return 0.5;
        case 'extreme': return 0.25;
      }
    };

    // Rotation angle - varies based on intensity
    const getRotationAngle = (intensity: 'subtle' | 'normal' | 'extreme') => {
      switch (intensity) {
        case 'subtle': return 3;
        case 'normal': return 10;
        case 'extreme': return 20;
      }
    };
    
    const direction = isStart ? -1 : 1;
    const axis = isVertical ? 'Y' : 'X';
    
    // Determine the intensity based on the effect name
    const getIntensity = (effectName: string): 'subtle' | 'normal' | 'extreme' => {
      if (effectName.endsWith('-subtle')) return 'subtle';
      if (effectName.endsWith('-extreme')) return 'extreme';
      return 'normal';
    };
    
    // Extract the base effect name without intensity suffix
    const baseEffect = effect.replace(/-subtle$/, '').replace(/-extreme$/, '');
    const intensity = getIntensity(effect);
    
    switch (baseEffect) {
      case 'scale':
        const scaleFactor = getScaleFactor(intensity);
        return {
          start: `scale(${scaleFactor})`,
          end: 'scale(1)',
        };
        
      case 'shift-away':
        const awayDistance = getDistance(intensity);
        return {
          start: `translate${axis}(0)`,
          end: `translate${axis}(${direction * awayDistance}px)`,
        };
        
      case 'shift-toward':
        const towardDistance = getDistance(intensity);
        return {
          start: `translate${axis}(${-direction * towardDistance}px)`,
          end: 'translate(0)',
        };
        
      case 'perspective':
        const rotationAngle = getRotationAngle(intensity);
        return {
          start: `perspective(1000px) rotate${isVertical ? 'X' : 'Y'}(${direction * rotationAngle}deg)`,
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

  // Create styles based on animation state
  const styles: CSSProperties = duration > 0 ? {
    opacity: isAnimating ? 1 : 0,
    transform: isAnimating ? transformValues.end : transformValues.start,
    transformOrigin,
    transition: `opacity ${duration}ms ${timing}, transform ${duration}ms ${timing}`,
    // Ensure the element is visible during animation
    visibility: shouldRender ? 'visible' : 'hidden' as 'visible' | 'hidden',
    // Force hardware acceleration for smoother animations
    willChange: 'opacity, transform',
  } : {
    opacity: 1,
    transform: 'scale(1)',
  };

  return { shouldRender, styles, transformOrigin };
}; 