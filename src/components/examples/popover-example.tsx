"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/modules/popover";
import { shift } from "@/modules/popover/middleware";
import { offset } from "@/modules/popover/middleware";

export default function PopoverExample() {
  return (
    <>
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
    </>
  );
}
