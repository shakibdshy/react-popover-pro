"use client";

import React from "react";
import { Tooltip } from "@/modules/popover";
import { PopoverPlacement } from "@/modules/popover/popover-types";

export default function TooltipExample() {
  const placements: PopoverPlacement[] = [
    "top",
    "top-start",
    "top-end",
    "right",
    "right-start",
    "right-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left",
    "left-start",
    "left-end",
  ];

  return (
    <div className="space-y-12 p-8">
      {/* Section: Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Basic Tooltip</h2>
        <div className="flex items-center space-x-4">
          <Tooltip content="This is a basic tooltip">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Hover Me
            </button>
          </Tooltip>
        </div>
      </section>

      {/* Section: Placements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Tooltip Placements</h2>
        <div className="grid grid-cols-4 gap-4">
          {placements.map((placement) => (
            <Tooltip 
              key={placement} 
              content={`Placement: ${placement}`} 
              placement={placement}
            >
              <button className="w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                {placement}
              </button>
            </Tooltip>
          ))}
        </div>
      </section>

      {/* Section: Customization */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Customized Tooltips</h2>
        <div className="flex flex-wrap gap-4">
          <Tooltip 
            content="No arrow tooltip" 
            arrow={false}
          >
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              No Arrow
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom delay tooltip" 
            openDelay={800}
          >
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Long Delay (800ms)
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom offset tooltip" 
            offset={16}
          >
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Large Offset
            </button>
          </Tooltip>

          <Tooltip 
            content={
              <div className="text-center">
                <h3 className="font-bold mb-1">Rich Content</h3>
                <p>Tooltips can contain complex content</p>
              </div>
            } 
            maxWidth={250}
          >
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Rich Content
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom styled tooltip" 
            className="custom-tooltip"
          >
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Custom Style
            </button>
          </Tooltip>

          <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
            No Tooltip
          </button>
        </div>
      </section>

      {/* Section: Interactive Elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Tooltips on Various Elements</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Tooltip content="Tooltip on icon">
            <span className="cursor-help text-2xl">ℹ️</span>
          </Tooltip>

          <Tooltip content="Tooltip on text">
            <span className="underline cursor-help">Hover over this text</span>
          </Tooltip>

          <Tooltip content="Tooltip on image">
            <img 
              src="https://placehold.co/40" 
              alt="Placeholder" 
              className="rounded cursor-help"
            />
          </Tooltip>

          <Tooltip 
            content="Tooltip on a form element"
            placement="right"
          >
            <input 
              type="text" 
              placeholder="Hover me" 
              className="px-3 py-2 border rounded"
            />
          </Tooltip>
        </div>
      </section>
    </div>
  );
} 