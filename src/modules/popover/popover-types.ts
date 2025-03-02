/**
 * @module PopoverTypes
 * @description Type definitions for the popover component system.
 * 
 * This module contains all the TypeScript interfaces, types, and enums used
 * throughout the popover component system, ensuring type safety and consistency.
 */

import { ReactNode, RefObject } from 'react';

/**
 * Represents a position with x and y coordinates.
 */
export interface Position {
  /** X-coordinate (horizontal position) */
  x: number;
  /** Y-coordinate (vertical position) */
  y: number;
}

/**
 * Possible placement options for the popover relative to its trigger element.
 * 
 * - Basic placements: top, bottom, left, right
 * - Alignment variations: -start, -end (e.g., top-start, right-end)
 */
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

/**
 * Trigger modes that determine how the popover is activated.
 * 
 * - click: Opens on click, closes on click outside or on trigger
 * - hover: Opens on hover, closes when cursor leaves
 * - context-menu: Opens on right-click (context menu)
 */
export type TriggerMode = 'click' | 'hover' | 'context-menu';

/**
 * Animation effects for popover appearance and disappearance.
 * 
 * - fade: Simple opacity transition
 * - scale: Grows/shrinks from origin point
 * - shift-away/toward: Slides in direction
 * - perspective: 3D rotation effect
 * 
 * Each effect (except fade) has intensity variations: normal, subtle, extreme
 */
export type AnimationEffect = 
  | 'fade'
  | 'scale'
  | 'scale-subtle'
  | 'scale-extreme'
  | 'shift-away'
  | 'shift-away-subtle'
  | 'shift-away-extreme'
  | 'shift-toward'
  | 'shift-toward-subtle'
  | 'shift-toward-extreme'
  | 'perspective'
  | 'perspective-subtle'
  | 'perspective-extreme';

/**
 * Interface for virtual elements that can be used as reference for positioning.
 * Useful for cases where you want to position relative to a point rather than a DOM element.
 */
export interface VirtualElement {
  /** Function that returns the bounding rectangle for positioning */
  getBoundingClientRect: () => DOMRect;
}

/**
 * Middleware function type for modifying popover position.
 * Middleware functions can be chained to adjust the final position.
 */
export type Middleware = (position: Position) => Position;

/**
 * Context value shared between Popover components.
 * Contains all state and functionality needed by child components.
 */
