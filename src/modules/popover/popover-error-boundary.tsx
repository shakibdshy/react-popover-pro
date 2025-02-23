"use client";

import React, { useState, useEffect } from "react";

interface PopoverErrorBoundaryProps {
  children: React.ReactNode;
}

export const PopoverErrorBoundary: React.FC<PopoverErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
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