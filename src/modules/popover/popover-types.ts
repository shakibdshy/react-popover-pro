import { ReactNode, RefObject } from 'react';

export interface Position {
  x: number;
  y: number;
}

export type PopoverPlacement = 
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface PopoverContextValue {
  isOpen: boolean;
  triggerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  position: Position;
  placement: PopoverPlacement;
  setIsOpen: (value: boolean) => void;
  setPosition: (position: Position) => void;
}

export interface PopoverProps {
  children: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface PopoverTriggerProps {
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  asChild?: boolean;
}

export interface PopoverContentProps {
  children: React.ReactElement<{ style?: React.CSSProperties }>;
  className?: string;
  asChild?: boolean;
} 