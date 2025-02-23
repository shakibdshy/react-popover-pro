'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  Position,
} from './popover-types';
import { PopoverProvider, usePopoverContext } from './popover-context';
import { usePopoverPosition } from './use-popover-position';

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = 'bottom',
  offset = 8,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const calculatePosition = usePopoverPosition(triggerRef, contentRef, placement, offset);

  useEffect(() => {
    if (isOpen) {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !triggerRef.current?.contains(event.target as Node) &&
        !contentRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        const newPosition = calculatePosition();
        setPosition(newPosition);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        const newPosition = calculatePosition();
        setPosition(newPosition);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, calculatePosition]);

  return (
    <PopoverProvider
      value={{
        isOpen,
        triggerRef,
        contentRef,
        position,
        placement,
        setIsOpen,
        setPosition,
      }}
    >
      {children}
    </PopoverProvider>
  );
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  children,
  asChild = false,
}) => {
  const { triggerRef, setIsOpen, isOpen } = usePopoverContext();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = {
      ...children.props,
      ref: triggerRef,
      onClick: (e: React.MouseEvent) => {
        handleClick();
        children.props.onClick?.(e);
      },
    };
    return React.cloneElement(children, childProps);
  }

  return (
    <div ref={triggerRef} onClick={handleClick}>
      {children}
    </div>
  );
};

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className = '',
  asChild = false,
}) => {
  const { isOpen, contentRef, position } = usePopoverContext();

  if (!isOpen) return null;

  const defaultStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    zIndex: 1000,
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = {
      ...children.props,
      ref: contentRef,
      style: {
        ...defaultStyles,
        ...children.props.style,
      },
    };
    return createPortal(React.cloneElement(children, childProps), document.body);
  }

  return createPortal(
    <div
      ref={contentRef}
      style={defaultStyles}
      className={className}
    >
      {children}
    </div>,
    document.body
  );
}; 