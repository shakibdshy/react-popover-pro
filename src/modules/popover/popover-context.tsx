'use client';
import { createContext, useContext } from 'react';
import { PopoverContextValue } from './popover-types';

const PopoverContext = createContext<PopoverContextValue | null>(null);

export const PopoverProvider = PopoverContext.Provider;

export const usePopoverContext = (required: boolean = true) => {
  const context = useContext(PopoverContext);
  
  if (required && !context) {
    throw new Error('usePopoverContext must be used within a PopoverProvider');
  }
  
  return context;
}; 