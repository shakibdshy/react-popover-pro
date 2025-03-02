"use client";

/**
 * @module PopoverErrorBoundary
 * @description Error boundary component for handling errors in popover components.
 * 
 * The PopoverErrorBoundary catches JavaScript errors in popover components
 * and displays a fallback UI instead of crashing the entire application.
 * This improves the user experience by gracefully handling errors.
 */

import React, { useState, useEffect } from "react";

/**
 * Props for the PopoverErrorBoundary component.
 */
interface PopoverErrorBoundaryProps {
  /**
   * The child components that this error boundary will wrap.
   */
  children: React.ReactNode;
}

/**
 * Error boundary component that catches JavaScript errors in popover components.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render
 * @returns {React.ReactElement} The children or an error message if an error occurred
 */
export const PopoverErrorBoundary: React.FC<PopoverErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  /**
   * Set up an error event listener to catch errors in the component tree.
   */
  useEffect(() => {
    /**
     * Handler for error events.
     * 
     * @param {ErrorEvent} event - The error event
     */
    const handleError = (event: ErrorEvent) => {
      console.error("Popover error:", event.error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong with the popover.</div>;
  }

  return <>{children}</>;
}; 