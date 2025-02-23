'use client';

import { Popover, PopoverTrigger, PopoverContent } from '@/modules/popover';

export default function PopoverExample() {
  return (
    <Popover 
      placement="bottom" 
      offset={12}
      defaultOpen={false}
      onOpenChange={(isOpen) => console.log('Popover state:', isOpen)}
    >
      <PopoverTrigger asChild>
        <button>Custom Trigger</button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <div className="bg-white dark:bg-dark-800 p-4 rounded-md shadow-md max-w-sm mx-auto">
          <h2>Custom Content</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil rem quasi itaque rerum, voluptatum placeat corrupti dignissimos voluptate autem, assumenda sequi pariatur labore voluptatibus temporibus expedita. Perferendis obcaecati veritatis at?</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil rem quasi itaque rerum, voluptatum placeat corrupti dignissimos voluptate autem, assumenda sequi pariatur labore voluptatibus temporibus expedita. Perferendis obcaecati veritatis at?</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}