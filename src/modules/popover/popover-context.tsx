'use client';
import { createContext, useContext } from 'react';
import { PopoverContextValue } from './popover-types';

const PopoverContext = createContext<PopoverContextValue | undefined>(undefined);

export const PopoverProvider = PopoverContext.Provider;

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  
  if (context === undefined) {
    throw new Error('usePopoverContext must be used within a PopoverProvider');
  }
  
  return context;
}; 