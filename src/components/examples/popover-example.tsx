"use client";

import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/modules/popover";
import { shift, offset } from "@/modules/popover/middleware";
import PopoverFeaturesExample from "./popover-features-example";
import TooltipExample from "./tooltip-example";
import TooltipArrowTest from "./tooltip-arrow-test";

export default function PopoverExample() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Set portal target after component mounts
  useEffect(() => {
    if (portalRef.current) {
      setPortalTarget(portalRef.current);
    }
  }, []);

  return (
    <div className="space-x-4">
      {/* Deep Nested Popover Example */}
      <Popover
        placement="bottom"
        offset={8}
        animate={true}
        animationDuration={200}
        animationTiming="ease-out"
      >
        <PopoverTrigger asChild>
          <button className="px-4 py-2 bg-primary-500 text-white rounded">Level 1</button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-4">
            <h3 className="font-bold">Level 1 Menu</h3>
            
            <Popover placement="right" offset={8}>
              <PopoverTrigger asChild>
                <button className="w-full px-4 py-2 text-left hover:bg-primary-700 rounded">
                  Level 2 →
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-4">
                  <h3 className="font-bold">Level 2 Menu</h3>
                  
                  <Popover placement="right" offset={8}>
                    <PopoverTrigger asChild>
                      <button className="w-full px-4 py-2 text-left hover:bg-primary-700 rounded">
                        Level 3 →
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="space-y-4">
                        <h3 className="font-bold">Level 3 Menu</h3>
                        
                        <Popover placement="right" offset={8}>
                          <PopoverTrigger asChild>
                            <button className="w-full px-4 py-2 text-left hover:bg-primary-700 rounded">
                              Level 4 →
                            </button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="space-y-4">
                              <h3 className="font-bold">Level 4 Menu</h3>
                              <p>This is the deepest level!</p>
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
        </PopoverContent>
      </Popover>

      {/* Hover Trigger Example */}
      <Popover
        placement="bottom"
        offset={8}
        triggerMode="hover"
        openDelay={200}
        closeDelay={500}
      >
        <PopoverTrigger asChild>
          <button className="px-4 py-2 bg-primary-500 text-white rounded">
            Hover Me
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <h3 className="font-bold mb-2">Hover Triggered Popover</h3>
            <p>
              This popover opens on hover after a 200ms delay and closes after a 500ms delay.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover
        placement="bottom"
        offset={12}
        defaultOpen={false}
        onOpenChange={(isOpen) => console.log("Popover state:", isOpen)}
      >
        <PopoverTrigger asChild>
          <button>Custom Trigger</button>
        </PopoverTrigger>
        <PopoverContent asChild>
          <div className="bg-white dark:bg-dark-800 p-4 rounded-md shadow-md max-w-sm mx-auto">
            <h2>Custom Content</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil
              rem quasi itaque rerum, voluptatum placeat corrupti dignissimos
              voluptate autem, assumenda sequi pariatur labore voluptatibus
              temporibus expedita. Perferendis obcaecati veritatis at?
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil
              rem quasi itaque rerum, voluptatum placeat corrupti dignissimos
              voluptate autem, assumenda sequi pariatur labore voluptatibus
              temporibus expedita. Perferendis obcaecati veritatis at?
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover
        placement="bottom"
        offset={8}
        animate={true}
        animationDuration={200}
        animationTiming="ease-out"
        autoFocus={true}
        returnFocus={true}
        middleware={[offset(5), shift(8)]}
        role="dialog"
        aria-label="Menu"
        onOpenChange={(isOpen) => console.log("Open state:", isOpen)}
        onPositionChange={(pos) => console.log("New position:", pos)}
      >
        <PopoverTrigger asChild>
          <button>Open Menu</button>
        </PopoverTrigger>
        <PopoverContent className="bg-white dark:bg-dark-800 p-4 rounded-md shadow-md">
          <div>Your menu content here</div>
        </PopoverContent>
      </Popover>

      {/* New Features Example */}
      <div>
        <h2>New Features</h2>
        
        {/* Portal Target */}
        <div ref={portalRef} id="popover-portal" style={{ position: "relative", zIndex: 9999 }}></div>
        {portalTarget && (
          <Popover portalTarget={portalTarget}>
            <PopoverTrigger asChild>
              <button>Custom Portal</button>
            </PopoverTrigger>
            <PopoverContent>
              <div>This popover is rendered in a custom portal target.</div>
            </PopoverContent>
          </Popover>
        )}

        {/* Auto-sizing */}
        <Popover autoSize sameWidth>
          <PopoverTrigger asChild>
            <button>Auto-sized Popover</button>
          </PopoverTrigger>
          <PopoverContent>
            <div>This popover automatically adjusts its size to match the trigger width.</div>
          </PopoverContent>
        </Popover>

        {/* Flip and Shift */}
        <Popover flip shift>
          <PopoverTrigger asChild>
            <button>Flippable Popover</button>
          </PopoverTrigger>
          <PopoverContent>
            <div>This popover will flip and shift to stay within the viewport.</div>
          </PopoverContent>
        </Popover>

        {/* Context Menu */}
        <Popover triggerMode="context-menu">
          <PopoverTrigger asChild>
            <div className="bg-gray-900 p-4">
              Right-click me for a context menu!
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div>This is a context menu popover.</div>
          </PopoverContent>
        </Popover>

        {/* Touch Optimized */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-8 py-4 text-xl">
              Touch-friendly Popover
            </button>
          </PopoverTrigger>
          <PopoverContent className="text-xl p-6">
            <div>This popover has larger tap targets and touch-friendly interactions.</div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Popover Features Example */}
      <PopoverFeaturesExample />

      <TooltipExample />
      <TooltipArrowTest />
    </div>
  );
}
