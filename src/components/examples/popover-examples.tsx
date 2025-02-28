"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPlacement,
  AnimationEffect,
} from "@/modules/popover";
import { shift, offset } from "@/modules/popover/middleware";

export default function PopoverExamples() {
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [selectedAnimationEffect, setSelectedAnimationEffect] =
    useState<AnimationEffect>("fade");
  const [animationDuration, setAnimationDuration] = useState(200);

  // Group animation effects by type
  const animationEffectGroups = {
    Fade: ["fade"] as AnimationEffect[],
    Scale: ["scale", "scale-subtle", "scale-extreme"] as AnimationEffect[],
    "Shift Away": [
      "shift-away",
      "shift-away-subtle",
      "shift-away-extreme",
    ] as AnimationEffect[],
    "Shift Toward": [
      "shift-toward",
      "shift-toward-subtle",
      "shift-toward-extreme",
    ] as AnimationEffect[],
    Perspective: [
      "perspective",
      "perspective-subtle",
      "perspective-extreme",
    ] as AnimationEffect[],
  };

  // Flatten the animation effects for the dropdown
  const allAnimationEffects = Object.values(animationEffectGroups).flat();

  // Define placements
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

  // Define basic placements for simpler demos
  const basicPlacements: PopoverPlacement[] = [
    "top",
    "right",
    "bottom",
    "left",
  ];

  const sections = [
    { id: "basic", label: "Basic Usage" },
    { id: "placement", label: "Placement Options" },
    { id: "triggers", label: "Trigger Modes" },
    { id: "arrows", label: "Arrows & Variants" },
    { id: "animations", label: "Animations" },
    { id: "advanced", label: "Advanced Features" },
    { id: "nested", label: "Nested Popovers" },
  ];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Popover Component Examples</h1>

      {/* Navigation */}
      <nav className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 shadow-md rounded-md">
        <ul className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeSection === section.id
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Basic Usage Section */}
      {activeSection === "basic" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Basic Usage</h2>

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              The most basic usage of the Popover component with default
              settings.
            </p>

            <div className="flex space-x-4 items-center">
              <Popover arrow>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                  >
                    Click Me
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">Basic Popover</h3>
                    <p>This is a basic popover with default settings.</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Custom Content</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can customize the content of your popover with any React
              elements.
            </p>

            <Popover placement="right" arrow>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Rich Content
                </button>
              </PopoverTrigger>
              <PopoverContent className="max-w-md">
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg">Rich Content Example</h3>
                  <p>
                    This popover contains rich content with multiple elements.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You can add lists</li>
                    <li>Format text in various ways</li>
                    <li>Include interactive elements</li>
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
      )}

      {/* Placement Options Section */}
      {activeSection === "placement" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Placement Options</h2>

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Popovers can be placed in 12 different positions around the
              trigger element.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {placements.map((placement) => (
                <Popover key={placement} placement={placement}>
                  <PopoverTrigger asChild>
                    <button className="w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                      {placement}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="p-2">
                      <p className="font-medium">Placement: {placement}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Offset Examples</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can adjust the distance between the trigger and the popover.
            </p>

            <div className="flex flex-wrap gap-4">
              {[0, 8, 16, 24].map((offsetValue) => (
                <Popover
                  key={offsetValue}
                  placement="bottom"
                  offset={offsetValue}
                >
                  <PopoverTrigger asChild>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                      Offset: {offsetValue}px
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="p-2">
                      <p>Offset value: {offsetValue}px</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trigger Modes Section */}
      {activeSection === "triggers" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Trigger Modes</h2>

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Popovers can be triggered in different ways: by clicking,
              hovering, or right-clicking.
            </p>

            <div className="flex flex-wrap gap-4">
              <Popover triggerMode="click">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    Click Trigger
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <p>This popover opens on click (default behavior).</p>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover triggerMode="hover" openDelay={200} closeDelay={300} placement="top">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    Hover Trigger
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <p>This popover opens on hover with 200ms delay.</p>
                    <p className="text-sm text-gray-500">
                      It will close after 300ms when you move away.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover triggerMode="context-menu">
                <PopoverTrigger asChild>
                  <div className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors cursor-context-menu">
                    Right-Click Me
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <p>This popover opens on right-click (context menu).</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Hover Delay Example</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You can control the delay for opening and closing hover-triggered
              popovers.
            </p>

            <div className="flex flex-wrap gap-4">
              {[0, 200, 500, 1000].map((delay) => (
                <Popover
                  key={`open-${delay}`}
                  triggerMode="hover"
                  openDelay={delay}
                  closeDelay={300}
                >
                  <PopoverTrigger asChild>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                      Open: {delay}ms
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="p-2">
                      <p>Opens after {delay}ms delay</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Arrows & Variants Section */}
      {activeSection === "arrows" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Arrows & Variants</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Arrow Examples</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Popovers can have arrows pointing to their trigger elements.
            </p>

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

              <Popover>
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
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Arrow Placement</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Arrows automatically adjust based on the popover placement.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {basicPlacements.map((placement) => (
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
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Variant Examples</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Popovers come in different visual variants.
            </p>

            <div className="flex flex-wrap gap-4">
              <Popover arrow>
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded">
                    Default
                  </button>
                </PopoverTrigger>
                <PopoverContent arrow>
                  <p>Default variant</p>
                </PopoverContent>
              </Popover>

              <Popover arrow variant="primary">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded">
                    Primary
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>Primary variant</p>
                </PopoverContent>
              </Popover>

              <Popover arrow variant="info">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-info-500 text-white rounded">
                    Info
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>Info variant</p>
                </PopoverContent>
              </Popover>

              <Popover arrow variant="success">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-success-500 text-white rounded">
                    Success
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>Success variant</p>
                </PopoverContent>
              </Popover>

              <Popover arrow variant="warning">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-warning-500 text-white rounded">
                    Warning
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>Warning variant</p>
                </PopoverContent>
              </Popover>

              <Popover arrow variant="danger">
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-danger-600 text-white rounded">
                    Danger
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>Danger variant</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>
      )}

      {/* Animations Section */}
      {activeSection === "animations" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Animations</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Animation Controls</h3>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Animation Effect
                </label>
                <select
                  value={selectedAnimationEffect}
                  onChange={(e) =>
                    setSelectedAnimationEffect(
                      e.target.value as AnimationEffect
                    )
                  }
                  className="px-3 py-2 border rounded-md w-full"
                >
                  {allAnimationEffects.map((effect) => (
                    <option key={effect} value={effect}>
                      {effect
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Animation Duration (ms)
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="50"
                  value={animationDuration}
                  onChange={(e) => setAnimationDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-center mt-1">
                  {animationDuration}ms
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Animation Examples</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try the selected animation effect with different placements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {basicPlacements.map((placement) => (
                <div
                  key={placement}
                  className={`flex ${
                    placement === "top"
                      ? "flex-col items-center justify-end"
                      : placement === "right"
                      ? "items-center justify-start"
                      : placement === "bottom"
                      ? "flex-col items-center justify-start"
                      : "items-center justify-end"
                  } h-40 border rounded-md p-4`}
                >
                  <Popover
                    placement={placement}
                    animationEffect={selectedAnimationEffect}
                    animationDuration={animationDuration}
                  >
                    <PopoverTrigger asChild>
                      <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                        {placement.charAt(0).toUpperCase() + placement.slice(1)}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent arrow>
                      <div className="p-3">
                        <p className="font-medium">
                          {placement.charAt(0).toUpperCase() +
                            placement.slice(1)}{" "}
                          Placement
                        </p>
                        <p className="text-sm text-gray-600">
                          Animation: {selectedAnimationEffect}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>

          {/* Animation Effect Groups */}
          {Object.entries(animationEffectGroups).map(([groupName, effects]) => (
            <div key={groupName} className="space-y-4">
              <h3 className="text-xl font-semibold">{groupName} Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {effects.map((effect) => (
                  <div
                    key={effect}
                    className="flex flex-col items-center space-y-4 border rounded-md p-4"
                  >
                    <h4 className="font-medium text-lg capitalize">
                      {effect
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </h4>

                    <Popover
                      placement="bottom"
                      animationEffect={effect}
                      animationDuration={animationDuration}
                    >
                      <PopoverTrigger asChild>
                        <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                          Try Effect
                        </button>
                      </PopoverTrigger>
                      <PopoverContent arrow>
                        <div className="p-3">
                          <p className="font-medium capitalize">
                            {effect
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </p>
                          <p className="text-sm text-gray-600">
                            Duration: {animationDuration}ms
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Advanced Features Section */}
      {activeSection === "advanced" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Advanced Features</h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Auto Placement</h3>
            <p className="text-gray-600 dark:text-gray-300">
              The popover will automatically find the best placement.
            </p>

            <Popover autoPlacement>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Auto Placement
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">
                  <p>
                    This popover uses auto placement to find the best position.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Middleware</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use middleware to customize positioning behavior.
            </p>

            <Popover middleware={[offset(10), shift(20)]}>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  With Middleware
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">
                  <p>This popover uses offset and shift middleware.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="text-xl font-semibold">No Portal</h3>
            <p className="my-4 text-gray-600 dark:text-gray-300">
              You can render the popover in the DOM hierarchy.
            </p>

            <Popover portal={false}>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  No Portal
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-gray-900 dark:text-gray-50">
                  Rendered in DOM hierarchy.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">More Advanced Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Popover autoSize sameWidth>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    Auto-sized Popover
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <p>This popover matches the width of its trigger.</p>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover flip shift>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    Flip & Shift
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <p>This popover will flip and shift to stay in view.</p>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover defaultOpen>
                <PopoverTrigger asChild>
                  <button className="w-full px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    Default Open
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-2">
                    <p>This popover opens by default when the page loads.</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>
      )}

      {/* Nested Popovers Section */}
      {activeSection === "nested" && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Nested Popovers</h2>

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Popovers can be nested to create multi-level menus.
            </p>

            <Popover placement="bottom" offset={8}>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Level 1
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-4 p-3">
                  <h3 className="font-bold">Level 1 Menu</h3>
                  <p>This is the first level</p>

                  <Popover placement="right" offset={8}>
                    <PopoverTrigger asChild>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        Level 2 →
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-4 p-3">
                        <h3 className="font-bold">Level 2 Menu</h3>
                        <p>This is the second level</p>

                        <Popover placement="right" offset={8}>
                          <PopoverTrigger asChild>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                              Level 3 →
                            </button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="space-y-4 p-3">
                              <h3 className="font-bold">Level 3 Menu</h3>
                              <p>This is the third level</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>
      )}
    </div>
  );
}
