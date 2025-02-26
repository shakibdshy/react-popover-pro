 "use client";

import React, { useState } from "react";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  AnimationEffect 
} from "@/modules/popover";

export default function PopoverAnimationExample() {
  const [selectedEffect, setSelectedEffect] = useState<AnimationEffect>("fade");
  const [animationDuration, setAnimationDuration] = useState(200);
  
  const animationEffects: AnimationEffect[] = [
    "fade",
    "scale",
    "shift-away",
    "shift-toward",
    "perspective"
  ];

  return (
    <div className="space-y-12 p-8">
      <h1 className="text-2xl font-bold mb-6">Popover Animation Effects</h1>
      
      {/* Animation Controls */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Animation Controls</h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <div>
            <label className="block text-sm font-medium mb-2">Animation Effect</label>
            <select 
              value={selectedEffect}
              onChange={(e) => setSelectedEffect(e.target.value as AnimationEffect)}
              className="px-3 py-2 border rounded-md w-full"
            >
              {animationEffects.map(effect => (
                <option key={effect} value={effect}>
                  {effect.charAt(0).toUpperCase() + effect.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Animation Duration (ms)</label>
            <input 
              type="range" 
              min="0" 
              max="500" 
              step="50"
              value={animationDuration}
              onChange={(e) => setAnimationDuration(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center mt-1">{animationDuration}ms</div>
          </div>
        </div>
      </section>
      
      {/* Animation Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Animation Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Top Placement */}
          <div className="flex flex-col items-center justify-end h-40 border rounded-md p-4">
            <Popover 
              placement="top" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Top
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Top Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Right Placement */}
          <div className="flex items-center justify-start h-40 border rounded-md p-4">
            <Popover 
              placement="right" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Right
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Right Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Bottom Placement */}
          <div className="flex flex-col items-center justify-start h-40 border rounded-md p-4">
            <Popover 
              placement="bottom" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Bottom
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Bottom Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Left Placement */}
          <div className="flex items-center justify-end h-40 border rounded-md p-4">
            <Popover 
              placement="left" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Left
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Left Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>
      
      {/* Animation Effect Comparison */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Animation Effect Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {animationEffects.map((effect) => (
            <div key={effect} className="flex flex-col items-center space-y-4 border rounded-md p-4">
              <h3 className="font-medium text-lg capitalize">
                {effect.replace('-', ' ')}
              </h3>
              
              <Popover 
                placement="bottom" 
                animationEffect={effect}
                animationDuration={animationDuration}
              >
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    Try {effect.replace('-', ' ')}
                  </button>
                </PopoverTrigger>
                <PopoverContent arrow>
                  <div className="p-3">
                    <p className="font-medium capitalize">{effect.replace('-', ' ')} Animation</p>
                    <p className="text-sm text-gray-600">Duration: {animationDuration}ms</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}