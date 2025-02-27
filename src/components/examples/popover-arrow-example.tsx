"use client";

import React from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverPlacement } from "@/modules/popover";

export default function PopoverArrowExample() {
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
      <h1 className="text-2xl font-bold mb-6">Popover with Arrows</h1>
      
      {/* Basic Arrow Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Basic Arrow Example</h2>
        <div className="flex space-x-4">
          <Popover arrow>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                With Arrow
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>This popover has an arrow pointing to the trigger.</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover offset={0}>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                No Arrow
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <p>This popover has no arrow.</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Arrow Placement Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Arrow Placement Examples</h2>
        <div className="grid grid-cols-4 gap-4">
          {placements.map((placement) => (
            <Popover key={placement} placement={placement} arrow>
              <PopoverTrigger asChild>
                <button className="w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  {placement}
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-2">
                  <p>Arrow placement: {placement}</p>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </section>

      {/* Variant Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Variant Examples</h2>
        <div className="flex flex-wrap gap-4">
          <Popover arrow>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-gray-700 text-white rounded">
                Default
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>Default variant</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover arrow variant="primary">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Primary
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>Primary variant</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover arrow variant="info">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded">
                Info
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>Info variant</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover arrow variant="success">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Success
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>Success variant</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover arrow variant="warning">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-amber-600 text-white rounded">
                Warning
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>Warning variant</p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover arrow variant="danger">
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Danger
              </button>
            </PopoverTrigger>
            <PopoverContent arrow>
              <div className="p-2">
                <p>Danger variant</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Rich Content Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Rich Content Example</h2>
        <div className="flex space-x-4">
          <Popover 
            arrow 
            variant="primary"
            autoPlacement
            placement="left"
          >
            <PopoverTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors relative z-10">
                Rich Content
              </button>
            </PopoverTrigger>
            <PopoverContent arrow className="z-50">
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg">Rich Content Example</h3>
                <p>This popover contains rich content with multiple elements.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>List item 1</li>
                  <li>List item 2</li>
                  <li>List item 3</li>
                </ul>
                <div className="pt-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    Action Button
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>
    </div>
  );
} 