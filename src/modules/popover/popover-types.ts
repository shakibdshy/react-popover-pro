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

export type TriggerMode = 'click' | 'hover' | 'context-menu';

export interface VirtualElement {
  getBoundingClientRect: () => DOMRect;
}

export type Middleware = (position: Position) => Position;

export interface PopoverContextValue {
  isOpen: boolean;
  triggerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  position: Position;
  placement: PopoverPlacement;
  setIsOpen: (value: boolean) => void;
  setPosition: (position: Position) => void;
  // Animation
  animate?: boolean;
  animationDuration?: number;
  animationTiming?: string;
  // Accessibility
  id: string;
  role?: string;
  'aria-label'?: string;
  // Focus management
  autoFocus?: boolean;
  returnFocus?: boolean;
  // Virtual element
  virtualRef?: VirtualElement;
  // Nesting support
  parentId?: string;
  parentContext?: PopoverContextValue | null;
  parentChain: string[];
  nested: boolean;
  // Portal
  portalTarget?: HTMLElement;
  // Navigation
  onKeyDown?: (e: KeyboardEvent) => void;
  // Trigger mode
  triggerMode: TriggerMode;
}

export interface PopoverProps {
  children: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  // Accessibility
  id?: string;
  role?: string;
  'aria-label'?: string;
  // Animation
  animate?: boolean;
  animationDuration?: number;
  animationTiming?: string;
  // Events
  onOpen?: () => void;
  onClose?: () => void;
  onPositionChange?: (position: Position) => void;
  // Advanced features
  virtualRef?: VirtualElement;
  middleware?: Middleware[];
  // Focus management
  autoFocus?: boolean;
  returnFocus?: boolean;
  // New features
  triggerMode?: TriggerMode;
  openDelay?: number;
  closeDelay?: number;
  closeOnClickOutside?: boolean;
  boundaryElement?: HTMLElement | null;
  portalTarget?: HTMLElement;
  autoPlacement?: boolean;
  flip?: boolean;
  shift?: boolean;
  autoSize?: boolean;
  sameWidth?: boolean;
  matchWidth?: boolean;
  preventOverflow?: boolean;
  lazyMount?: boolean;
  keepMounted?: boolean;
}

export interface PopoverTriggerProps {
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  asChild?: boolean;
  disabled?: boolean;
}

export interface PopoverContentProps {
  children: React.ReactElement<{ style?: React.CSSProperties }>;
  className?: string;
  asChild?: boolean;
  // Animation overrides
  animate?: boolean;
  animationDuration?: number;
  animationTiming?: string;
  // Accessibility
  role?: string;
  'aria-label'?: string;
  // Sizing
  width?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
} 