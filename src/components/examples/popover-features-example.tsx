"use client";

import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/modules/popover";
import { shift, offset } from "@/modules/popover/middleware";
import { PopoverPlacement } from "@/modules/popover/popover-types";

/**
 * PopoverFeaturesExample Component
 * 
 * A comprehensive example showcasing various features of the Popover component:
 * - Basic usage
 * - Placement options
 * - Offset and positioning
 * - Open state control
 * - Animation effects
 * - Middleware integration
 * - Different trigger modes
 * - Auto-placement
 * - Portal rendering
 */
export default function PopoverFeaturesExample() {
  const placements: PopoverPlacement[] = ["top", "right", "bottom", "left"];

  return (
    <div className="space-y-12 p-8">
      {/* Section: Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Basic Usage</h2>
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Basic Popover
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-gray-900 dark:text-gray-50">This is a basic popover.</p>
          </PopoverContent>
        </Popover>
      </section>

      {/* Section: Placement Options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Placement Options</h2>
        <div className="flex space-x-4">
          {placements.map((placement) => (
            <Popover key={placement} placement={placement}>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  {placement.charAt(0).toUpperCase() + placement.slice(1)}
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-gray-900 dark:text-gray-50">
                  This popover is placed on the {placement}.
                </p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </section>

      {/* Section: Offset and Animation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Offset & Animation</h2>
        <div className="flex space-x-4">
          <Popover offset={20}>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                With Offset
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">20px offset from trigger.</p>
            </PopoverContent>
          </Popover>

          <Popover animate animationDuration={500} animationTiming="ease-in-out">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Animated
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Smooth animation effect.</p>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Section: Trigger Modes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Trigger Modes</h2>
        <div className="flex space-x-4">
          <Popover triggerMode="click">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Click Trigger
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Opens on click.</p>
            </PopoverContent>
          </Popover>

          <Popover triggerMode="hover" openDelay={200} closeDelay={500}>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Hover Trigger
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Opens on hover with delay.</p>
            </PopoverContent>
          </Popover>

          <Popover triggerMode="context-menu">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Context Menu
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Right-click to open.</p>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Section: Advanced Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Advanced Features</h2>
        <div className="grid grid-cols-2 gap-4">
          <Popover autoPlacement>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Auto Placement
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Automatically adjusts position.</p>
            </PopoverContent>
          </Popover>

          <Popover middleware={[offset(10), shift(20)]}>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                With Middleware
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Uses offset and shift middleware.</p>
            </PopoverContent>
          </Popover>

          <Popover usePortal={false}>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                No Portal
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Rendered in DOM hierarchy.</p>
            </PopoverContent>
          </Popover>

          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                Default Open
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-gray-900 dark:text-gray-50">Opens by default.</p>
            </PopoverContent>
          </Popover>
        </div>
      </section>
    </div>
  );
} 