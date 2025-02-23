'use client';

import { RefObject, useCallback, useEffect, useState } from 'react';
import { PopoverPlacement } from './popover-types';

interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const getViewportRect = (): Rect => ({
  top: window.scrollY,
  left: window.scrollX,
  right: window.scrollX + window.innerWidth,
  bottom: window.scrollY + window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight,
});

const getBoundingRect = (element: HTMLElement | null, boundary: HTMLElement | null): Rect => {
  if (!element) return getViewportRect();
  
  const rect = element.getBoundingClientRect();
  const boundaryRect = boundary?.getBoundingClientRect() || getViewportRect();
  
  return {
    top: Math.max(rect.top, boundaryRect.top),
    left: Math.max(rect.left, boundaryRect.left),
    right: Math.min(rect.right, boundaryRect.right),
    bottom: Math.min(rect.bottom, boundaryRect.bottom),
    width: rect.width,
    height: rect.height,
  };
};

const getAvailableSpace = (
  triggerRect: Rect,
  contentRect: Rect,
  boundaryRect: Rect
): Record<PopoverPlacement, number> => {
  return {
    'top': triggerRect.top - boundaryRect.top,
    'top-start': triggerRect.top - boundaryRect.top,
    'top-end': triggerRect.top - boundaryRect.top,
    'bottom': boundaryRect.bottom - triggerRect.bottom,
    'bottom-start': boundaryRect.bottom - triggerRect.bottom,
    'bottom-end': boundaryRect.bottom - triggerRect.bottom,
    'left': triggerRect.left - boundaryRect.left,
    'left-start': triggerRect.left - boundaryRect.left,
    'left-end': triggerRect.left - boundaryRect.left,
    'right': boundaryRect.right - triggerRect.right,
    'right-start': boundaryRect.right - triggerRect.right,
    'right-end': boundaryRect.right - triggerRect.right,
  };
};

const getBaseAxis = (placement: PopoverPlacement): 'top' | 'bottom' | 'left' | 'right' => {
  return placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
};

const getOptimalPlacement = (
  preferredPlacement: PopoverPlacement,
  triggerRect: Rect,
  contentRect: Rect,
  boundaryRect: Rect
): PopoverPlacement => {
  const availableSpace = getAvailableSpace(triggerRect, contentRect, boundaryRect);
  const requiredSpace = {
    top: contentRect.height,
    bottom: contentRect.height,
    left: contentRect.width,
    right: contentRect.width,
  };

  // Check if preferred placement has enough space
  const baseAxis = getBaseAxis(preferredPlacement);
  if (availableSpace[preferredPlacement] >= requiredSpace[baseAxis]) {
    return preferredPlacement;
  }

  // Find the placement with maximum available space
  const placements = Object.entries(availableSpace) as [PopoverPlacement, number][];
  const [optimalPlacement] = placements.reduce((acc, curr) => {
    return curr[1] > acc[1] ? curr : acc;
  });

  return optimalPlacement;
};

export const useAutoPlacement = (
  triggerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  preferredPlacement: PopoverPlacement,
  boundaryElement: HTMLElement | null = null,
  enabled: boolean = true
) => {
  const [placement, setPlacement] = useState<PopoverPlacement>(preferredPlacement);

  const updatePlacement = useCallback(() => {
    if (!enabled || !triggerRef.current || !contentRef.current) return;

    const triggerRect = getBoundingRect(triggerRef.current, boundaryElement);
    const contentRect = getBoundingRect(contentRef.current, boundaryElement);
    const boundaryRect = getBoundingRect(boundaryElement, null);

    const optimalPlacement = getOptimalPlacement(
      preferredPlacement,
      triggerRect,
      contentRect,
      boundaryRect
    );

    if (optimalPlacement !== placement) {
      setPlacement(optimalPlacement);
    }
  }, [enabled, triggerRef, contentRef, preferredPlacement, boundaryElement, placement]);

  useEffect(() => {
    updatePlacement();

    if (!enabled) return;

    const resizeObserver = new ResizeObserver(updatePlacement);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    if (boundaryElement) resizeObserver.observe(boundaryElement);

    window.addEventListener('scroll', updatePlacement, { passive: true });
    window.addEventListener('resize', updatePlacement, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updatePlacement);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [enabled, updatePlacement]);

  return placement;
}; 