"use client";

import React from "react";
import { Tooltip } from "@/modules/popover";
import { PopoverPlacement } from "@/modules/popover/popover-types";

export default function TooltipArrowTest() {
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
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Tooltip Arrow Test</h1>
      
      <div className="grid grid-cols-3 gap-8 items-center justify-items-center">
        {placements.map((placement) => (
          <div key={placement} className="flex flex-col items-center">
            <p className="mb-2 font-medium">{placement}</p>
            <Tooltip 
              content={`This tooltip is placed at ${placement}`}
              placement={placement}
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                {placement}
              </button>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Arrow Customization</h2>
        <div className="flex flex-wrap gap-4">
          <Tooltip 
            content="Default arrow style"
            placement="top"
            arrow={true}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Default Arrow
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom styled tooltip and arrow"
            placement="top"
            arrow={true}
            className="custom-tooltip"
          >
            <button className="px-4 py-2 bg-indigo-500 text-white rounded">
              Custom Class
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom background color (green)"
            placement="top"
            arrow={true}
            backgroundColor="#10b981"
          >
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              Green
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom background color (purple)"
            placement="top"
            arrow={true}
            backgroundColor="#8b5cf6"
          >
            <button className="px-4 py-2 bg-purple-500 text-white rounded">
              Purple
            </button>
          </Tooltip>

          <Tooltip 
            content="Custom background color (red)"
            placement="top"
            arrow={true}
            backgroundColor="#ef4444"
          >
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Red
            </button>
          </Tooltip>

          <Tooltip 
            content="No arrow"
            placement="top"
            arrow={false}
          >
            <button className="px-4 py-2 bg-gray-500 text-white rounded">
              No Arrow
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Delay Test</h2>
        <div className="flex flex-wrap gap-4">
          <Tooltip 
            content="No delay"
            placement="top"
            arrow={true}
            openDelay={0}
            closeDelay={0}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              No Delay
            </button>
          </Tooltip>

          <Tooltip 
            content="300ms open delay"
            placement="top"
            arrow={true}
            openDelay={300}
            closeDelay={0}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Open Delay
            </button>
          </Tooltip>

          <Tooltip 
            content="300ms close delay"
            placement="top"
            arrow={true}
            openDelay={0}
            closeDelay={300}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Close Delay
            </button>
          </Tooltip>

          <Tooltip 
            content="300ms open and close delay"
            placement="top"
            arrow={true}
            openDelay={300}
            closeDelay={300}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              Both Delays
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Arrow Positioning Test</h2>
        <div className="flex justify-center items-center h-64 border border-gray-300 rounded-lg relative">
          <div className="grid grid-cols-3 gap-24">
            <Tooltip 
              content="Top-Start"
              placement="top-start"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Top-Start
              </button>
            </Tooltip>

            <Tooltip 
              content="Top"
              placement="top"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Top
              </button>
            </Tooltip>

            <Tooltip 
              content="Top-End"
              placement="top-end"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Top-End
              </button>
            </Tooltip>

            <Tooltip 
              content="Left-Start"
              placement="left-start"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Left-Start
              </button>
            </Tooltip>

            <div className="flex items-center justify-center">
              <span className="text-gray-500">Center</span>
            </div>

            <Tooltip 
              content="Right-Start"
              placement="right-start"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Right-Start
              </button>
            </Tooltip>

            <Tooltip 
              content="Bottom-Start"
              placement="bottom-start"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Bottom-Start
              </button>
            </Tooltip>

            <Tooltip 
              content="Bottom"
              placement="bottom"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Bottom
              </button>
            </Tooltip>

            <Tooltip 
              content="Bottom-End"
              placement="bottom-end"
              arrow={true}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Bottom-End
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
} 