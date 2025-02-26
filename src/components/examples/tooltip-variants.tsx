"use client";

import React from "react";
import { Tooltip } from "@/modules/popover";

export default function TooltipVariants() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Tooltip Variants</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Color Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Tooltip 
              content="Default tooltip style"
              placement="top"
              arrow={true}
            >
              <button className="px-4 py-2 bg-gray-700 text-white rounded">
                Default
              </button>
            </Tooltip>

            <Tooltip 
              content="Primary variant"
              placement="top"
              arrow={true}
              variant="primary"
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Primary
              </button>
            </Tooltip>

            <Tooltip 
              content="Info variant"
              placement="top"
              arrow={true}
              variant="info"
            >
              <button className="px-4 py-2 bg-cyan-600 text-white rounded">
                Info
              </button>
            </Tooltip>

            <Tooltip 
              content="Success variant"
              placement="top"
              arrow={true}
              variant="success"
            >
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Success
              </button>
            </Tooltip>

            <Tooltip 
              content="Warning variant"
              placement="top"
              arrow={true}
              variant="warning"
            >
              <button className="px-4 py-2 bg-amber-600 text-white rounded">
                Warning
              </button>
            </Tooltip>

            <Tooltip 
              content="Danger variant"
              placement="top"
              arrow={true}
              variant="danger"
            >
              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Danger
              </button>
            </Tooltip>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Rich Content</h2>
          <div className="flex flex-wrap gap-4">
            <Tooltip 
              content={
                <div className="space-y-2">
                  <h3 className="font-bold">Rich Content Tooltip</h3>
                  <p>You can include any React elements inside a tooltip.</p>
                  <ul className="list-disc pl-4">
                    <li>List item 1</li>
                    <li>List item 2</li>
                    <li>List item 3</li>
                  </ul>
                </div>
              }
              placement="bottom"
              arrow={true}
              maxWidth={300}
              variant="primary"
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Rich Content
              </button>
            </Tooltip>

            <Tooltip 
              content={
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Tooltip with icon</span>
                </div>
              }
              placement="bottom"
              arrow={true}
              variant="info"
            >
              <button className="px-4 py-2 bg-cyan-600 text-white rounded">
                With Icon
              </button>
            </Tooltip>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Placement Examples</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Tooltip 
              content="Top placement"
              placement="top"
              arrow={true}
              variant="primary"
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Top
              </button>
            </Tooltip>

            <Tooltip 
              content="Right placement"
              placement="right"
              arrow={true}
              variant="success"
            >
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Right
              </button>
            </Tooltip>

            <Tooltip 
              content="Bottom placement"
              placement="bottom"
              arrow={true}
              variant="warning"
            >
              <button className="px-4 py-2 bg-amber-600 text-white rounded">
                Bottom
              </button>
            </Tooltip>

            <Tooltip 
              content="Left placement"
              placement="left"
              arrow={true}
              variant="danger"
            >
              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Left
              </button>
            </Tooltip>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Delay Examples</h2>
          <div className="flex flex-wrap gap-4">
            <Tooltip 
              content="Shows immediately, closes immediately"
              placement="top"
              arrow={true}
              openDelay={0}
              closeDelay={0}
              variant="primary"
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                No Delay
              </button>
            </Tooltip>

            <Tooltip 
              content="Shows after 500ms, closes immediately"
              placement="top"
              arrow={true}
              openDelay={500}
              closeDelay={0}
              variant="info"
            >
              <button className="px-4 py-2 bg-cyan-600 text-white rounded">
                Open Delay (500ms)
              </button>
            </Tooltip>

            <Tooltip 
              content="Shows immediately, closes after 500ms"
              placement="top"
              arrow={true}
              openDelay={0}
              closeDelay={500}
              variant="success"
            >
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Close Delay (500ms)
              </button>
            </Tooltip>

            <Tooltip 
              content="Shows after 500ms, closes after 500ms"
              placement="top"
              arrow={true}
              openDelay={500}
              closeDelay={500}
              variant="warning"
            >
              <button className="px-4 py-2 bg-amber-600 text-white rounded">
                Both Delays (500ms)
              </button>
            </Tooltip>
          </div>
        </section>
      </div>
    </div>
  );
} 