'use client';

/**
 * @module PopoverContext
 * @description Context provider for sharing popover state between components.
 * 
 * The PopoverContext provides a way to share state and functionality between
 * the Popover component and its children (PopoverTrigger and PopoverContent).
 * This allows these components to communicate without prop drilling.
 */

import { createContext, useContext } from 'react';
import { PopoverContextValue } from './popover-types';

/**
 * Context for sharing popover state between components.
 */
const PopoverContext = createContext<PopoverContextValue | null>(null);

/**
 * Provider component for PopoverContext.
 */
export const PopoverProvider = PopoverContext.Provider;

/**
 * Hook to access the popover context.
 * 
 * @param {boolean} [required=true] - Whether the context is required to be present
 * @returns {PopoverContextValue|null} The popover context value
 * @throws {Error} Throws an error if required is true and the context is not available
 */
export const usePopoverContext = (required: boolean = true) => {
  const context = useContext(PopoverContext);
  
  if (required && !context) {
    throw new Error('usePopoverContext must be used within a PopoverProvider');
  }
  
  return context;
}; 