'use client';

import { Position } from './popover-types';

export type Middleware = (position: Position) => Position;

export const shift = (padding = 8): ((position: Position) => Position) => {
  return (position: Position) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    return {
      x: Math.min(
        Math.max(scrollX + padding, position.x),
        scrollX + viewportWidth - padding
      ),
      y: Math.min(
        Math.max(scrollY + padding, position.y),
        scrollY + viewportHeight - padding
      ),
    };
  };
};

export const offset = (value = 5): ((position: Position) => Position) => {
  return (position: Position) => {
    // Apply offset based on the current position relative to the trigger
    const isBelow = position.y > window.scrollY + (window.innerHeight / 2);
    const isRight = position.x > window.scrollX + (window.innerWidth / 2);

    return {
      x: position.x + (isRight ? -value : value),
      y: position.y + (isBelow ? -value : value),
    };
  };
};

export const applyMiddleware = (
  position: Position,
  middleware: Array<(position: Position) => Position>
): Position => {
  return middleware.reduce((pos, fn) => fn(pos), position);
}; 