export interface PopoverContextValue {
  /** Whether the popover is currently open */
  isOpen: boolean;
  /** Reference to the trigger element */
  triggerRef: RefObject<HTMLDivElement | null>;
  /** Reference to the content element */
  contentRef: RefObject<HTMLDivElement | null>;
  /** Current position of the popover */
  position: Position;
  /** Current placement of the popover */
  placement: PopoverPlacement;
  /** Function to set the open state */
  setIsOpen: (value: boolean) => void;
  /** Function to set the position */
  setPosition: (position: Position) => void;
  /** Function to update the position based on current state */
  updatePosition: () => void;
  /** Whether animations are enabled */
  animate?: boolean;
  /** Duration of animations in milliseconds */
  animationDuration?: number;
  /** Timing function for animations (e.g., 'ease', 'linear') */
  animationTiming?: string;
  /** Animation effect to use */
  animationEffect?: AnimationEffect;
  /** ID for accessibility and targeting */
  id: string;
  /** ARIA role attribute */
  role?: string;
  /** ARIA label attribute */
  'aria-label'?: string;
  /** Whether to auto-focus the popover when opened */
  autoFocus?: boolean;
  /** Whether to return focus to the trigger when closed */
  returnFocus?: boolean;
  /** Optional virtual element reference */
  virtualRef?: VirtualElement;
  /** ID of the parent popover if nested */
  parentId?: string;
  /** Reference to parent context if nested */
  parentContext?: PopoverContextValue | null;
  /** Chain of parent IDs for proper z-index stacking */
  parentChain: string[];
  /** Whether this popover is nested inside another */
  nested: boolean;
  /** Target element for portal rendering */
  portalTarget?: HTMLElement;
  /** Keyboard event handler */
  onKeyDown?: (e: KeyboardEvent) => void;
  /** Current trigger mode */
  triggerMode: TriggerMode;
  /** Whether to render in a portal */
  portal: boolean;
  /** Whether to show an arrow */
  arrow?: boolean;
  /** Visual variant/style of the popover */
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

/**
 * Props for the main Popover component.
 */
export interface PopoverProps {
  /** Child components (should include PopoverTrigger and PopoverContent) */
  children: ReactNode;
  /** Preferred placement of the popover */
  placement?: PopoverPlacement;
  /** Distance between the popover and its trigger in pixels */
  offset?: number;
  /** Whether the popover is open by default (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Custom ID for the popover */
  id?: string;
  /** ARIA role attribute */
  role?: string;
  /** ARIA label attribute */
  'aria-label'?: string;
  /** Whether animations are enabled */
  animate?: boolean;
  /** Duration of animations in milliseconds */
  animationDuration?: number;
  /** Timing function for animations */
  animationTiming?: string;
  /** Animation effect to use */
  animationEffect?: AnimationEffect;
  /** Callback when popover opens */
  onOpen?: () => void;
  /** Callback when popover closes */
  onClose?: () => void;
  /** Callback when position changes */
  onPositionChange?: (position: Position) => void;
  /** Optional virtual element reference */
  virtualRef?: VirtualElement;
  /** Middleware functions for position adjustment */
  middleware?: Middleware[];
  /** Whether to auto-focus the popover when opened */
  autoFocus?: boolean;
  /** Whether to return focus to the trigger when closed */
  returnFocus?: boolean;
  /** How the popover is triggered */
  triggerMode?: TriggerMode;
  /** Delay before opening in milliseconds (for hover mode) */
  openDelay?: number;
  /** Delay before closing in milliseconds (for hover mode) */
  closeDelay?: number;
  /** Whether to close when clicking outside */
  closeOnClickOutside?: boolean;
  /** Element to use as boundary for positioning */
  boundaryElement?: HTMLElement | null;
  /** Target element for portal rendering */
  portalTarget?: HTMLElement;
  /** Whether to automatically adjust placement to fit viewport */
  autoPlacement?: boolean;
  /** Whether to flip placement when space is insufficient */
  flip?: boolean;
  /** Whether to shift position to keep within viewport */
  shift?: boolean;
  /** Whether to adjust size to fit viewport */
  autoSize?: boolean;
  /** Whether to match width with trigger element */
  sameWidth?: boolean;
  /** Whether to match width with trigger element */
  matchWidth?: boolean;
  /** Whether to prevent overflow outside viewport */
  preventOverflow?: boolean;
  /** Whether to mount content only when opened */
  lazyMount?: boolean;
  /** Whether to keep content mounted when closed */
  keepMounted?: boolean;
  /** Whether to render in a portal */
  portal?: boolean;
  /** Whether to show an arrow */
  arrow?: boolean;
  /** Visual variant/style of the popover */
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

/**
 * Props for the PopoverTrigger component.
 */
export interface PopoverTriggerProps {
  /** The trigger element */
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  /** Whether to merge props onto the child element instead of wrapping */
  asChild?: boolean;
  /** Whether the trigger is disabled */
  disabled?: boolean;
}

/**
 * Props for the PopoverContent component.
 */
export interface PopoverContentProps {
  /** The content to display in the popover */
  children: React.ReactElement<{ style?: React.CSSProperties }> | React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Whether to merge props onto the child element instead of wrapping */
  asChild?: boolean;
  /** Override animation setting from context */
  animate?: boolean;
  /** Override animation duration from context */
  animationDuration?: number;
  /** Override animation timing function from context */
  animationTiming?: string;
  /** Override animation effect from context */
  animationEffect?: AnimationEffect;
  /** Override ARIA role from context */
  role?: string;
  /** Override ARIA label from context */
  'aria-label'?: string;
  /** Width of the popover */
  width?: number | string;
  /** Maximum width of the popover */
  maxWidth?: number | string;
  /** Maximum height of the popover */
  maxHeight?: number | string;
  /** Whether to show an arrow */
  arrow?: boolean;
  /** Visual variant/style of the popover */
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
} 