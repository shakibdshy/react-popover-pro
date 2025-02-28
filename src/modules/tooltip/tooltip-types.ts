import { ReactNode } from 'react';
import { 
  PopoverPlacement, 
  AnimationEffect, 
  VirtualElement, 
  Middleware 
} from '../popover/popover-types';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  id?: string;
  role?: string;
  'aria-label'?: string;
  animate?: boolean;
  animationDuration?: number;
  animationTiming?: string;
  animationEffect?: AnimationEffect;
  onOpen?: () => void;
  onClose?: () => void;
  virtualRef?: VirtualElement;
  middleware?: Middleware[];
  autoFocus?: boolean;
  returnFocus?: boolean;
  openDelay?: number;
  closeDelay?: number;
  portalTarget?: HTMLElement;
  portal?: boolean;
  arrow?: boolean;
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  /**
   * Whether to automatically adjust placement to fit in viewport.
   * Set to false to strictly follow the specified placement.
   * @default false
   */
  autoPlacement?: boolean;
  /**
   * Whether to flip placement when there's no space in specified direction.
   * Set to false to strictly follow the specified placement.
   * @default false
   */
  flip?: boolean;
  maxWidth?: number | string;
  className?: string;
} 